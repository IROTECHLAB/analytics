import { NextResponse, type NextRequest } from 'next/server';
import { getSiteByPublicKey } from '@/lib/db/queries/sites';
import { getUserById } from '@/lib/db/queries/users';
import { recordEvent } from '@/lib/db/queries/events';
import { isSiteOverQuota } from '@/lib/db/queries/usage';
import { parseUserAgent } from '@/lib/utils/user-agent';
import { getCountry, getClientIp } from '@/lib/utils/geo';
import { deriveVisitorId, deriveSessionId } from '@/lib/utils/visitor';
import { effectivePlan } from '@/lib/plans';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Max-Age': '86400',
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS_HEADERS });
}

export async function POST(req: NextRequest) {
  let body: any;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: 'bad_json' },
      { status: 400, headers: CORS_HEADERS }
    );
  }
  return handleCollect(req, {
    siteKey: body.site ?? '',
    path: body.path ?? '/',
    referrer: body.ref ?? null,
    type: body.type === 'event' ? 'event' : 'pageview',
    eventName: body.name ?? null,
    screen: body.screen ?? null,
    language: body.language ?? null,
    utmSource: body.utmSource ?? null,
    utmMedium: body.utmMedium ?? null,
    utmCampaign: body.utmCampaign ?? null,
  });
}

export async function GET(req: NextRequest) {
  const u = new URL(req.url);
  const wantsDebug = u.searchParams.get('debug') === '1';

  const result = await handleCollect(req, {
    siteKey: u.searchParams.get('site') ?? '',
    path: u.searchParams.get('path') ?? '/',
    referrer: u.searchParams.get('ref'),
    type: u.searchParams.get('type') === 'event' ? 'event' : 'pageview',
    eventName: u.searchParams.get('name'),
    screen: null,
    language: null,
    utmSource: null,
    utmMedium: null,
    utmCampaign: null,
  });

  if (wantsDebug) return result;

  const PIXEL = Buffer.from(
    'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
    'base64'
  );
  return new NextResponse(PIXEL, {
    status: 200,
    headers: {
      'Content-Type': 'image/gif',
      'Cache-Control': 'no-store',
      ...CORS_HEADERS,
    },
  });
}

async function handleCollect(
  req: NextRequest,
  input: {
    siteKey: string;
    path: string;
    referrer: string | null;
    type: 'pageview' | 'event';
    eventName: string | null;
    screen: string | null;
    language: string | null;
    utmSource: string | null;
    utmMedium: string | null;
    utmCampaign: string | null;
  }
): Promise<NextResponse> {
  try {
    if (!input.siteKey) {
      return NextResponse.json(
        { error: 'no_site' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    const site = await getSiteByPublicKey(input.siteKey);
    if (!site) {
      return NextResponse.json(
        { error: 'unknown_site' },
        { status: 404, headers: CORS_HEADERS }
      );
    }

    // ─── Plan checks ───────────────────────────────────
    const owner = await getUserById(site.userId);
    if (owner?.disabled) {
      return NextResponse.json(
        { ok: false, reason: 'account_disabled' },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    const plan = effectivePlan(owner?.plan, owner?.planExpiresAt);
    if (await isSiteOverQuota(site.id, plan.maxEventsPerMonth)) {
      return NextResponse.json(
        { ok: false, reason: 'quota_exceeded' },
        { status: 200, headers: CORS_HEADERS }
      );
    }

    // ─── Capture ───────────────────────────────────────
    const ua = req.headers.get('user-agent');
    const parsed = parseUserAgent(ua);
    const country = getCountry(req);
    const ip = getClientIp(req);

    const visitorId = deriveVisitorId({
      sitePublicKey: site.publicKey,
      ip,
      userAgent: ua,
    });
    const sessionId = deriveSessionId(visitorId);

    let referrer = input.referrer;
    if (referrer) {
      try {
        const refHost = new URL(referrer).hostname;
        referrer =
          refHost === site.domain || refHost.endsWith(`.${site.domain}`)
            ? null
            : refHost;
      } catch {
        referrer = null;
      }
    }

    await recordEvent({
      siteId: site.id,
      type: input.type,
      eventName: input.eventName,
      path: input.path.slice(0, 500),
      referrer,
      country,
      device: parsed.device,
      browser: parsed.browser,
      os: parsed.os,
      screen: input.screen,
      language: input.language,
      utmSource: input.utmSource,
      utmMedium: input.utmMedium,
      utmCampaign: input.utmCampaign,
      visitorId,
      sessionId,
    });

    return NextResponse.json({ ok: true }, { status: 200, headers: CORS_HEADERS });
  } catch (e: any) {
    console.error('[collect] error', e?.message);
    return NextResponse.json(
      { error: 'server', message: e?.message },
      { status: 500, headers: CORS_HEADERS }
    );
  }
}
