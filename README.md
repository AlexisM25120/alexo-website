# Alexo — site vitrine

Site du studio web **Alexo**. Site statique (HTML / CSS / JS natif), sans dépendance ni build : il se déploie par simple copie de fichiers.

**Le site est à la racine de ce dépôt** — c'est volontaire : le déploiement Git de Hostinger publie la racine du dépôt telle quelle dans `public_html/`.

## Contenu

```
.
├── index.html                page d'accueil
├── mentions-legales.html     mentions légales + RGPD
├── cgv.html                  conditions générales de vente
├── 404.html                  page d'erreur
├── favicon.svg
├── robots.txt
├── sitemap.xml
├── .htaccess                 config Apache : HTTPS, cache, en-têtes de sécurité
│
├── assets/
│   ├── css/style.css         tous les styles
│   ├── js/main.js            animations, carrousel 3D, formulaire
│   └── img/                  captures des sites de démonstration
│
├── demos/                    trois sites de démonstration complets
│   ├── osteopathe/           Cabinet Rivière
│   ├── dentaire/             Cabinet Solène
│   └── artisan/              Atelier Bois & Fer
│
├── brand/                    éléments de marque (hors ligne éditoriale du site)
└── docs/
    └── DEPLOIEMENT-HOSTINGER.md
```

## Tester en local

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Mise en ligne

Voir **[docs/DEPLOIEMENT-HOSTINGER.md](docs/DEPLOIEMENT-HOSTINGER.md)**.

Deux options :
- **Upload manuel** — copier tout le contenu de ce dépôt dans `public_html/`
- **Déploiement Git** — hPanel → *Avancé* → **Git**, brancher ce dépôt sur la branche `main`

## À compléter

- [ ] Champs `[À COMPLÉTER]` dans `mentions-legales.html` et `cgv.html` (nom, adresse, SIRET) une fois l'entreprise immatriculée
- [ ] Photo dans la section « Qui je suis » (`index.html`, bloc `.portrait-frame`)
- [ ] Confirmer FormSubmit au premier envoi réel du formulaire de maquette
- [ ] Remplacer `alexo.fr` par le vrai domaine dans `.htaccess`, `robots.txt`, `sitemap.xml` et les balises `og:`/`canonical`
- [ ] Police du logo à la place du placeholder Instrument Serif (variable `--font-display`)
