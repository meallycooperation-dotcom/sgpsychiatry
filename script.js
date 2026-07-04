 (function() {
    const navLinks = Array.from(document.querySelectorAll('.nav-links a[href^="#"]'));
    const sections = Array.from(document.querySelectorAll('section[id], .hero[id]'));

    const setActiveLink = (id) => {
      navLinks.forEach(link => {
        const targetId = link.getAttribute('href') === '#' ? 'home' : link.getAttribute('href').slice(1);
        link.classList.toggle('active', targetId === id);
      });
    };

    // smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    // highlight current section in the navbar
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visibleEntry = entries
          .filter(entry => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleEntry) {
          setActiveLink(visibleEntry.target.id);
        } else if (window.scrollY < 120) {
          setActiveLink('home');
        }
      }, { threshold: [0.2, 0.5] });

      sections.forEach(section => observer.observe(section));
    }

    setActiveLink(window.scrollY < 120 ? 'home' : (sections[0]?.id || 'home'));

    // portal button alert demo
    const portalBtn = document.querySelector('.btn-portal');
    if (portalBtn) {
      portalBtn.addEventListener('click', function(e) {
        e.preventDefault();
        alert('🔐 Patient Portal login – (demo) integrated with OpenEMR. Secure access.');
      });
    }

    // hero portal btn
    document.querySelector('.hero-buttons .btn-primary')?.addEventListener('click', function(e) {
      e.preventDefault();
      document.querySelector('#portal').scrollIntoView({ behavior: 'smooth' });
    });

    console.log('SGPsychiatry · website ready');
  })();