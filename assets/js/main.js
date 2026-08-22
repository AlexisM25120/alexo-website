const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Menu mobile
// Les gardes `if` de ce fichier ne sont pas décoratives : ce script est chargé
// page par page, et une page qui n'a pas l'élément attendu lèverait une
// TypeError qui interromprait TOUT le script en dessous.
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');
if (burger && mobileMenu) {
  burger.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    burger.setAttribute('aria-expanded', String(open));
  });
  mobileMenu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal au scroll, en cascade dans chaque groupe
const revealEls = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const siblings = [...entry.target.parentElement.querySelectorAll(':scope > .reveal')];
      entry.target.style.setProperty('--reveal-delay', `${siblings.indexOf(entry.target) * 0.08}s`);
      entry.target.classList.add('in-view');
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);
revealEls.forEach((el) => observer.observe(el));

// Frise du déroulé : chaque étape apparaît à son tour au défilement.
// Un observateur distinct de celui des `.reveal` : le seuil est plus bas et
// le décalage se calcule sur la position dans la frise, pour que les étapes
// s'enchaînent au lieu d'apparaître toutes ensemble.
const tlSteps = [...document.querySelectorAll('.tl-step')];
if (tlSteps.length) {
  if (reducedMotion) {
    tlSteps.forEach((el) => el.classList.add('in-view'));
  } else {
    const tlObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.style.transitionDelay =
            `${Math.min(tlSteps.indexOf(entry.target), 2) * 0.12}s`;
          entry.target.classList.add('in-view');
          tlObserver.unobserve(entry.target);
        });
      },
      { threshold: 0.3, rootMargin: '0px 0px -8% 0px' }
    );
    tlSteps.forEach((el) => tlObserver.observe(el));
  }
}

// Barre de progression de lecture
const progressFill = document.getElementById('progressFill');
if (progressFill) {
  const updateProgress = () => {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = scrollable > 0 ? window.scrollY / scrollable : 0;
    progressFill.style.width = `${Math.min(ratio, 1) * 100}%`;
  };
  window.addEventListener('scroll', updateProgress, { passive: true });
  updateProgress();
}

// Compteur du prix, déclenché quand la carte entre à l'écran
const countObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      countObserver.unobserve(entry.target);
      const el = entry.target;
      const target = Number(el.dataset.value);
      const prefix = el.dataset.prefix || '';
      const suffix = el.dataset.suffix || '&nbsp;€';
      const render = (n) => { el.innerHTML = `${prefix}${n}${suffix}`; };
      if (reducedMotion) {
        render(target);
        return;
      }
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / 1100, 1);
        render(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    });
  },
  // Seuil bas : dans la grille à trois offres, la carte peut n'être que
  // partiellement visible sur les petits écrans.
  { threshold: 0.25 }
);
document.querySelectorAll('[data-value]').forEach((el) => countObserver.observe(el));

if (!reducedMotion) {
  // Curseur personnalisé, grossit sur les éléments cliquables
  const cursor = document.getElementById('cursor');
  if (cursor) {
    window.addEventListener('pointermove', (event) => {
      cursor.classList.add('visible');
      cursor.style.left = `${event.clientX}px`;
      cursor.style.top = `${event.clientY}px`;
    });
    document.querySelectorAll('a, button, input, textarea').forEach((el) => {
      el.addEventListener('pointerenter', () => cursor.classList.add('grow'));
      el.addEventListener('pointerleave', () => cursor.classList.remove('grow'));
    });
  }
}

// Inclinaison 3D d'un élément selon la position du curseur.
// Défini ici depuis le retrait du hero animé : la galerie s'en sert encore.
const tilt3d = (el, maxDeg = 10, lift = 0) => {
  if (!el || reducedMotion) return;
  el.addEventListener('pointermove', (event) => {
    const rect = el.getBoundingClientRect();
    const rx = ((event.clientY - rect.top) / rect.height - 0.5) * -maxDeg;
    const ry = ((event.clientX - rect.left) / rect.width - 0.5) * maxDeg;
    el.style.transform = `rotateX(${rx}deg) rotateY(${ry}deg) translateZ(${lift}px)`;
  });
  el.addEventListener('pointerleave', () => {
    el.style.transform = 'rotateX(0deg) rotateY(0deg) translateZ(0px)';
  });
};

