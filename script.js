 (function() {
    // smooth scroll for internal links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href === "#") return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      });
    });

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