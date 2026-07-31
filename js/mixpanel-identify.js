(function () {
  function getVisitorUuid() {
    var vin = window.VWO && window.VWO.data && window.VWO.data.vin;
    if (vin && vin.uuid) return vin.uuid;

    vin = window.Wingify && window.Wingify.data && window.Wingify.data.vin;
    if (vin && vin.uuid) return vin.uuid;

    var match = document.cookie.match(/(?:^|;\s*)(?:_vwo_uuid|_wingify_uuid)=([^;]*)/);
    return match ? decodeURIComponent(match[1]) : null;
  }

  function identifyMixpanelWithVisitorUuid(attempt) {
    attempt = attempt || 0;
    var uuid = getVisitorUuid();

    if (uuid && window.mixpanel && typeof mixpanel.identify === 'function') {
      mixpanel.identify(uuid);
      console.log('[Mixpanel] Identified visitor:', uuid);
      return;
    }

    if (attempt >= 100) {
      console.warn('[Mixpanel] Visitor UUID not available after retries; skipping identify.');
      return;
    }

    setTimeout(function () {
      identifyMixpanelWithVisitorUuid(attempt + 1);
    }, 200);
  }

  identifyMixpanelWithVisitorUuid();
})();
