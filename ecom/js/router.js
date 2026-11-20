(function (E) {
  'use strict';

  let onChange = function () {};
  let lastPath = null;

  function decode(value) {
    try { return decodeURIComponent(value); } catch (err) { return value; }
  }

  function parse() {
    const raw = (location.hash || '#/').replace(/^#/, '') || '/';
    const queryAt = raw.indexOf('?');
    const path = (queryAt === -1 ? raw : raw.slice(0, queryAt)) || '/';
    const params = new URLSearchParams(queryAt === -1 ? '' : raw.slice(queryAt + 1));
    const parts = path.split('/').filter(Boolean).map(decode);
    return {
      name: parts[0] || 'home',
      id: parts[1] || '',
      params: params,
      path: '/' + parts.join('/')
    };
  }

  function emit(fromHash) {
    const route = parse();
    const pathChanged = route.path !== lastPath;
    const isFirst = lastPath === null;
    lastPath = route.path;
    if (pathChanged) window.scrollTo(0, 0);
    onChange(route, { track: fromHash !== false, focus: pathChanged && !isFirst });
  }

  E.router = {
    parse: parse,
    start: function (fn) {
      onChange = fn;
      window.addEventListener('hashchange', function () { emit(true); });
      if (!location.hash) location.hash = '/';
      else emit(true);
    },
    refresh: function () {
      onChange(parse(), { track: false, focus: false });
    },
    shopHash: function (updates) {
      const params = new URLSearchParams(parse().params);
      Object.keys(updates).forEach(function (key) {
        if (updates[key]) params.set(key, updates[key]);
        else params.delete(key);
      });
      const query = params.toString();
      return '/shop' + (query ? '?' + query : '');
    }
  };
})(window.Ecom = window.Ecom || {});
