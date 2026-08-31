# État du projet — reprise de session

Document de passation. À lire en premier lors d'une nouvelle session de
travail sur ce site. Dernière mise à jour : 31 août 2026.

---

## Le projet en une phrase

**Alexo** est le site vitrine d'un studio web indépendant basé à Maîche
(Haut-Doubs), tenu par Alexis. Il vend des sites internet à des indépendants
et petites entreprises de la région.

- **Dépôt** : `github.com/AlexisM25120/alexo-website`, branche `main`
- **Domaine** : `alexowebdesign.com`, hébergé chez Hostinger (Premium)
- **Contact** : `alexo.webdesign@gmail.com`

## La stack — à lire avant de proposer quoi que ce soit

Site **statique** : HTML, CSS et JavaScript natifs. **Aucun build, aucune
dépendance, aucun gestionnaire de paquets.** Pas de React, pas de Tailwind,
pas de TypeScript.

C'est un choix assumé : le site se charge instantanément et se déploie par
simple copie de fichiers. Toute proposition qui suppose une pile de
construction doit être portée en natif, pas installée.

```
index.html              page d'accueil
cgv.html                conditions générales de vente
mentions-legales.html   mentions légales + RGPD
404.html
assets/css/style.css    toute la mise en forme
assets/js/main.js       menu, apparitions, compteur, galerie, formulaire
assets/img/             portrait + captures des démos
demos/                  trois sites de démonstration autonomes
docs/DEPLOIEMENT-HOSTINGER.md
ERRORS_LOG.md           journal des bugs, causes racines, règles préventives
```

---

## Deux règles à ne jamais oublier

### 1. Incrémenter `?v=` à chaque modification du CSS ou du JS

Les pages appellent `style.css?v=14` et `main.js?v=14`. Le fichier
`.htaccess` demande de conserver ces fichiers **un an** en cache.

Sans changer ce numéro, une modification reste **invisible en ligne** — pour
les visiteurs comme pour Alexis. Ce piège a coûté six échanges le 10 août.

```bash
grep -rn "style.css?v=" *.html    # vérifier qu'aucune page n'est oubliée
```

### 2. La mise en ligne demande une action d'Alexis

Pousser sur GitHub ne publie rien. Hostinger ne va chercher les nouveautés
que si l'on clique **Deploy** dans hPanel → *Avancé* → *Git*.

Un workflow GitHub Actions existe (`.github/workflows/deploy.yml`) mais il
est **en veille** : les secrets `FTP_HOST`, `FTP_USER` et `FTP_PASSWORD`
n'ont jamais été renseignés. Pour l'activer, voir la doc de déploiement.

**Concrètement, le site public sert toujours une version antérieure au
12 août.** Aucune des trois voies de publication ne fonctionne actuellement :
le déclencheur automatique du workflow est commenté, 6 exécutions sur 6 ont
échoué (dernière le 12 août, faute de secrets), et rien n'indique qu'un
webhook Hostinger soit branché. Le bouton *Deploy* de hPanel → *Avancé* →
*Git* reste la voie manuelle de secours si un dépôt y est déjà configuré.

---

## Ce qui est fait

**Contenu** — hero avec accroche « Nous créons des sites web qui génèrent
des ventes pour les entreprises du Doubs », badges de réassurance, diagramme
« pas seulement du design », frise du déroulé en six étapes, galerie de trois
démos, chiffres sourcés, section « pourquoi le beau compte », portrait et bio,
trois forfaits, FAQ de huit questions, formulaire, pied de page.

**Design** — palette claire imposée par le client : vert pâle `#C5E1B8`,
gris ardoise `#373E4D`, blanc cassé `#F7F7F7`, gris clair `#BDC3C7`, clair
`#E6DCD2`. Typographie Inter (titres), Open Sans (corps, 18 px), Playfair
Display (accents). Tout est centralisé dans `:root`, aucune couleur en dur.

**Tarifs actuels** — Site Vitrine 1497 € (une page), Forfait Recommandé
2997 € (4 à 6 pages, mis en avant), Site Premium 3997 € (6 à 10 pages).
Acompte de 500 € sur les trois. Les CGV décrivent exactement ces trois
formules depuis le 22 août : prix fermes, volumes de pages bornés, et une
clause de devis complémentaire pour tout ce qui sort du périmètre.

**Mentions légales** — complètes. ALEXO, entrepreneur individuel
(micro-entreprise), Alexis Moine, 4 rue Paul Decrind, 25120 Maîche,
SIRET 108 885 658 00014, code APE 62.01Z, TVA non applicable (art. 293 B).

**Formulaire** — fonctionnel et vérifié de bout en bout le 12 août. Passe par
FormSubmit ; l'adresse a été confirmée. Un mode diagnostic est disponible en
ouvrant la page avec `?debug=1` : le motif exact d'un refus s'affiche alors
à l'écran.

