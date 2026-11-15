(function () {
  var rm = matchMedia('(prefers-reduced-motion:reduce)').matches;
  var nav = document.getElementById('nav');

  function sc() {
    nav.classList.toggle('on', scrollY > 20);
  }
  sc();
  addEventListener('scroll', sc, { passive: true });

  var bg = document.getElementById('bg'),
    g = bg.getContext('2d'),
    P = [],
    W, H, i;

  function rs() {
    W = bg.width = innerWidth;
    H = bg.height = innerHeight;
  }
  rs();
  addEventListener('resize', rs);

  for (i = 0; i < 70; i++) {
    P.push({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - .5) * .3,
      vy: (Math.random() - .5) * .3
    });
  }

  function loop() {
    g.clearRect(0, 0, W, H);
    for (var a = 0; a < P.length; a++) {
      var p = P[a];
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;

      g.fillStyle = 'rgba(140,155,255,.55)';
      g.beginPath();
      g.arc(p.x, p.y, 1.4, 0, 6.283);
      g.fill();

      for (var b = a + 1; b < P.length; b++) {
        var q = P[b],
          d = Math.hypot(p.x - q.x, p.y - q.y);
        if (d < 120) {
          g.strokeStyle = 'rgba(140,155,255,' + (.16 * (1 - d / 120)) + ')';
          g.beginPath();
          g.moveTo(p.x, p.y);
          g.lineTo(q.x, q.y);
          g.stroke();
        }
      }
    }
    if (!rm) requestAnimationFrame(loop);
  }
  loop();

  var words = ['Tilawatil Quran', 'Qiraatil Kutub', 'Qiraah'],
    wi = 0,
    ci = 0,
    del = false,
    el = document.getElementById('typed');

  function tick() {
    var w = words[wi],
      t = del ? 40 : 90;
    ci += del ? -1 : 1;
    el.textContent = w.slice(0, ci);

    if (!del && ci === w.length) {
      del = true;
      t = 1500;
    } else if (del && ci === 0) {
      del = false;
      wi = (wi + 1) % words.length;
      t = 300;
    }
    setTimeout(tick, t);
  }
  if (!rm) {
    el.textContent = '';
    tick();
  }

  var card = document.getElementById('idcard');
  if (!rm) {
    addEventListener('pointermove', function (e) {
      var x = e.clientX / innerWidth - .5,
        y = e.clientY / innerHeight - .5;
      card.style.transform = 'rotateY(' + (x * 24) + 'deg) rotateX(' + (-y * 18) + 'deg)';
    });
  }

  var tabs = document.querySelectorAll('.tab');
  tabs.forEach(function (b) {
    b.addEventListener('click', function () {
      tabs.forEach(function (x) {
        x.setAttribute('aria-selected', x === b);
      });
      document.querySelectorAll('.panel').forEach(function (p) {
        p.hidden = p.id !== b.dataset.t;
      });
    });
  });

  if (!rm && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting) {
          e.target.classList.add('in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: .12 });
    document.querySelectorAll('.rev').forEach(function (r) {
      io.observe(r);
    });
  } else {
    document.querySelectorAll('.rev').forEach(function (r) {
      r.classList.add('in');
    });
  }

  document.getElementById('f').addEventListener('submit', function (ev) {
    ev.preventDefault();
    var n = document.getElementById('n').value,
      e = document.getElementById('e').value,
      m = document.getElementById('m').value;
    location.href = 'mailto:email@contoh.com?subject=' + encodeURIComponent('Pesan dari ' + n) + '&body=' + encodeURIComponent(m + '\n\n' + n + ' (' + e + ')');
  });
})();
