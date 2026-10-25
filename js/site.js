/* ==========================================================================
   Sitesmith – pris, exempel, provbänken, vanliga frågor och kontaktformuläret
   ========================================================================== */
(function () {
  'use strict';

  const S = window.SITESMITH;
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));
  const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const kronor = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} kr`;

  /* ---------- Pris och tillval ---------- */

  $$('[data-pris]').forEach((el) => { el.textContent = kronor(S.pris); });
  $$('[data-pris-text]').forEach((el) => { el.textContent = S.prisText; });
  $$('[data-halva]').forEach((el) => { el.textContent = kronor(Math.round(S.pris / 2)); });
  if (S.antalForslag) $$('[data-antal-forslag]').forEach((el) => { el.textContent = S.antalForslag; });
  const tillval = $('[data-tillval]');
  if (tillval && S.tillval) {
    tillval.innerHTML = S.tillval.map((t) => `
      <li><strong>${esc(t.namn)}</strong><span class="tillval-pris">${esc(t.pris)}</span><p>${esc(t.text)}</p></li>`).join('');
  }
  $$('[data-epost]').forEach((a) => { a.href = `mailto:${S.kontakt.epost}`; a.textContent = S.kontakt.epost; });

  /* ---------- Ikonpaketet ---------- */

  const ikonpaket = (S.tillval || []).find((t) => t.id === 'ikoner');
  if (ikonpaket) $$('[data-ikonpris]').forEach((el) => { el.textContent = ikonpaket.pris; });

  // "Beställ ett ikonpaket" skriver in det i formuläret och ger mejlet rätt ämne
  let amnesord = 'Gratis förslag';
  const IKONRAD = 'Jag är intresserad av ett ikonpaket.';
  document.addEventListener('click', (e) => {
    const lank = e.target.closest('a[href$="#kontakt"]');
    if (!lank) return;
    if (!lank.hasAttribute('data-bestall-ikoner')) { amnesord = 'Gratis förslag'; return; }
    amnesord = 'Ikonpaket';
    const falt = $('#meddelande');
    if (falt && !falt.value.includes(IKONRAD)) falt.value = falt.value.trim() ? `${falt.value.trim()}\n\n${IKONRAD}` : IKONRAD;
  });

  /* ---------- Exempel ---------- */

  const mobilBild = (e) => e.bild.replace(/\.webp$/, '-mobil.webp');

  const exempel = $('[data-exempel]');
  if (exempel && S.exempel) {
    const synliga = S.exempel.filter((e) => e.visa);
    if (!synliga.length) {
      // Inga exempel att visa: göm sektionen och länkarna dit
      exempel.closest('section').hidden = true;
      $$('a[href$="#exempel"]').forEach((a) => { (a.closest('li') || a).hidden = true; });
    }
    exempel.innerHTML = synliga.map((e) => `
      <figure class="fonster">
        <div class="fonster-enheter">
          <div class="fonster-ram"><img src="${esc(e.bild)}" alt="Förslag på hemsida för ${esc(e.namn)}, i datorn" width="1200" height="750" loading="lazy"></div>
          ${e.mapp ? `<div class="fonster-mobil"><img src="${esc(mobilBild(e))}" alt="Samma förslag i mobilen" width="390" height="844" loading="lazy"></div>` : ''}
          <span class="lapp" aria-hidden="true">Förslag</span>
        </div>
        <figcaption>
          <h3>${esc(e.namn)}</h3>
          <p class="plats">${esc(e.plats)}</p>
          <p>${esc(e.text)}</p>
          ${e.delar && e.delar.length ? `<ul class="delar">${e.delar.map((d) => `<li>${esc(d)}</li>`).join('')}</ul>` : ''}
        </figcaption>
      </figure>`).join('');
  }

  /* ---------- Skyltfönstret i toppen: förslagen ett i taget ---------- */
  // Byter var 4,5 sekund, stannar när muspekaren eller fokus är där, när sidan inte syns och med "minska rörelse".
  // Pausknappen gör att den som vill kan stoppa bildspelet (WCAG 2.2.2).

  const hf = $('[data-hero-fonster]');
  const iFonstret = (S.exempel || []).filter((e) => e.visa && e.mapp);
  if (hf && iFonstret.length) {
    const glas = $('.hf-glas', hf);
    const text = $('[data-hf-text]', hf);
    glas.innerHTML = iFonstret.map((e, i) => `<span class="hf-bild${i ? '' : ' aktiv'}">
      <img class="hf-dator" src="${esc(e.bild)}" alt="" width="1200" height="750"${i ? ' loading="lazy"' : ''}>
      <img class="hf-mobil" src="${esc(mobilBild(e))}" alt="" width="390" height="844"${i ? ' loading="lazy"' : ''}></span>`).join('');
    const smatt = (s) => s.charAt(0).toLowerCase() + s.slice(1);
    const skriv = (i) => { text.textContent = `I fönstret: förslaget till ${iFonstret[i].namn}, ${smatt(iFonstret[i].plats)}.`; };
    skriv(0);
    hf.hidden = false;

    if (iFonstret.length > 1) {
      const bilder = $$('.hf-bild', hf);
      const knapp = document.createElement('button');
      knapp.type = 'button';
      knapp.className = 'hf-paus';
      $('figcaption', hf).appendChild(knapp);
      let nu = 0;
      let pausad = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      let vilar = false;
      let syns = true;
      let timer = null;
      const ritaKnapp = () => {
        knapp.setAttribute('aria-label', pausad ? 'Spela bildspelet' : 'Pausa bildspelet');
        knapp.dataset.lage = pausad ? 'spela' : 'paus';
      };
      const byt = () => {
        bilder[nu].classList.remove('aktiv');
        nu = (nu + 1) % bilder.length;
        bilder[nu].classList.add('aktiv');
        skriv(nu);
      };
      const styr = () => {
        clearInterval(timer);
        timer = !pausad && !vilar && syns && !document.hidden ? setInterval(byt, 4500) : null;
      };
      knapp.addEventListener('click', () => { pausad = !pausad; ritaKnapp(); styr(); });
      hf.addEventListener('pointerenter', () => { vilar = true; styr(); });
      hf.addEventListener('pointerleave', () => { vilar = false; styr(); });
      hf.addEventListener('focusin', () => { vilar = true; styr(); });
      hf.addEventListener('focusout', () => { vilar = false; styr(); });
      document.addEventListener('visibilitychange', styr);
      if ('IntersectionObserver' in window) new IntersectionObserver(([e]) => { syns = e.isIntersecting; styr(); }).observe(hf);
      ritaKnapp();
      styr();
    }
  }

  /* ---------- Snabbknappen i mobilen: syns först när toppens knappar är borta, och inte vid formuläret ---------- */

  const snabb = $('.snabbknapp');
  const toppknappar = $('.hero-knappar');
  const kontakten = $('#kontakt');
  if (snabb && toppknappar && kontakten && 'IntersectionObserver' in window) {
    let toppSyns = true;
    let kontaktSyns = false;
    const uppdatera = () => snabb.classList.toggle('synlig', !toppSyns && !kontaktSyns);
    new IntersectionObserver(([e]) => { toppSyns = e.isIntersecting; uppdatera(); }).observe(toppknappar);
    new IntersectionObserver(([e]) => { kontaktSyns = e.isIntersecting; uppdatera(); }, { threshold: 0.1 }).observe(kontakten);
  } else if (snabb) {
    snabb.classList.add('synlig');
  }

  /* ---------- Vanliga frågor som Google kan visa (FAQPage) ---------- */

  const fragorna = $$('.fragesvar details').map((d) => ({
    fraga: $('summary', d).textContent.trim(),
    svar: $$('p', d).map((p) => p.textContent.trim()).join(' ')
  })).filter((f) => f.fraga && f.svar);
  if (fragorna.length) {
    const ld = document.createElement('script');
    ld.type = 'application/ld+json';
    ld.textContent = JSON.stringify({ '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: fragorna.map((f) => ({ '@type': 'Question', name: f.fraga, acceptedAnswer: { '@type': 'Answer', text: f.svar } })) });
    document.head.appendChild(ld);
  }

  /* ---------- Provbänken ---------- */

  const fragor = $('[data-fragor]');
  const resultat = $('[data-resultat]');
  const svar = new Map();
  let senasteSammanfattning = '';

  function visaResultat() {
    const antal = S.provbank.length;
    const ja = [...svar.values()].filter((v) => v === 'ja').length;
    const besvarade = svar.size;
    const nej = S.provbank.filter((_, i) => svar.get(i) === 'nej');

    let rubrik;
    let text;
    if (besvarade === 0) {
      rubrik = 'Svara på frågorna';
      text = 'Resultatet och tipsen dyker upp här medan du svarar.';
    } else if (besvarade < antal) {
      rubrik = `${antal - besvarade} frågor kvar`;
      text = 'Fortsätt svara, så får du hela bilden.';
    } else if (ja === antal) {
      rubrik = 'Er hemsida gör sitt jobb';
      text = 'Snyggt! Vill ni ändå ha en ny blick på den är ni välkomna att höra av er.';
    } else if (ja >= 5) {
      rubrik = 'Bra grund – men ni tappar kunder';
      text = 'Det här är det som skulle göra störst skillnad:';
    } else {
      rubrik = 'Här finns mycket att vinna';
      text = 'Just nu missar er hemsida flera saker som kunderna letar efter:';
    }

    resultat.innerHTML = `
      <p class="poang">${ja} av ${antal}</p>
      <h3>${rubrik}</h3>
      <p>${text}</p>
      ${nej.length && besvarade === antal ? `<ul>${nej.map((f) => `<li>${esc(f.rad)}</li>`).join('')}</ul>` : ''}
      ${besvarade === antal ? '<a class="knapp" href="#kontakt" data-fran-test>Få ett gratis förslag</a>' : ''}`;

    senasteSammanfattning = besvarade === antal
      ? `Jag gjorde testet "Hur mår er hemsida?" och fick ${ja} av ${antal}.${nej.length ? `\nDet här saknas:\n${nej.map((f) => `- ${f.rad}`).join('\n')}` : ''}`
      : '';
  }

  if (fragor && resultat && S.provbank) {
    fragor.innerHTML = S.provbank.map((f, i) => `
      <li data-fraga="${i}">
        <span id="fraga-${i}">${esc(f.fraga)}</span>
        <span class="svar" role="group" aria-labelledby="fraga-${i}">
          <button type="button" data-svar="ja" aria-pressed="false">Ja</button>
          <button type="button" data-svar="nej" aria-pressed="false">Nej</button>
        </span>
      </li>`).join('');

    fragor.addEventListener('click', (e) => {
      const knapp = e.target.closest('[data-svar]');
      if (!knapp) return;
      const rad = knapp.closest('[data-fraga]');
      const i = Number(rad.dataset.fraga);
      svar.set(i, knapp.dataset.svar);
      $$('[data-svar]', rad).forEach((b) => b.setAttribute('aria-pressed', String(b === knapp)));
      rad.classList.add('besvarad');
      visaResultat();
    });

    // Knappen efter testet fyller i resultatet i kontaktformuläret
    resultat.addEventListener('click', (e) => {
      if (!e.target.closest('[data-fran-test]')) return;
      const falt = $('#meddelande');
      if (falt && !falt.value.trim() && senasteSammanfattning) falt.value = senasteSammanfattning;
    });
    visaResultat();
  }

  /* ---------- Kontaktformuläret ---------- */

  const form = $('[data-kontaktform]');
  if (form) {
    const f = form.elements;
    const giltig = (s) => /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(s) || s.replace(/\D/g, '').length >= 7;

    const visaFel = (namn, text) => {
      const el = $(`[data-fel="${namn}"]`, form);
      el.textContent = text;
      el.hidden = !text;
      if (text) f[namn].setAttribute('aria-invalid', 'true');
      else f[namn].removeAttribute('aria-invalid');
      return !text;
    };

    const mejltext = () => {
      const ikoner = amnesord === 'Ikonpaket';
      const meddelande = (ikoner ? f.meddelande.value.replace(IKONRAD, '') : f.meddelande.value).trim();
      return [
        'Hej!',
        '',
        ikoner
          ? `Jag är intresserad av ett ikonpaket för ${f.foretag.value.trim()}.`
          : `Jag skulle vilja ha ett gratis förslag på en hemsida för ${f.foretag.value.trim()}.`,
        '',
        `Namn: ${f.namn.value.trim()}`,
        `Kontakt: ${f.kontaktsatt.value.trim()}`,
        ...(f.nuvarande.value.trim() ? [`Nuvarande hemsida: ${f.nuvarande.value.trim()}`] : []),
        ...(meddelande ? ['', ...meddelande.split(/\r?\n/)] : []),
        '',
        '(Skickat från sitesmith.se)'
      ].join('\r\n');
    };

    const validera = () => {
      const kontakt = f.kontaktsatt.value.trim();
      const ok = [
        visaFel('foretag', f.foretag.value.trim() ? '' : 'Skriv vilket företag det gäller.'),
        visaFel('namn', f.namn.value.trim() ? '' : 'Skriv ditt namn.'),
        visaFel('kontaktsatt', !kontakt ? 'Skriv en e-postadress eller ett telefonnummer.' : giltig(kontakt) ? '' : 'Det ser inte ut som en e-postadress eller ett telefonnummer.')
      ];
      const forsta = ['foretag', 'namn', 'kontaktsatt'][ok.indexOf(false)];
      if (forsta) f[forsta].focus();
      return !forsta;
    };

    ['foretag', 'namn', 'kontaktsatt'].forEach((n) => f[n].addEventListener('input', () => {
      if (f[n].getAttribute('aria-invalid')) visaFel(n, '');
    }));

    // På riktiga hemsidan (http/https) skickas förfrågan med Netlify Forms. Från disken öppnas mejlprogrammet.
    const paWebben = /^https?:$/.test(location.protocol);
    const info = $('[data-formular-info]', form);
    if (!paWebben && info) info.textContent = 'Ditt mejlprogram öppnas med allt ifyllt. Du trycker bara på skicka.';
    const skickfel = $('[data-skickfel]', form);
    const knapp = $('button[type="submit"]', form);

    const oppnaMejl = (amne) => {
      const klart = $('[data-klart]', form);
      const lank = $('[data-mejl-igen]', klart);
      lank.href = `mailto:${S.kontakt.epost}?subject=${encodeURIComponent(amne)}&body=${encodeURIComponent(mejltext())}`;
      klart.hidden = false;
      klart.focus({ preventScroll: true });
      lank.click();
    };

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!validera()) return;
      const amne = `${amnesord}: ${f.foretag.value.trim()}`;
      skickfel.hidden = true;
      if (!paWebben) { oppnaMejl(amne); return; }

      $('[data-amne]', form).value = amne;
      $('[data-sammanfattning]', form).value = mejltext();
      const data = new URLSearchParams(new FormData(form));
      knapp.disabled = true;
      knapp.textContent = 'Skickar …';
      try {
        const svar = await fetch('/', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: data.toString() });
        if (!svar.ok) throw new Error(`HTTP ${svar.status}`);
        $$('.falt-rutnat, .formular-fot', form).forEach((el) => { el.hidden = true; });
        const tack = $('[data-tack]', form);
        tack.hidden = false;
        tack.focus({ preventScroll: true });
      } catch (fel) {
        skickfel.innerHTML = `Förfrågan gick inte iväg. Försök igen om en stund, eller <a href="mailto:${esc(S.kontakt.epost)}?subject=${encodeURIComponent(amne)}&amp;body=${encodeURIComponent(mejltext())}">skicka den som mejl</a>.`;
        skickfel.hidden = false;
      } finally {
        knapp.disabled = false;
        knapp.textContent = 'Skicka förfrågan';
      }
    });

    $('[data-kopiera]', form).addEventListener('click', async (e) => {
      const knapp = e.currentTarget;
      let ok = false;
      try { await navigator.clipboard.writeText(mejltext()); ok = true; } catch (err) {
        const ruta = document.createElement('textarea');
        ruta.value = mejltext();
        ruta.style.cssText = 'position:fixed;opacity:0';
        document.body.appendChild(ruta);
        ruta.select();
        try { ok = document.execCommand('copy'); } catch (e2) { ok = false; }
        ruta.remove();
      }
      $('span', knapp).textContent = ok ? 'Kopierat!' : 'Kunde inte kopiera';
      setTimeout(() => { $('span', knapp).textContent = 'Kopiera texten'; }, 2500);
    });
  }
})();
