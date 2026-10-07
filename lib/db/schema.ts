import {
  pgTable,
  uuid,
  text,
  timestamp,
  boolean,
  integer,
  bigserial,
  index,
  uniqueIndex,
} from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: uuid('id').primaryKey(),
  email: text('email'),
  emailVerified: boolean('email_verified').default(false),
  name: text('name'),
  givenName: text('given_name'),
  familyName: text('family_name'),
  picture: text('picture'),
  plan: text('plan').default('free').notNull(),
  planExpiresAt: timestamp('plan_expires_at', { withTimezone: true }),
  disabled: boolean('disabled').default(false).notNull(),
  planUpdatedAt: timestamp('plan_updated_at', { withTimezone: true }).defaultNow(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
});

export const sessions = pgTable(
  'sessions',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    refreshTokenEnc: text('refresh_token_enc').notNull(),
    expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    userIdx: index('sessions_user_idx').on(t.userId),
  })
);

export const sites = pgTable(
  'sites',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    domain: text('domain').notNull(),
    name: text('name').notNull(),
    publicKey: text('public_key').notNull(),
    shareToken: text('share_token'),
    shareEnabled: boolean('share_enabled').default(false).notNull(),
    createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    publicKeyIdx: uniqueIndex('sites_public_key_idx').on(t.publicKey),
    shareTokenIdx: uniqueIndex('sites_share_token_idx').on(t.shareToken),
    userIdx: index('sites_user_idx').on(t.userId),
  })
);

export const events = pgTable(
  'events',
  {
    id: bigserial('id', { mode: 'number' }).primaryKey(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    type: text('type').notNull(),
    eventName: text('event_name'),
    path: text('path'),
    referrer: text('referrer'),
    country: text('country'),
    device: text('device'),
    browser: text('browser'),
    os: text('os'),
    screen: text('screen'),
    language: text('language'),
    utmSource: text('utm_source'),
    utmMedium: text('utm_medium'),
    utmCampaign: text('utm_campaign'),
    sessionId: uuid('session_id'),
    visitorId: text('visitor_id'),
    timestamp: timestamp('timestamp', { withTimezone: true }).defaultNow().notNull(),
  },
  (t) => ({
    siteTimeIdx: index('events_site_time_idx').on(t.siteId, t.timestamp),
    sitePathIdx: index('events_site_path_idx').on(t.siteId, t.path),
    siteTypeIdx: index('events_site_type_idx').on(t.siteId, t.type),
  })
);

export const sessionAnalytics = pgTable(
  'session_analytics',
  {
    id: uuid('id').primaryKey().defaultRandom(),
    siteId: uuid('site_id')
      .notNull()
      .references(() => sites.id, { onDelete: 'cascade' }),
    visitorId: text('visitor_id').notNull(),
    startedAt: timestamp('started_at', { withTimezone: true }).defaultNow().notNull(),
    endedAt: timestamp('ended_at', { withTimezone: true }),
    pageviews: integer('pageviews').default(0).notNull(),
    entryPage: text('entry_page'),
    exitPage: text('exit_page'),
  },
  (t) => ({
    siteIdx: index('sessions_analytics_site_idx').on(t.siteId),
  })
);

export const processedWebhooks = pgTable('processed_webhooks', {
  id: text('id').primaryKey(),
  event: text('event').notNull(),
  receivedAt: timestamp('received_at', { withTimezone: true }).defaultNow().notNull(),
});

export const adminSessions = pgTable('admin_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  tokenHash: text('token_hash').notNull().unique(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export type User = typeof users.$inferSelect;
export type Site = typeof sites.$inferSelect;
export type Event = typeof events.$inferSelect;
export type SessionRow = typeof sessions.$inferSelect;
export type AdminSession = typeof adminSessions.$inferSelect;
