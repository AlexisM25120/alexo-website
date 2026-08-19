# État du projet — reprise de session

Document de passation. À lire en premier lors d'une nouvelle session de
travail sur ce site. Dernière mise à jour : 12 août 2026, commit `ea15f57`.

---

## Le projet en une phrase

**Alexo** est le site vitrine d'un studio web indépendant basé à Besançon
(Doubs), tenu par Alexis. Il vend des sites internet à des indépendants et
petites entreprises de la région.

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

Les pages appellent `style.css?v=12` et `main.js?v=12`. Le fichier
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

**Tarifs actuels** — Site Vitrine 1497 €, Forfait Recommandé 2997 € (mis en
avant), Site Premium 3997 €. Acompte de 500 € sur les trois.

**Formulaire** — fonctionnel et vérifié de bout en bout le 12 août. Passe par
FormSubmit ; l'adresse a été confirmée. Un mode diagnostic est disponible en
ouvrant la page avec `?debug=1` : le motif exact d'un refus s'affiche alors
à l'écran.

---

## Ce qui reste à faire

### Bloquant pour le lancement

1. **Le SIRET.** L'entreprise n'est pas encore immatriculée. Sept champs
   `[À COMPLÉTER]` attendent dans `cgv.html` (2) et `mentions-legales.html`
   (5) : nom, adresse, SIRET. Ces mentions sont **obligatoires** (art. 6 III
   de la LCEN) dès que le site est publiquement référencé.

2. **Retirer le `noindex`.** Le site est volontairement tenu hors de Google
   tant que les mentions légales sont incomplètes. Une balise
   `<meta name="robots" content="noindex">` marquée `PRÉ-LANCEMENT` est
   posée dans `index.html`, `cgv.html` et `mentions-legales.html`.
   Ne pas y toucher dans `404.html` ni dans `demos/` : le `noindex` y est
   permanent et voulu. Ne rien changer dans `robots.txt` — voir `ERRORS_LOG.md`
   pour la raison.

3. **Google Search Console**, une fois le site indexable.

### Incohérences connues, en attente d'arbitrage

4. **Les CGV citent encore les anciens tarifs** : 1997 €, à partir de
   2997 €, et 997 €/mois pour une formule « Gestion Publicitaire » qui
   n'existe plus sur la page d'accueil. Elles décrivent aussi un site de
   4 pages pour la formule d'entrée, désormais vendue comme page unique.
   **C'est le point le plus urgent après le SIRET** : un contrat qui
   contredit la page de vente est un risque réel.

5. **« Nous » contre « je ».** Le titre du hero dit « Nous créons », le reste
   du site dit « je » et vend l'argument « un interlocuteur, pas une agence ».
   L'écart se remarque.

### Confort, sans urgence

6. Police définitive du logo (la marque est en Playfair par défaut).
7. Aucune image de partage (`og:image`) : les liens envoyés sur WhatsApp ou
   LinkedIn n'affichent aucun aperçu, alors que le code en promet un.
8. Les polices Google transmettent l'adresse IP des visiteurs à Google, ce
   qui pose un point RGPD sur un site qui a une page confidentialité. Les
   héberger localement règle aussi la performance.

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
