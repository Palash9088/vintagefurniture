/**
 * Lightweight bouncing-target mini-game for smartcode3 banners.
 * Defers animation until idle to avoid impacting page load.
 */
(function () {
  function startGame(banner, target, scoreEl) {
    if (banner.dataset.sc3GameStarted) return;
    banner.dataset.sc3GameStarted = '1';

    var score = 0;
    var x = banner.clientWidth * 0.6;
    var y = banner.clientHeight * 0.4;
    var vx = 2.2;
    var vy = 1.8;
    var size = 44;

    function padRandom(max, s) {
      var p = s / 2;
      return p + Math.random() * (max - s);
    }

    function placeTarget() {
      target.style.left = x + 'px';
      target.style.top = y + 'px';
    }

    function tick() {
      var w = banner.clientWidth;
      var h = banner.clientHeight;
      var pad = size / 2;

      x += vx;
      y += vy;

      if (x < pad || x > w - pad) { vx *= -1; x = Math.max(pad, Math.min(w - pad, x)); }
      if (y < pad || y > h - pad) { vy *= -1; y = Math.max(pad, Math.min(h - pad, y)); }

      placeTarget();
      requestAnimationFrame(tick);
    }

    target.addEventListener('click', function () {
      score += 1;
      scoreEl.textContent = String(score);
      target.classList.add('sc3-target--hit');
      vx = (Math.random() > 0.5 ? 1 : -1) * (2 + Math.random() * 2.5);
      vy = (Math.random() > 0.5 ? 1 : -1) * (1.5 + Math.random() * 2);
      x = padRandom(banner.clientWidth, size);
      y = padRandom(banner.clientHeight, size);
      setTimeout(function () { target.classList.remove('sc3-target--hit'); }, 120);
    });

    placeTarget();
    requestAnimationFrame(tick);
    window.addEventListener('resize', placeTarget);
  }

  function init() {
    var banner = document.getElementById('sc3Banner');
    var target = document.getElementById('sc3Target');
    var scoreEl = document.getElementById('sc3Score');
    if (!banner || !target || !scoreEl) return;

    var defer = window.requestIdleCallback || function (cb) { setTimeout(cb, 150); };
    defer(function () { startGame(banner, target, scoreEl); });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
