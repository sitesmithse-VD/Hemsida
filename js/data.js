/* ==========================================================================
   Sitesmith – innehåll och inställningar
   --------------------------------------------------------------------------
   Här ändrar du pris, tillval, exempel och kontaktuppgifter. Sidan läser
   härifrån, så du behöver bara ändra på ett ställe.
   ========================================================================== */
window.SITESMITH = {
  kontakt: {
    epost: 'sitesmith.se@gmail.com',
    ort: 'Göteborg'
  },

  // Priset för en ny hemsida, inklusive moms (från 15 oktober 2026). Hälften vid ja, hälften vid publicering.
  pris: 12000,
  prisText: 'inklusive moms',

  // Hur många förslag som är gjorda, visas under Exempel. Räkna upp när du gör fler.
  antalForslag: 30,

  tillval: [
    { namn: 'Ändringar efteråt', pris: '200 kr per ändring', text: 'Nya öppettider, helgdagar, menyändringar och evenemang när ni hör av er. Det räcker med ett mejl eller en bild. Allt i samma mejl räknas som en ändring, om det tar högst en halvtimme. Större saker får ett eget pris.' },
    { namn: 'Google-profilen', pris: '1 000 kr', text: 'Jag uppdaterar er företagsprofil på Google med hemsidan, menylänken, öppettiderna och nya bilder, så att den som googlar hittar rätt.' },
    // id: 'ikoner' gör att priset också visas i avsnittet Ikonpaket
    { id: 'ikoner', namn: 'Ikonpaket', pris: '1 500 kr', text: '30 egna ikoner i samma stil som hemsidan, till menyn, skyltar, Instagram och hemsidan. Går också att köpa utan hemsida.' },
    { namn: 'Fler språk', pris: '1 500 kr per språk', text: 'Hemsidan på ett språk till, till exempel engelska, med ett språkval uppe i hörnet. Menyn och alla texter översätts, och gästen byter språk med ett klick.' }
  ],

  // Exempel på hemsidor, i den ordning de visas. visa: true = syns på sidan (och i skyltfönstret högst upp).
  // OBS: förslagen innehåller kundernas egna bilder. Fråga varje kund om lov innan
  // sitesmith.se publiceras, och sätt visa: false på dem som inte har sagt ja.
  // mapp = kundens mapp i Sitesmith/Kunder. Kör sedan: python verktyg/bygg_exempelbilder.py
  // (gör dator- och mobilbilden och flyttar bort bilderna till dem som inte visas).
  // Urvalet 22 okt 2026: de sex snyggaste av 30 förslag, ljusa och mörka om vartannat.
  exempel: [
    { namn: 'Gudagott', plats: 'Deli vid Mariaplan', mapp: 'Gudagott', bild: 'img/exempel/gudagott.webp',
      text: 'Loggan som skylt, ett band med bilder från disken och beställning till helgen.', visa: true },
    { namn: 'Gurras', plats: 'Restaurang på Postgatan', mapp: 'Gurras', bild: 'img/exempel/gurras.webp',
      text: 'Sin egen stil, fast renare, med menykort och språkval.', visa: true },
    { namn: 'Le 20ème', plats: 'Fransk vinbar vid Gamlestadstorget', mapp: 'Le 20eme', bild: 'img/exempel/le20eme.webp',
      text: 'Terrassen i solen, vinerna som är upphällda just nu och en fråga om bord.', visa: true },
    { namn: 'Mosaik konstcafé', plats: 'Konstcafé i Kvillebäcken', mapp: 'Mosaik konstcafe', bild: 'img/exempel/mosaik.webp',
      text: 'Blått kakel och stjärnan från skylten, och menyn på svenska och arabiska.', visa: true },
    { namn: 'Duy Tan', plats: 'Vietnamesiskt vid Kvilletorget', mapp: 'Duy Tan', bild: 'img/exempel/duytan.webp',
      text: 'Phở som ångar, storsäljarna först och hämtmat som beställs med ett samtal.', visa: true },
    { namn: 'Bullen & Brödet', plats: 'Bageri i Masthugget', mapp: 'Bullen och Brodet', bild: 'img/exempel/bullen.webp',
      text: 'Bageriets egen skylt högst upp, ett band med bröd och torsdagens köpenhamnare.', visa: true },
    // Gjorda men inte med i urvalet just nu
    { namn: 'Borgskogs', plats: 'Bageri i Linné', mapp: 'Borgskogs', bild: 'img/exempel/borgskogs.webp',
      text: 'Veckans helgkaka står först, med nedräkning till fredag klockan 15. Bageriet byter kakan själv.', visa: false },
    { namn: 'Bar Kastello', plats: 'Kaffebar och scen vid Järntorget', mapp: 'Bar Kastello', bild: 'img/exempel/kastello.webp',
      text: 'Kvällarna som affischer, som gästerna kan lägga i sin kalender.', visa: false },
    { namn: 'Oh my coffee', plats: 'Kafé på Linnégatan', mapp: 'Oh my coffee', bild: 'img/exempel/ohmycoffee.webp',
      text: 'En upplyst kakdisk där kaféet själv bockar för det som är slut för dagen.', visa: false },
    { namn: 'Café Italia', plats: 'Italiensk bar i Eriksberg', mapp: 'Cafe Italia', bild: 'img/exempel/italia.webp',
      text: 'En tavla som visar vad som serveras just nu, och bordsbokning.', visa: false },
    { namn: 'Nöller', plats: 'Espressobar i Haga', mapp: 'Noller', bild: 'img/exempel/noller.webp',
      text: 'Putsen, träborden och den röda dörren, och kaffe sedan 1994.', visa: false },
    { namn: 'Frid & Fröjd', plats: 'Frukostkafé vid Järntorget', mapp: 'Frid och Frojd', bild: 'img/exempel/fridfrojd.webp',
      text: 'En sol som står där dagen är, efter öppettiderna.', visa: false },
    { namn: 'Gelaterian', plats: 'Glassbar vid Grönsakstorget', mapp: 'Gelaterian', bild: 'img/exempel/gelaterian.webp',
      text: 'Dagens smaker och provningskvällar.', visa: false },
    { namn: 'Mimolett', plats: 'Lunchrestaurang på Lindholmen', mapp: 'Mimolett', bild: 'img/exempel/mimolett.webp',
      text: 'Ett lunchhäfte med polaroider och dagens rätter.', visa: false },
    { namn: 'Boulangerie Ducoin', plats: 'Franskt bageri i Majorna', mapp: 'Boulangerie Ducoin', bild: 'img/exempel/ducoin.webp',
      text: 'En brödpåse som stämplas och en tecknad Parisgata.', visa: false },
    { namn: 'Hisingens Sweets House', plats: 'Konditori på Hisingen', mapp: 'Hisingens Sweets House', bild: 'img/exempel/sweets.webp',
      text: 'En tårtskiss som ritas fram medan kunden beställer.', visa: false },
    { namn: 'Café Slätta Damm', plats: 'Våffelkafé vid dammen', mapp: 'Cafe Slatta Damm', bild: 'img/exempel/slattadamm.webp',
      text: 'Skogen och dammen, och menyn i våffelrutor.', visa: false },
    { namn: 'Mohlins Konditori', plats: 'Konditori på Hisingen', bild: 'img/exempel/mohlins.webp',
      text: 'Tårtpapper, vinrött och en prinsesstårta som snurrar på spetspappret.', visa: false },
    { namn: 'Crippas Café', plats: 'Veganbar och scen i Majorna', bild: 'img/exempel/crippas.webp',
      text: 'Fanzine-stil och en snurrande LP-skiva som visar om det är öppet just nu.', visa: false }
  ],

  // Provbänken: frågorna i testet "Hur mår er hemsida?".
  // rad = det som visas som tips när svaret är nej.
  provbank: [
    { fraga: 'Syns öppettiderna direkt när man kommer in på sidan?', rad: 'Öppettiderna ska synas direkt – helst med "öppet nu".' },
    { fraga: 'Går menyn eller sortimentet att läsa som vanlig text, inte som PDF eller bild?', rad: 'Menyn ska vara riktig text, så att Google hittar den och den går att läsa i mobilen.' },
    { fraga: 'Fungerar sidan bra i mobilen?', rad: 'De flesta besöker er från mobilen – sidan måste vara byggd för den.' },
    { fraga: 'Kan kunderna ringa, boka eller beställa med ett klick?', rad: 'Det viktigaste kunden vill göra ska gå med ett klick, på varje sida.' },
    { fraga: 'Finns det riktiga bilder på det ni säljer?', rad: 'Riktiga bilder på mat, lokal och människor säljer mer än något annat.' },
    { fraga: 'Stämmer adress och öppettider med det som står på Google?', rad: 'Adress och öppettider måste vara samma överallt, annars tappar ni kunder.' },
    { fraga: 'Laddar sidan på under tre sekunder?', rad: 'En långsam sida tappar besökare innan den ens har visats.' },
    { fraga: 'Ser sidan ut som ert företag – inte som en mall?', rad: 'Kunderna ska känna igen er på hemsidan, precis som när de kliver in genom dörren.' }
  ]
};
