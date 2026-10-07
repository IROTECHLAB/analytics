(function () {
  'use strict';

  var script = document.currentScript;
  if (!script) return;

  var siteKey = script.getAttribute('data-site');
  if (!siteKey) return;

  var src = script.src || '';
  var idx = src.indexOf('/script.js');
  var origin = idx >= 0 ? src.substring(0, idx) : location.origin;
  var endpoint = origin + '/api/collect';

  var debug = script.getAttribute('data-debug') === '1';
  function log() {
    if (debug) console.log.apply(console, ['[iro]'].concat([].slice.call(arguments)));
  }

  // ─── Screen bucket ────────────────────────────────────
  function screenBucket() {
    var w = screen.width || window.innerWidth || 0;
    if (w < 640) return 'Mobile';
    if (w < 1024) return 'Tablet';
    if (w < 1440) return 'Laptop';
    if (w < 1920) return 'Desktop';
    return 'Large';
  }

  // ─── UTM params ───────────────────────────────────────
  function getUtm() {
    var params = new URLSearchParams(location.search);
    return {
      utmSource: params.get('utm_source'),
      utmMedium: params.get('utm_medium'),
      utmCampaign: params.get('utm_campaign'),
    };
  }

  // ─── Send ─────────────────────────────────────────────
  function send(payload) {
    payload.site = siteKey;
    payload.screen = screenBucket();
    payload.language = navigator.language || null;

    var utm = getUtm();
    if (utm.utmSource) payload.utmSource = utm.utmSource;
    if (utm.utmMedium) payload.utmMedium = utm.utmMedium;
    if (utm.utmCampaign) payload.utmCampaign = utm.utmCampaign;

    var data = JSON.stringify(payload);
    log('sending', payload);

    try {
      if (navigator.sendBeacon) {
        var blob = new Blob([data], { type: 'application/json' });
        var ok = navigator.sendBeacon(endpoint, blob);
        log('beacon', ok);
        if (ok) return;
      }
    } catch (e) {
      log('beacon failed', e);
    }

    var img = new Image();
    img.src =
      endpoint +
      '?site=' + encodeURIComponent(siteKey) +
      '&path=' + encodeURIComponent(payload.path || location.pathname) +
      '&ref=' + encodeURIComponent(payload.ref || document.referrer || '') +
      '&type=' + encodeURIComponent(payload.type || 'pageview') +
      (payload.name ? '&name=' + encodeURIComponent(payload.name) : '') +
      '&_=' + Date.now();
  }

  function pageview(path) {
    send({
      type: 'pageview',
      path: path || location.pathname + location.search,
      ref: document.referrer || '',
    });
  }

  function track(eventName, props) {
    send({
      type: 'event',
      name: eventName,
      path: location.pathname + location.search,
      ref: props ? JSON.stringify(props) : '',
    });
  }

  // ─── Auto-track pageview ──────────────────────────────
  pageview();

  // ─── SPA route changes ────────────────────────────────
  var pushState = history.pushState;
  history.pushState = function () {
    pushState.apply(this, arguments);
    setTimeout(function () {
      pageview();
    }, 0);
  };
  window.addEventListener('popstate', function () {
    pageview();
  });

  // ─── Outbound links ───────────────────────────────────
  function isOutbound(url) {
    try {
      var u = new URL(url, location.href);
      return u.hostname !== location.hostname;
    } catch (e) {
      return false;
    }
  }

  // ─── File downloads ───────────────────────────────────
  var DL_EXT = /\.(pdf|zip|rar|7z|tar|gz|tgz|docx?|xlsx?|pptx?|csv|txt|mp3|mp4|mov|avi|dmg|exe|apk|ipa)(\?|$)/i;

  function isDownload(url) {
    try {
      var u = new URL(url, location.href);
      return DL_EXT.test(u.pathname);
    } catch (e) {
      return false;
    }
  }

  document.addEventListener(
    'click',
    function (e) {
      var a = e.target && e.target.closest ? e.target.closest('a') : null;
      if (!a || !a.href) return;

      if (isDownload(a.href)) {
        track('download', { url: a.href });
        return;
      }

      if (isOutbound(a.href)) {
        track('outbound', { url: a.href });
      }
    },
    true
  );

  // ─── Public API ───────────────────────────────────────
  window.iro = window.iro || {};
  window.iro.track = track;
  window.iro.pageview = pageview;
  log('script ready');
})();
