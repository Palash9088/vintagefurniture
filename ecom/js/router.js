(function (E) {
  'use strict';

  var TRACKING_KEYS = ['id', 'path'];
  var SHOP_KEYS = ['category', 'q', 'sort'];
  var onChange = function () {};
  var lastPath = null;

  function decode(value) {
    try { return decodeURIComponent(value); } catch (err) { return value; }
  }

  function appBase() {
    if (window.EcomBase) return window.EcomBase;
    return '/ecom/';
  }

  function parse() {
    var base = appBase();
    var pathname = location.pathname;
    var rest = pathname.indexOf(base) === 0 ? pathname.slice(base.length) : pathname.replace(/^\//, '');
    rest = rest.replace(/^\/+|\/+$/g, '');
    if (rest === 'index.html') rest = '';
    var parts = rest ? rest.split('/').map(decode) : [];
    return {
      name: parts[0] || 'home',
      id: parts[1] || '',
      params: new URLSearchParams(location.search),
      path: '/' + parts.join('/')
    };
  }

  function trackingParams() {
    var current = new URLSearchParams(location.search);
    var params = new URLSearchParams();
    TRACKING_KEYS.forEach(function (key) {
      if (current.get(key)) params.set(key, current.get(key));
    });
    return params;
  }

  function href(routePath, updates) {
    var path = routePath || '/';
    if (path.charAt(0) !== '/') path = '/' + path;
    var params = trackingParams();
    if (path === '/shop') {
      var current = new URLSearchParams(location.search);
      SHOP_KEYS.forEach(function (key) {
        var hasUpdate = updates && Object.prototype.hasOwnProperty.call(updates, key);
        var value = hasUpdate ? updates[key] : (updates ? current.get(key) : '');
        if (value) params.set(key, value);
      });
    }
    var base = appBase();
    var urlPath = path === '/' ? base : base.replace(/\/$/, '') + path;
    var query = params.toString();
    return urlPath + (query ? '?' + query : '');
  }

  function emit(track) {
    var route = parse();
    var pathChanged = route.path !== lastPath;
    var isFirst = lastPath === null;
    lastPath = route.path;
    if (pathChanged) window.scrollTo(0, 0);
    onChange(route, { track: track !== false, focus: pathChanged && !isFirst });
  }

  function visit(next) {
    if (next !== location.pathname + location.search) history.pushState(null, '', next);
    emit(true);
  }

  function onLinkClick(event) {
    if (event.defaultPrevented || event.button !== 0) return;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    var link = event.target.closest('a[href]');
    if (!link) return;
    var raw = link.getAttribute('href') || '';
    if (!raw || raw.charAt(0) === '#') return;
    var url;
    try { url = new URL(link.href, location.href); } catch (err) { return; }
    if (url.origin !== location.origin) return;
    var base = appBase();
    if (url.pathname !== base.replace(/\/$/, '') && url.pathname.indexOf(base) !== 0) return;
    event.preventDefault();
    var current = new URLSearchParams(location.search);
    TRACKING_KEYS.forEach(function (key) {
      if (current.get(key) && !url.searchParams.has(key)) url.searchParams.set(key, current.get(key));
    });
    var query = url.searchParams.toString();
    visit(url.pathname + (query ? '?' + query : ''));
  }

  E.router = {
    parse: parse,
    href: href,
    start: function (fn) {
      onChange = fn;
      window.addEventListener('popstate', function () { emit(true); });
      document.addEventListener('click', onLinkClick);
      if (location.pathname.endsWith('/index.html')) {
        history.replaceState(null, '', appBase() + location.search);
      }
      emit(true);
    },
    refresh: function () {
      onChange(parse(), { track: false, focus: false });
    },
    go: function (routePath, updates) {
      visit(href(routePath, updates));
    }
  };
})(window.Ecom = window.Ecom || {});
