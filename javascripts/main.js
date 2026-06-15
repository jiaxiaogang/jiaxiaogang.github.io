document.addEventListener('DOMContentLoaded', function () {
  document.body.classList.add('js-ready');

  var motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  var revealTargets = document.querySelectorAll('.content_card, .footer_card');
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.hero_nav a[href^="#"]'));
  var sections = navLinks
    .map(function (link) {
      var target = document.querySelector(link.getAttribute('href'));
      return target ? { link: link, target: target } : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && !motionQuery.matches) {
    var revealObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.01, rootMargin: '0px 0px -8% 0px' });

    revealTargets.forEach(function (target) {
      revealObserver.observe(target);
    });
  } else {
    revealTargets.forEach(function (target) {
      target.classList.add('is-visible');
    });
  }

  if (!motionQuery.matches && window.matchMedia('(pointer: fine)').matches) {
    var ticking = false;
    var cursorX = window.innerWidth / 2;
    var cursorY = window.innerHeight * 0.24;
    var lastCursorX = cursorX;
    var lastCursorY = cursorY;

    document.addEventListener('mousemove', function (event) {
      cursorX = event.clientX;
      cursorY = event.clientY;

      if (Math.abs(cursorX - lastCursorX) < 28 && Math.abs(cursorY - lastCursorY) < 28) {
        return;
      }

      if (!ticking) {
        window.requestAnimationFrame(function () {
          document.documentElement.style.setProperty('--cursor-x', cursorX + 'px');
          document.documentElement.style.setProperty('--cursor-y', cursorY + 'px');
          lastCursorX = cursorX;
          lastCursorY = cursorY;
          ticking = false;
        });
        ticking = true;
      }
    }, { passive: true });
  }

  function updateActiveNav() {
    var active = sections[0];
    var offset = window.innerHeight * 0.32;

    sections.forEach(function (section) {
      if (section.target.getBoundingClientRect().top <= offset) {
        active = section;
      }
    });

    sections.forEach(function (section) {
      section.link.classList.toggle('is-active', section === active);
    });
  }

  if (sections.length) {
    updateActiveNav();
    window.addEventListener('scroll', updateActiveNav, { passive: true });
    window.addEventListener('resize', updateActiveNav, { passive: true });
  }
});