const rail = document.getElementById('workRail');
if (rail) {
  const cards = [...rail.querySelectorAll('.work-card')];

  // Chaque carte pivote et recule selon sa distance au centre du rail
  const project = () => {
    const railCenter = rail.scrollLeft + rail.clientWidth / 2;
    cards.forEach((card) => {
      const cardCenter = card.offsetLeft + card.offsetWidth / 2;
      const offset = (cardCenter - railCenter) / rail.clientWidth;
      const clamped = Math.max(-1, Math.min(1, offset));
      card.style.setProperty('--rot', `${clamped * -26}deg`);
      card.style.setProperty('--depth', `${-Math.abs(clamped) * 180}px`);
    });
  };

  rail.addEventListener('scroll', project, { passive: true });
  window.addEventListener('resize', project);
  project();

  // Les écrans s'inclinent aussi sous le curseur, en plus du carrousel
  cards.forEach((card) => tilt3d(card.querySelector('.wc-screen'), 12, 30));

  let dragging = false;
  let startX = 0;
  let startScroll = 0;
  rail.addEventListener('pointerdown', (event) => {
    dragging = true;
    startX = event.clientX;
    startScroll = rail.scrollLeft;
    rail.classList.add('dragging');
    rail.setPointerCapture(event.pointerId);
  });
  rail.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    rail.scrollLeft = startScroll - (event.clientX - startX) * 1.4;
  });
  const stop = () => { dragging = false; rail.classList.remove('dragging'); };
  rail.addEventListener('pointerup', stop);
  rail.addEventListener('pointercancel', stop);
  // Pas de détournement de la molette ici.
  // L'ancienne version convertissait le défilement vertical en défilement
  // horizontal et appelait preventDefault() à chaque coup de molette. Une fois
  // la galerie arrivée en butée, scrollLeft ne bougeait plus mais le
  // preventDefault continuait de bloquer la page : le curseur posé sur la
  // galerie figeait tout le site. La molette reste donc à la page ; le
  // défilement horizontal se fait au glisser, au doigt ou au clavier.
  }

// Formulaire "maquette gratuite"
// Envoi via FormSubmit (https://formsubmit.co) : aucun compte à créer,
// juste confirmer une fois par e-mail au premier envoi réel vers
// alexo.webdesign@gmail.com. Le champ _honey est un piège anti-spam.
const LEAD_ENDPOINT = 'https://formsubmit.co/ajax/alexo.webdesign@gmail.com';
const leadForm = document.getElementById('leadForm');
const formNote = document.getElementById('formNote');

if (leadForm && formNote) {
  leadForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const submitBtn = leadForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    formNote.classList.remove('success', 'error');
    formNote.textContent = 'Envoi en cours...';

    try {
      const response = await fetch(LEAD_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(Object.fromEntries(new FormData(leadForm))),
      });

      // FormSubmit répond HTTP 200 même quand il refuse l'envoi — notamment
      // tant que l'adresse de destination n'a pas été confirmée. Se fier au
      // seul code HTTP afficherait un « Merci ! » alors que rien n'est parti,
      // et des demandes seraient perdues sans que personne ne le sache.
      let payload = null;
      try { payload = await response.json(); } catch { /* réponse non JSON */ }

      const refused = payload && payload.success !== undefined
        && String(payload.success).toLowerCase() !== 'true';

      if (!response.ok || refused) {
        throw new Error((payload && payload.message) || `HTTP ${response.status}`);
      }

      formNote.textContent = 'Merci ! Votre demande a bien été reçue — réponse sous 3 jours ouvrés.';
      formNote.classList.add('success');
      leadForm.reset();
    } catch (err) {
      // Le détail va dans la console : il indique la cause exacte du refus.
      console.error('Formulaire de maquette — envoi refusé :', err.message);
      // Mode diagnostic : en ouvrant la page avec ?debug=1, le motif exact du
      // refus s'affiche à l'écran. Cela évite d'ouvrir les outils du
      // navigateur pour comprendre. Un visiteur normal ne le voit jamais.
      if (new URLSearchParams(location.search).has('debug')) {
        formNote.textContent = 'DIAGNOSTIC — motif du refus : ' + err.message;
        formNote.classList.add('error');
        submitBtn.disabled = false;
        return;
      }
      // Contenu fixe, aucune donnée du visiteur n'est réinjectée ici.
      formNote.innerHTML =
        'L\'envoi a échoué — écrivez-moi directement à '
        + '<a href="mailto:alexo.webdesign@gmail.com">alexo.webdesign@gmail.com</a>.';
      formNote.classList.add('error');
    } finally {
      submitBtn.disabled = false;
    }
  });
}

