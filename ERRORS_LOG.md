# Journal des erreurs

Historique des problèmes détectés et corrigés sur le site Alexo, et règles à
appliquer pour éviter qu'ils ne reviennent.

Format : une entrée par problème, la plus récente en haut.

---

## Passe d'audit du 10 août 2026

Périmètre : `index.html`, `cgv.html`, `mentions-legales.html`, `404.html`, les
trois démos, `assets/css/style.css`, `assets/js/main.js`, `.htaccess`,
`robots.txt`, `sitemap.xml`.

Outillage : contrôle statique maison (liens, ancres, `alt`, structure Hn,
métadonnées, secrets), ESLint, Chromium headless via Playwright aux largeurs
375 / 768 / 1440 px, calcul de contraste WCAG.

### A-01 — Aucune garde sur les recherches d'éléments du DOM

- **Catégorie** : robustesse / cohérence du code
- **Sévérité** : important
- **Localisation** : `assets/js/main.js` — lignes 4-5, 34, 80, 132, 159, 269-270 (avant correction)
- **Symptôme** : aucun aujourd'hui. `main.js` n'est chargé que par `index.html`,
  qui contient tous les éléments attendus.
- **Cause racine** : le script attaquait directement `burger.addEventListener`,
  `progressFill.style`, `canvas.getContext`, `cursor.classList`,
  `heroMark.querySelector` et `leadForm.addEventListener` sans vérifier que
  l'élément existe. Le carrousel (`rail`) était le seul protégé par un `if` —
  incohérence qui montrait que la garde avait été oubliée ailleurs, pas
  volontairement omise.
- **Pourquoi c'est un piège** : le jour où `main.js` est ajouté à une autre page
  (par exemple pour animer le menu des CGV), la première ligne non gardée lève
  une `TypeError` qui **interrompt tout le script en dessous**. La panne serait
  silencieuse pour un visiteur et difficile à relier à sa cause.
- **Correction** : chaque bloc est désormais encadré par une garde d'existence.
  Comportement inchangé sur `index.html`.

### A-02 — Sélecteur CSS mort

- **Catégorie** : cohérence du code
- **Sévérité** : mineur
- **Localisation** : `assets/css/style.css:876` (avant correction)
- **Cause racine** : `.marquee-track` était un reliquat d'un bandeau défilant
  retiré lors de la refonte du 3 août. Le sélecteur subsistait dans le bloc
  `prefers-reduced-motion`, sans plus aucun élément correspondant.
- **Correction** : sélecteur supprimé. Aucun impact visuel.

### A-03 — Meta description absente sur la page 404

- **Catégorie** : SEO
- **Sévérité** : mineur
- **Localisation** : `404.html`, `<head>`
- **Correction** : `<meta name="description">` ajoutée. La page reste en
  `noindex`, la balise sert uniquement à la cohérence des métadonnées.

---

## Corrections à effet visuel — arbitrées puis appliquées

Ces trois points modifiaient l'apparence ou le comportement visible. Ils ont
été soumis à décision avant application, puis corrigés selon les choix retenus.

### B-01 — Navigation absente sur mobile pour les pages légales

- **Catégorie** : bug fonctionnel / responsive
- **Sévérité** : important
- **Localisation** : `assets/css/style.css:208-211`, appliqué à `cgv.html`,
  `mentions-legales.html`
- **Cause racine** : la règle `@media (max-width: 900px) { .nav, .nav-cta
  { display: none; } .burger { display: flex; } }` est écrite pour la page
  d'accueil, qui possède un bouton burger et un menu déroulant. Les pages
  légales réutilisent la même feuille de style mais n'ont **ni burger ni menu
  mobile** dans leur balisage. En dessous de 900 px, leurs liens de navigation
  disparaissent donc sans être remplacés.
- **Mesure** : à 375 px et 768 px, seul le logo `alexo` reste cliquable sur ces
  pages. Le visiteur n'est pas piégé — le logo ramène à l'accueil — mais la
  navigation est perdue.
- **Décision** : garder les liens visibles sur mobile plutôt que d'ajouter le
  burger — ces pages n'ont que trois liens, et cette option n'introduit aucun
  JavaScript supplémentaire sur des pages qui n'en chargent pas.
- **Correction** : les deux pages portent désormais `class="topbar topbar-lite"`.
  Sous 900 px, `.topbar-lite .nav` reste affiché, passe en `flex-wrap` sur une
  deuxième ligne et réduit sa taille de police. L'accueil et la page 404 sont
  inchangés.
- **Vérification** : à 375 px et 768 px, les trois liens sont mesurés visibles
  sur `cgv.html` et `mentions-legales.html`. Aucun débordement horizontal
  introduit.

### B-02 — Contraste insuffisant de `--chalk-mute`

- **Catégorie** : accessibilité
- **Sévérité** : important
- **Localisation** : `assets/css/style.css:16`
- **Mesure** : `#6a6a67` sur `--ink` (`#0a0a0b`) = **3,65:1** ; sur
  `--ink-raised` (`#121213`) = **3,45:1**. Le minimum WCAG AA pour du texte
  normal est 4,5:1.
- **Portée** : couleur utilisée comme couleur de texte dans une douzaine de
  règles, à des tailles de 0,54 rem à 0,96 rem (≈ 8,6 à 15,4 px) — labels,
  légendes, sources. Toutes sont bien en dessous du seuil « grand texte » qui
  autoriserait 3:1.
