    (function() {
        'use strict';

        /* ——— 1. Page load choreography ——— */
        window.addEventListener('load', function() {
            document.body.classList.add('page-loaded');
        });

        /* ——— 2. Nav scroll state ——— */
        var nav = document.querySelector('.nav');
        var scrollTicking = false;
        window.addEventListener('scroll', function() {
            if (!scrollTicking) {
                requestAnimationFrame(function() {
                    nav.classList.toggle('is-scrolled', window.scrollY > 50);
                    scrollTicking = false;
                });
                scrollTicking = true;
            }
        }, { passive: true });

        /* ——— 3. Mobile menu ——— */
        var toggle = document.querySelector('.nav__toggle');
        var links = document.querySelector('.nav__links');
        toggle.addEventListener('click', function() {
            var open = links.classList.toggle('is-open');
            toggle.classList.toggle('is-active');
            toggle.setAttribute('aria-expanded', open);
        });
        var navAnchors = links.querySelectorAll('a');
        for (var i = 0; i < navAnchors.length; i++) {
            navAnchors[i].addEventListener('click', function() {
                links.classList.remove('is-open');
                toggle.classList.remove('is-active');
                toggle.setAttribute('aria-expanded', 'false');
            });
        }

        /* ——— 4. Intersection Observer — scroll reveals + curtain ——— */
        var revealEls = document.querySelectorAll('[data-reveal], .curtain-wrap');
        if ('IntersectionObserver' in window) {
            var observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('is-visible');
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.12,
                rootMargin: '0px 0px -60px 0px'
            });
            revealEls.forEach(function(el) { observer.observe(el); });
        } else {
            /* Fallback: show everything */
            revealEls.forEach(function(el) { el.classList.add('is-visible'); });
        }

        /* ——— 5. Form submit — ouvre la boîte mail avec le message pré-rempli ——— */
        var form = document.getElementById('contactForm');
        if (form) {
            form.addEventListener('submit', function(e) {
                e.preventDefault();
                var btn = form.querySelector('button[type="submit"]');
                var origHTML = btn.innerHTML;
                var checkSVG = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" style="width:18px;height:18px"><polyline points="20 6 9 17 4 12"/></svg>';

                var name    = (document.getElementById('name').value    || '').trim();
                var phone   = (document.getElementById('phone').value   || '').trim();
                var email   = (document.getElementById('email').value   || '').trim();
                var message = (document.getElementById('message').value || '').trim();

                var body =
                    'Nom : ' + name + '\n' +
                    (phone   ? 'Téléphone : ' + phone + '\n' : '') +
                    (email   ? 'Email : '     + email + '\n' : '') +
                    '\nMessage :\n' + message;

                var mailto =
                    'mailto:bodymedicalrepair@gmail.com' +
                    '?subject=' + encodeURIComponent('Nouvelle demande — ' + (name || 'BM_Repair')) +
                    '&body='    + encodeURIComponent(body);

                window.location.href = mailto;

                btn.innerHTML = '<span style="display:inline-flex;align-items:center;gap:0.5rem">' + checkSVG + 'Boîte mail ouverte !</span>';
                btn.style.background = 'var(--green-deep)';
                setTimeout(function() {
                    btn.innerHTML = origHTML;
                    btn.style.background = '';
                }, 3000);
            });
        }
    })();