/* ------------------------------------------------------------------
   Consentement cookies et chargement conditionnel de Google Analytics

   Règle : AUCUN script de mesure n'est chargé tant que le visiteur n'a
   pas accepté. Ni au premier chargement, ni après un refus. GA n'est
   injecté qu'à deux moments — au chargement si un « accepted » est déjà
   enregistré, ou au clic sur « Accepter ».

   Le bandeau n'existe que sur index.html : la garde `if` ci-dessous
   n'est pas décorative, main.js est chargé par toutes les pages.
------------------------------------------------------------------ */
const cookieBar = document.getElementById('cookieConsent');
if (cookieBar) {
  const CONSENT_KEY = 'cookie_consent';

  // GA_MEASUREMENT_ID à insérer ici — format « G-XXXXXXXXXX ».
  // Une chaîne vide neutralise la mesure : le bandeau fonctionne
  // normalement, mais aucun script n'est chargé même après un « Accepter ».
  const GA_MEASUREMENT_ID = 'G-TW2890GNE2';

  // localStorage lève une exception en navigation privée sur certains
  // navigateurs, et quand les données de site sont bloquées. Dans ce cas
  // on retombe sur « pas de choix connu » : le bandeau s'affiche, et un
  // refus reste un refus pour la durée de la visite.
  const readConsent = () => {
    try { return localStorage.getItem(CONSENT_KEY); } catch (err) { return null; }
  };
  const writeConsent = (value) => {
    try { localStorage.setItem(CONSENT_KEY, value); } catch (err) { /* sans effet */ }
  };

  let analyticsLoaded = false;
  const loadAnalytics = () => {
    if (analyticsLoaded || !GA_MEASUREMENT_ID) return;
    analyticsLoaded = true;

    const tag = document.createElement('script');
    tag.async = true;
    tag.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_MEASUREMENT_ID;
    document.head.appendChild(tag);

    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', GA_MEASUREMENT_ID, { anonymize_ip: true });
  };

  // Retrait du consentement. Un script déjà injecté ne peut pas être
  // « désinjecté » : gtag.js prévoit pour cela un drapeau global que la
  // bibliothèque teste avant chaque envoi. On supprime en plus les cookies
  // déjà posés (_ga et _ga_<conteneur>), sans quoi le refus ne serait
  // effectif qu'au prochain chargement de page.
  const revokeAnalytics = () => {
    window['ga-disable-' + GA_MEASUREMENT_ID] = true;
    document.cookie.split(';').forEach((entry) => {
      const name = entry.split('=')[0].trim();
      if (!/^_ga/.test(name)) return;
      const expire = '=; Max-Age=0; path=/';
      document.cookie = name + expire;
      document.cookie = name + expire + '; domain=' + location.hostname;
      document.cookie = name + expire + '; domain=.' + location.hostname;
    });
  };

  const decide = (value) => {
    writeConsent(value);
    cookieBar.hidden = true;
    if (value === 'accepted') loadAnalytics();
    else revokeAnalytics();
  };

  const consent = readConsent();
  if (consent === 'accepted') {
    loadAnalytics();
  } else if (consent !== 'refused') {
    cookieBar.hidden = false;
  }

  const cookieAccept = document.getElementById('cookieAccept');
  const cookieRefuse = document.getElementById('cookieRefuse');
  if (cookieAccept) cookieAccept.addEventListener('click', () => decide('accepted'));
  if (cookieRefuse) cookieRefuse.addEventListener('click', () => decide('refused'));

  // « Gérer les cookies » — le RGPD demande que retirer son consentement
  // soit aussi simple que le donner. Le bandeau est simplement réaffiché,
  // et le prochain clic écrase le choix enregistré.
  const reopenBar = () => { cookieBar.hidden = false; };

  const cookieManage = document.getElementById('cookieManage');
  if (cookieManage) cookieManage.addEventListener('click', reopenBar);

  // Les autres pages n'ont pas le bandeau : leur lien de pied de page
  // renvoie ici avec ce fragment, qui rouvre le choix à l'arrivée.
  if (location.hash === '#gerer-cookies') reopenBar();
  window.addEventListener('hashchange', () => {
    if (location.hash === '#gerer-cookies') reopenBar();
  });
}