**RGPD / Analytics** — bandeau de consentement sur `index.html`, choix
stocké dans `localStorage` sous la clé `cookie_consent` (`accepted` /
`refused`). GA4 (`G-TW2890GNE2`) n'est chargé qu'après un clic sur
« Accepter » — jamais avant, jamais après un refus. Un refus ultérieur pose
le drapeau `ga-disable-<ID>` et supprime les cookies `_ga`. Lien
« Gérer les cookies » dans le pied de page des quatre pages. Section
« Cookies et mesure d'audience » complète dans `mentions-legales.html`.

**Icônes** — `favicon-v2.svg` (vectoriel, renommé le 25 août pour forcer les
navigateurs à reprendre l'icône après déploiement) déclaré en premier sur
les quatre pages, suivi des PNG de repli dans `assets/img/` (`favicon-32.png`,
`icon-512.png`, `apple-touch-icon.png`).

---

## Ce qui reste à faire

### Fait le 22 août — ne pas refaire

Les trois points autrefois bloquants sont levés. Résumé, pour éviter qu'une
session suivante ne les rouvre :

- **Le SIRET est obtenu** et l'identité légale est renseignée partout. Plus
  aucun `[À COMPLÉTER]` dans les fichiers HTML.
- **Le `noindex` de pré-lancement est retiré** de `index.html`, `cgv.html` et
  `mentions-legales.html`. Ceux de `404.html` et de `demos/` restent en
  place : ils sont permanents et voulus. `robots.txt` n'a pas changé de
  directive — voir `ERRORS_LOG.md` pour la raison.
- **Les CGV sont alignées** sur les trois forfaits de la page d'accueil, et
  la FAQ ainsi que les deux méta-descriptions d'`index.html`, qui citaient
  encore 1997 € et la gestion publicitaire, sont corrigées.

### Reste à faire

1. **Google Search Console** : inscrire le site et soumettre `sitemap.xml`.
   Le site est indexable, mais rien n'a encore été déclaré à Google.

2. **« Nous » contre « je ».** Le titre du hero dit « Nous créons », le reste
   du site dit « je » et vend l'argument « un interlocuteur, pas une agence ».
   L'écart se remarque.

3. Deux finitions rédactionnelles laissées ouvertes dans les CGV : la clause
   de périmètre de 3.2 énumère des exemples (e-commerce, multilingue) que
   celle de 3.3 ne reprend pas, et la première puce de 3.3 redit ce que sa
   clause de périmètre énonce déjà.

### Confort, sans urgence

4. Police définitive du logo (la marque est en Playfair par défaut).
5. Les polices Google transmettent l'adresse IP des visiteurs à Google, ce
   qui pose un point RGPD sur un site qui a une page confidentialité. Les
   héberger localement règle aussi la performance.
6. `icon_alexo_hq.png` (1200x1200) est dans le dépôt mais n'est référencé
   nulle part.

---

## Contraintes de l'assistant — à connaître d'emblée

Ces limites ont fait perdre du temps par le passé ; les annoncer évite de
les redécouvrir.

- **Le site en ligne n'est pas joignable** depuis l'environnement de travail
  (le proxy réseau bloque `alexowebdesign.com`). Impossible de vérifier ce
  qu'affiche réellement le site publié.
- **Aucun accès au web** en général : impossible d'ouvrir un site de
  référence fourni en lien. Demander des captures d'écran à la place, ce qui
  fonctionne mieux pour du design.
- **Impossible de tester un envoi réel du formulaire** : aucun accès réseau
  vers FormSubmit.
- **Sur tout problème visuel, demander une capture d'écran en premier.**
  Une image a réglé en une seconde ce que six échanges n'avaient pas cerné.

---

## Comment vérifier son travail

Le site n'a pas de tests embarqués, mais une suite de contrôles a été écrite
avec Playwright (Chromium est préinstallé). Servir le site en local puis
vérifier : liens morts, erreurs JavaScript, contraste WCAG AA mesuré dans le
navigateur, débordement horizontal à 375 / 768 / 1440 px, accordéon de la
FAQ, comportement du formulaire sur cinq réponses simulées, et défilement
libre au survol de la galerie.

```bash
python3 -m http.server 8000     # depuis la racine du dépôt
```

Points de vigilance issus des bugs passés, détaillés dans `ERRORS_LOG.md` :

- Ne jamais conclure au succès d'un envoi sur le seul code HTTP.
- Ne jamais appeler `preventDefault()` sans remplacer effectivement le
  comportement bloqué.
- Toute recherche d'élément dans `main.js` doit être gardée par un `if`.
- Vérifier le contraste avant d'introduire une couleur de texte.