- **Décision** : corriger — la lisibilité prime sur l'écart de nuance.
- **Correction** : `--chalk-mute` passe à `#7d7d7a`, soit **4,79:1** sur
  `--ink` et **4,53:1** sur `--ink-raised`. Conforme AA sur les deux fonds,
  et toujours dans la gamme monochrome.
- **Réserve connue et acceptée** : `input::placeholder` combine cette couleur
  avec `opacity: .6`, ce qui replonge le texte indicatif sous le seuil. C'est
  admis : chaque champ possède un `<label>` visible et associé, le placeholder
  n'est qu'un complément, jamais la seule information.

### B-03 — Pas de style de focus clavier explicite

- **Catégorie** : accessibilité
- **Sévérité** : mineur
- **Localisation** : `assets/css/style.css:732`
- **Détail** : `input:focus, textarea:focus { outline: none; }` retire l'anneau
  de focus des champs, remplacé par un changement de couleur de bordure — c'est
  un indicateur visible, donc acceptable. En revanche aucun `:focus-visible`
  n'est défini pour les liens et les boutons : ils conservent l'anneau par
  défaut du navigateur, non accordé à la charte. Aucun lien d'évitement
  (« Aller au contenu ») n'est présent non plus.
- **Décision** : ajouter l'anneau de focus accordé à la charte ; le lien
  d'évitement n'a pas été retenu.
- **Correction** : bloc `:focus-visible` en fin de feuille de style, sur les
  liens, boutons, champs et éléments `[tabindex]`. Placé en fin de fichier à
  dessein : `input:focus { outline: none }` a la même spécificité, seul l'ordre
  de déclaration le fait passer devant. `:focus-visible` ne se déclenche qu'au
  clavier — rien ne change à la souris.
- **Reste ouvert** : pas de lien d'évitement.

---

## Points vérifiés et conformes

Contrôlés lors de cette passe, sans défaut trouvé :

- Aucun lien mort, aucune ancre sans cible, aucun `id` dupliqué.
- Aucune erreur JavaScript en console sur les 7 pages × 3 largeurs.
- Aucune requête interne en échec (404/500).
- **Aucun débordement horizontal** à 375, 768 et 1440 px, aucun texte tronqué.
- Toutes les `<img>` ont un `alt` descriptif, un `loading="lazy"` et des
  dimensions déclarées **conformes au fichier réel** (1440×1080) — donc pas de
  saut de mise en page au chargement.
- Un seul `<h1>` par page, hiérarchie Hn sans saut de niveau.
- `lang`, `title`, `viewport` présents partout.
- Aucun secret, clé d'API ni jeton dans le code.
- `sitemap.xml` cohérent avec les fichiers réellement présents.
- Images totalisant 351 Ko pour trois captures — pas d'optimisation urgente.
- Le site reste lisible et fonctionnel **lorsque Google Fonts est injoignable** :
  les polices de repli sont déclarées et la mise en page ne casse pas.

---

## Règles préventives

Tirées des problèmes rencontrés ci-dessus.

1. **Toujours garder les recherches d'éléments dans un script partagé.**
   `main.js` est chargé par plusieurs pages potentielles : tout
   `getElementById` doit être suivi d'une garde d'existence avant usage. Une
   `TypeError` non gardée n'échoue pas seule, elle emporte tout le script en
   dessous.

2. **Une règle responsive qui cache un élément doit vérifier que son
   remplaçant existe sur toutes les pages concernées.** Cacher `.nav` en
   supposant la présence de `.burger` est ce qui a produit B-01. Les pages
   secondaires réutilisent la feuille de style sans en reprendre tout le
   balisage.

3. **Vérifier le contraste avant d'ajouter une couleur de texte.** Seuil
   WCAG AA : 4,5:1 pour du texte normal, 3:1 seulement au-delà de 24 px (ou
   18,7 px en gras). Sur fond sombre, un gris qui « semble lisible » est
   souvent en dessous du seuil.

4. **Supprimer les sélecteurs CSS en même temps que le composant.** Le
   balisage retiré laisse des règles orphelines qui donnent l'illusion d'un
   comportement encore actif.

5. **Après tout changement de domaine, rechercher l'ancienne valeur partout.**
   Le domaine apparaît dans `.htaccess`, `robots.txt`, `sitemap.xml`, les
   balises `canonical` et `og:`, et l'objet du formulaire :
   `grep -rn "ancien-domaine" .`

6. **Ne jamais activer la redirection HTTPS de `.htaccess` avant que le
   certificat SSL soit actif.** Boucle de redirection, site injoignable.

7. **Ne pas mettre `Disallow: /` dans `robots.txt` pour masquer un site.**
   Cela empêche la lecture de la balise `noindex` et l'URL peut ressortir
   malgré tout. Laisser le crawl ouvert et poser `noindex` sur les pages.

---

## Comment rejouer l'audit

Aucune dépendance n'est installée dans le dépôt : le site est statique et le
reste. Les contrôles se relancent depuis un serveur local.

```bash
python3 -m http.server 8000    # depuis la racine du dépôt
```

Contrôles effectués lors de cette passe, à reproduire après toute modification
notable : liens et ancres internes, `alt` des images, structure Hn,
métadonnées, absence de secrets, erreurs console, requêtes en échec,
débordement horizontal à 375 / 768 / 1440 px, contraste des couleurs de texte.
