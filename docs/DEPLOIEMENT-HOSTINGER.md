# Mise en ligne sur Hostinger

Le site est **statique** (HTML/CSS/JS, aucun build, aucune base de données). Sur Hostinger, la formule d'hébergement web mutualisée la moins chère suffit — pas besoin de VPS.

> **Règle à retenir :** la **racine de ce dépôt est la racine du site**. `index.html` est déjà au bon endroit : ce qui est ici va tel quel dans `public_html/`, sans sous-dossier intermédiaire.

C'est exactement pour ça que le site a été sorti dans son propre dépôt : le déploiement Git de Hostinger publie la racine du dépôt et ne sait pas cibler un sous-dossier.

## Option A — Déploiement Git (recommandé)

### 1. Brancher le dépôt

1. **hPanel** → *Avancé* → **Git**.
2. **Repository** : `https://github.com/alexism25120/alexo-website`
3. **Branch** : `main`
4. **Directory** : laisser **vide** — vide signifie `public_html/`, c'est ce qu'on veut.
5. *Créer*.

Si le dépôt est privé, Hostinger affiche une clé SSH publique à ajouter dans GitHub → *Settings* → *Deploy keys* (accès lecture seule suffit). S'il est public, rien à faire.

### 2. Déployer

Une entrée apparaît dans la liste avec un bouton **Deploy** : il récupère la dernière version de `main`. **Ce bouton est manuel — un push sur GitHub ne met rien en ligne tant que tu ne cliques pas.**

### 3. Rendre le déploiement automatique (optionnel)

Pour qu'un push sur `main` publie tout seul :

1. Dans hPanel → *Git*, à côté du dépôt, ouvre **Auto Deployment** et copie l'**URL de webhook** affichée.
2. GitHub → le dépôt → *Settings* → *Webhooks* → **Add webhook**.
3. **Payload URL** : l'URL copiée. **Content type** : `application/json`. **Event** : *Just the push event*. *Add webhook*.

Un push sur `main` déclenche alors le déploiement dans la minute. GitHub montre une coche verte à côté du webhook quand Hostinger a bien répondu.

⚠️ Les libellés exacts de l'interface Hostinger bougent d'une version à l'autre — si tu ne trouves pas « Auto Deployment », cherche « webhook » dans la même page Git.

## Option B — Upload manuel (dépannage)

Utile si le déploiement Git coince, ou pour une correction urgente.

1. **hPanel** → *Fichiers* → **Gestionnaire de fichiers** → dossier `public_html/`.
2. Supprime le `default.php` ou `index.html` de démo s'il est présent.
3. Téléverse **le contenu du dépôt** : `index.html`, `cgv.html`, `mentions-legales.html`, `404.html`, `favicon.svg`, `robots.txt`, `sitemap.xml`, `.htaccess`, et les dossiers `assets/` et `demos/`.
4. Vérifie que `index.html` est **directement** dans `public_html/`, pas dans un sous-dossier.

`docs/`, `brand/` et `README.md` ne sont pas nécessaires en ligne — inutile de les téléverser.

⚠️ `.htaccess` commence par un point : dans le gestionnaire de fichiers, active **« Afficher les fichiers cachés »** (menu *Paramètres*) pour le voir après l'upload.

> Ne mélange pas les deux options sur la durée : si tu modifies un fichier à la main dans `public_html/`, le prochain déploiement Git l'écrasera. Le dépôt reste la référence.

## Après la première mise en ligne

Dans cet ordre — les étapes 2 et 3 dépendent l'une de l'autre.

1. **Nom de domaine** — hPanel → *Domaines*. Soit tu l'achètes chez Hostinger (souvent inclus la 1re année), soit tu pointes un domaine acheté ailleurs vers les DNS Hostinger. Compte jusqu'à 24 h de propagation.
2. **Certificat SSL** — hPanel → *Sécurité* → **SSL** → installer le certificat gratuit. Attends qu'il soit **actif** avant l'étape suivante.
3. **Forcer HTTPS** — seulement une fois le SSL actif : dans `.htaccess`, décommente le bloc de redirection en haut du fichier (retire les `#` des 6 lignes) et remplace `alexo.fr` par ton domaine. **Décommenter avant que le SSL soit actif provoque une boucle de redirection et rend le site inaccessible.**
4. **Formulaire de maquette** — envoie une première demande depuis le site en ligne : FormSubmit envoie un e-mail de confirmation à `alexo.webdesign@gmail.com`. **Tant que tu n'as pas cliqué sur ce lien, aucun lead ne t'arrivera.**
5. **Google** — inscris le site sur [Google Search Console](https://search.google.com/search-console) et soumets `sitemap.xml`.

## À faire avant d'ouvrir le site au public

- [ ] Champs `[À COMPLÉTER]` dans `mentions-legales.html` et `cgv.html` : nom, adresse, SIRET. **Obligatoire** (art. 6 III de la LCEN) dès que le site est accessible publiquement.
- [ ] Remplacer `alexo.fr` par le vrai domaine dans `.htaccess`, `robots.txt`, `sitemap.xml` et les balises `og:` / `canonical` de `index.html`.

Pour repérer ce qui reste :

```bash
grep -rn "À COMPLÉTER" *.html
grep -rln "alexo\.fr" .
```

## Mettre à jour le site plus tard

1. Modifie les fichiers, teste en local.
2. `git commit` puis `git push origin main`.
3. Clique **Deploy** dans hPanel — ou rien à faire si tu as branché le webhook.

Test en local avant chaque mise en ligne, depuis la racine du dépôt :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```
