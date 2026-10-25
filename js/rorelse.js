/* ==========================================================================
   Sitesmith – rörelserna. Sidan berättar hur en hemsida blir till:
   1. Toppen: skylten gungar (CSS) och rubriken reser sig rad för rad.
   2. Så går det till: kapitlen läses ett i taget, kedjan fylls och verkstaden
      bygger hemsidan – recensionerna, stilen, förslaget, mötet och Google.
   3. Exempel: skyltfönstren tänds och antalet förslag räknas upp.
   4. Priset: prisskylten gungar till när den hängs upp, som skylten i toppen.
   5. Om: citatet tänds ord för ord medan man läser.
   Kapitelbytet sköts av IntersectionObserver och fungerar även med "minska
   rörelse" (då byts bilderna utan rörelse). Utan JavaScript står allt still
   och syns: kapitlen som en lista och verkstaden med förslaget.
   SplitText och Lenis enligt dokumentationen i Context7 (autoSplit, animationen
   returneras från onSplit; Lenis synkas med ScrollTrigger).
   ========================================================================== */
(function () {
  'use strict';
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const lugn = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const gsap = !lugn && window.gsap;
  const ST = gsap && window.ScrollTrigger;
  const Split = gsap && window.SplitText;
  if (gsap) gsap.registerPlugin(...[ST, Split].filter(Boolean));
  const ut = 'expo.out';

  /* ---------- 2. Berättelsen (byter bild även utan GSAP) ---------- */

  const berattelse = $('[data-berattelse]');
  const scen = $('[data-scen]');
  const kapitel = $$('.kapitel li');
  const byggen = [];

  if (gsap && scen) {
    const lager = (i) => $(`[data-lager="${i}"]`, scen);
    const tl = () => gsap.timeline({ paused: true });
    // 0: recensionerna glider in och orden gästerna använder plockas ut
    byggen[0] = tl()
      .from($$('.omdome', lager(0)), { x: -30, autoAlpha: 0, duration: 0.6, ease: ut, stagger: 0.12 })
      .from($$('.ordmoln em', lager(0)), { scale: 0.6, autoAlpha: 0, duration: 0.5, ease: 'back.out(2.2)', stagger: 0.09 }, 0.35);
    // 1: färgerna läggs fram, typsnittet skrivs och en liten skylt hängs upp och gungar
    byggen[1] = tl()
      .from($$('.farger i', lager(1)), { y: -36, autoAlpha: 0, duration: 0.55, ease: 'back.out(1.8)', stagger: 0.08 })
      .from($('.typprov', lager(1)), { y: 18, autoAlpha: 0, duration: 0.7, ease: ut }, 0.25)
      .from($('.miniskylt span', lager(1)), { rotation: -14, transformOrigin: '50% -20%', autoAlpha: 0, duration: 1.6, ease: 'elastic.out(1, 0.35)' }, 0.4);
    // 2: förslaget byggs – menyraden, rubriken, bilden, "Öppet nu" och menyn
    byggen[2] = tl()
      .from($('.bygge-nav', lager(2)), { scaleX: 0, transformOrigin: 'left', duration: 0.6, ease: ut })
      .from($$('.bygge-text .rad-stor', lager(2)), { scaleX: 0, transformOrigin: 'left', duration: 0.6, ease: ut, stagger: 0.1 }, 0.2)
      .from($('.bygge-bild', lager(2)), { clipPath: 'inset(0% 0% 100% 0%)', duration: 0.8, ease: ut }, 0.3)
      .from($('.oppet-nu', lager(2)), { scale: 0.5, autoAlpha: 0, duration: 0.5, ease: 'back.out(3)' }, 0.75)
      .from($$('.bygge-meny span', lager(2)), { scaleX: 0, transformOrigin: 'left', duration: 0.5, ease: ut, stagger: 0.06 }, 0.6);
    // 3: mötet – datorn och mobilen ställs fram, en fråga och en bock
    byggen[3] = tl()
      .from($('.mote-dator', lager(3)), { y: 24, autoAlpha: 0, duration: 0.7, ease: ut })
      .from($('.mote-mobil', lager(3)), { y: 40, autoAlpha: 0, duration: 0.7, ease: ut }, 0.15)
      .from($('.pratbubbla', lager(3)), { scale: 0.6, transformOrigin: '0% 100%', autoAlpha: 0, duration: 0.45, ease: 'back.out(2.4)' }, 0.55)
      .from($('.bock', lager(3)), { scale: 0.5, autoAlpha: 0, duration: 0.45, ease: 'back.out(3)' }, 1.15);
    // 4: någon söker, träffen dyker upp och stämpeln slås i
    const sokord = $('.sok span', lager(4));
    byggen[4] = tl().from($('.sok', lager(4)), { y: -10, autoAlpha: 0, duration: 0.5, ease: ut });
    if (Split && sokord) {
      const delar = Split.create(sokord, { type: 'chars' });
      byggen[4].from(delar.chars, { autoAlpha: 0, duration: 0.01, stagger: 0.05 }, 0.2);
    }
    byggen[4]
      .from($('.traff', lager(4)), { y: 30, autoAlpha: 0, duration: 0.7, ease: ut }, '+=0.15')
      .from($('.stampel', lager(4)), { scale: 1.7, rotation: -24, autoAlpha: 0, duration: 0.4, ease: 'back.out(2)' }, '+=0.25');
  }

  if (berattelse && scen && kapitel.length && 'IntersectionObserver' in window) {
    berattelse.classList.add('levande');
    const lista = $('.kapitel', berattelse);
    let aktiv = -1;
    const aktivera = (i) => {
      if (i === aktiv) return;
      aktiv = i;
      scen.dataset.aktiv = String(i);
      kapitel.forEach((li, n) => li.classList.toggle('aktiv', n === i));
      // Utan ScrollTrigger fylls kedjan kapitel för kapitel, annars jämnt med scrollen (längre ner)
      if (!ST) lista.style.setProperty('--framsteg', kapitel.length > 1 ? i / (kapitel.length - 1) : 1);
      if (byggen[i]) byggen[i].progress(0).play();
    };
    const iakttagare = new IntersectionObserver((poster) => {
      poster.forEach((p) => { if (p.isIntersecting) aktivera(Number(p.target.dataset.kapitel)); });
    }, { rootMargin: '-45% 0px -45% 0px' });
    kapitel.forEach((li) => iakttagare.observe(li));
    // Första bilden: visa kapitel 1 och bygg den när verkstaden kommer in i bild
    scen.dataset.aktiv = '0';
    kapitel[0].classList.add('aktiv');
    const forsta = new IntersectionObserver((poster) => {
      if (poster.some((p) => p.isIntersecting)) { if (aktiv === -1) aktivera(0); forsta.disconnect(); }
    }, { threshold: 0.35 });
    forsta.observe(scen);
  }

  if (!gsap) return;
  document.documentElement.classList.add('rorelse');

  /* ---------- Mjuk scroll ---------- */
  if (window.Lenis) {
    const lenis = new window.Lenis({ lerp: 0.1, smoothWheel: true });
    if (ST) lenis.on('scroll', ST.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a[href^="#"]');
      if (!a || a.getAttribute('href').length < 2) return;
      const mal = document.getElementById(a.getAttribute('href').slice(1));
      if (!mal) return;
      e.preventDefault();
      lenis.scrollTo(mal, { offset: -16, duration: 1.2 });
      history.replaceState(null, '', a.getAttribute('href'));
    });
  }

  /* ---------- 1. Toppen ---------- */
  const rubrik = $('.hero h1');
  if (rubrik && Split) {
    Split.create(rubrik, {
      type: 'lines', mask: 'lines', autoSplit: true,
      onSplit: (s) => gsap.from(s.lines, { yPercent: 105, duration: 1.1, ease: ut, stagger: 0.1, delay: 0.15 }),
    });
  }
  gsap.from('.hero .lead, .hero-knappar, .hero-fakta li', { y: 14, autoAlpha: 0, duration: 0.9, ease: ut, stagger: 0.07, delay: 0.55 });
  gsap.from('.hero-fonster:not([hidden])', { y: 24, autoAlpha: 0, duration: 1.1, ease: ut, delay: 0.9 });

  if (!ST) return;
  const naraVy = (el, start = 'top 80%') => ({ trigger: el, start, once: true });

  /* ---------- Kedjan i berättelsen fylls jämnt med scrollen ---------- */
  const lista = $('.kapitel');
  if (lista && berattelse && berattelse.classList.contains('levande')) {
    ST.create({
      trigger: lista, start: 'top 50%', end: 'bottom 50%',
      onUpdate: (self) => lista.style.setProperty('--framsteg', self.progress.toFixed(3)),
    });
  }

  /* ---------- 3. Exempel: skyltfönstren tänds ---------- */
  $$('.fonster-ram img').forEach((img) => {
    gsap.fromTo(img, { clipPath: 'inset(0% 0% 100% 0%)', scale: 1.06 },
      { clipPath: 'inset(0% 0% 0% 0%)', scale: 1, duration: 1.2, ease: 'power3.out', scrollTrigger: naraVy(img.closest('.fonster'), 'top 82%') });
  });
  $$('.fonster-mobil').forEach((m) => {
    gsap.from(m, { y: 28, autoAlpha: 0, duration: 0.9, ease: 'power3.out', delay: 0.45, scrollTrigger: naraVy(m.closest('.fonster'), 'top 82%') });
  });
  const antal = $('[data-antal-forslag]');
  if (antal) {
    const slut = parseInt(antal.textContent, 10);
    if (slut > 1) {
      ST.create(Object.assign(naraVy(antal, 'top 88%'), {
        onEnter: () => {
          const o = { v: 1 };
          gsap.to(o, { v: slut, duration: 1, ease: 'power2.out', onUpdate: () => { antal.textContent = Math.round(o.v); } });
        },
      }));
    }
  }

  /* ---------- 4. Priset: skylten gungar till ---------- */
  const prisskylt = $('.prisskylt');
  if (prisskylt) {
    gsap.from(prisskylt, { rotation: -5, transformOrigin: '50% 0%', duration: 1.8, ease: 'elastic.out(1, 0.3)', scrollTrigger: naraVy(prisskylt, 'top 78%') });
  }

  /* ---------- 5. Om: citatet tänds ord för ord ---------- */
  const citat = $('.om-citat');
  if (citat && Split) {
    Split.create(citat, {
      type: 'words', autoSplit: true,
      onSplit: (s) => gsap.fromTo(s.words, { opacity: 0.18 }, {
        opacity: 1, ease: 'none', stagger: 0.1,
        scrollTrigger: { trigger: citat, start: 'top 82%', end: 'bottom 52%', scrub: true },
      }),
    });
  }

  window.addEventListener('load', () => ST.refresh());
})();
