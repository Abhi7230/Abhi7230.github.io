/* Abhi Raj — site behaviour.
   Three things: a cursor-following preview on the work index,
   a click-to-play YouTube facade, and transform-only scroll reveals. */

(function () {
  'use strict';

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var finePointer = window.matchMedia('(hover:hover) and (pointer:fine)').matches;

  /* ----------------------------------------------------------
     1. Work index — preview plate that trails the cursor
     ---------------------------------------------------------- */
  (function preview() {
    var el = document.getElementById('preview');
    var img = document.getElementById('previewImg');
    var plate = document.getElementById('previewPlate');
    if (!el || !finePointer || reduced || window.innerWidth < 900) return;

    var rows = document.querySelectorAll('.index__inner[data-preview]');
    if (!rows.length) return;

    var tx = window.innerWidth / 2, ty = window.innerHeight / 2;
    var cx = tx, cy = ty;
    var scale = 0.9, targetScale = 0.9;
    var active = false, raf = null;

    function tick() {
      cx += (tx - cx) * 0.13;
      cy += (ty - cy) * 0.13;
      scale += (targetScale - scale) * 0.14;
      el.style.transform = 'translate3d(' + cx.toFixed(1) + 'px,' + cy.toFixed(1) + 'px,0)' +
        ' translate(-50%,-50%) scale(' + scale.toFixed(3) + ')';

      // Park the loop once it has settled and nothing is hovered.
      if (!active && Math.abs(tx - cx) < 0.4 && Math.abs(ty - cy) < 0.4 && Math.abs(targetScale - scale) < 0.004) {
        raf = null;
        return;
      }
      raf = requestAnimationFrame(tick);
    }

    function start() { if (raf === null) raf = requestAnimationFrame(tick); }
    function onMove(e) { tx = e.clientX; ty = e.clientY; }

    rows.forEach(function (row) {
      row.addEventListener('pointerenter', function (e) {
        if (e.pointerType !== 'mouse') return;
        var kind = row.getAttribute('data-preview');

        el.classList.remove('is-image', 'is-plate');
        if (kind === 'image') {
          img.src = row.getAttribute('data-src') || '';
          el.classList.add('is-image');
          el.removeAttribute('data-tint');
        } else {
          plate.textContent = row.getAttribute('data-plate') || '';
          el.setAttribute('data-tint', row.getAttribute('data-tint') || 'deep');
          el.classList.add('is-plate');
        }

        tx = e.clientX; ty = e.clientY;
        if (!active) { cx = tx; cy = ty; scale = 0.9; }
        active = true;
        targetScale = 1;
        el.classList.add('is-on');
        start();
      });

      row.addEventListener('pointerleave', function () {
        active = false;
        targetScale = 0.9;
        el.classList.remove('is-on');
        start();
      });
    });

    window.addEventListener('pointermove', onMove, { passive: true });
  })();

  /* ----------------------------------------------------------
     2. Click-to-play YouTube facade (no third-party JS until asked)
     ---------------------------------------------------------- */
  (function litePlayer() {
    var box = document.getElementById('lite-yt');
    if (!box) return;

    var started = false;
    function play() {
      if (started) return;
      started = true;
      var id = box.getAttribute('data-id');
      var frame = document.createElement('iframe');
      frame.src = 'https://www.youtube-nocookie.com/embed/' + id +
        '?autoplay=1&rel=0&modestbranding=1&playsinline=1';
      frame.title = 'Ketchup, a horror-comedy short film by Abhi Raj';
      frame.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      frame.setAttribute('allowfullscreen', '');
      frame.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      box.textContent = '';
      box.appendChild(frame);
      box.style.cursor = 'default';
      box.removeAttribute('role');
      box.removeAttribute('tabindex');
    }

    box.addEventListener('click', play);
    box.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        play();
      }
    });
    // Warm the connection on intent so playback starts faster.
    box.addEventListener('pointerenter', function () {
      if (document.getElementById('yt-pre')) return;
      var l = document.createElement('link');
      l.id = 'yt-pre';
      l.rel = 'preconnect';
      l.href = 'https://www.youtube-nocookie.com';
      document.head.appendChild(l);
    }, { once: true });
  })();

  /* ----------------------------------------------------------
     3. Scroll reveals — transform only, applied by JS so the
        page is fully readable when JS is off or fails.
     ---------------------------------------------------------- */
  (function reveals() {
    if (reduced || !('IntersectionObserver' in window)) return;

    var targets = document.querySelectorAll(
      '.label, .index__row, .feature__player, .feature__note, .ai__head, .ai__lede, ' +
      '.rows__row, .eng__head, .eng__rail, .eng__body, .now__head, .card, ' +
      '.contact__head, .contact__sub, .mailto, .elsewhere'
    );
    if (!targets.length) return;

    var fold = window.innerHeight * 0.92;
    var watched = [];

    targets.forEach(function (node) {
      if (node.getBoundingClientRect().top < fold) return; // already on screen, leave it alone
      node.classList.add('reveal');
      watched.push(node);
    });
    if (!watched.length) return;

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    watched.forEach(function (node) { io.observe(node); });
  })();

})();
