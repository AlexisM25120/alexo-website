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

1. **Nom de domaine** — `alexowebdesign.com`, réservé chez Hostinger. hPanel → *Sites web* : le domaine doit apparaître en face de l'hébergement. Acheté chez Hostinger, le rattachement est automatique — rien à faire côté DNS.
2. **Certificat SSL** — hPanel → *Sécurité* → **SSL** → installer le certificat gratuit. Attends qu'il soit **actif** avant l'étape suivante.
3. **Forcer HTTPS** — seulement une fois le SSL actif : dans `.htaccess`, décommente le bloc de redirection en haut du fichier (retire les `#` des 6 lignes). Le domaine y est déjà renseigné. **Décommenter avant que le SSL soit actif provoque une boucle de redirection et rend le site inaccessible.**
4. **Formulaire de maquette** — envoie une première demande depuis le site en ligne : FormSubmit envoie un e-mail de confirmation à `alexo.webdesign@gmail.com`. **Tant que tu n'as pas cliqué sur ce lien, aucun lead ne t'arrivera.**

## Pré-lancement : le site est hors de Google

Tant que l'entreprise n'est pas immatriculée, les mentions légales et les CGV sont incomplètes — le site ne doit donc pas être référencé. Chaque page porte une balise `noindex` : le site est **accessible à qui a l'adresse, absent des résultats Google**.

`robots.txt` reste volontairement en `Allow: /`. Un `Disallow: /` bloquerait le crawl, donc la lecture du `noindex`, et l'URL pourrait ressortir malgré tout dans les résultats. Pour être sûr d'être hors index, il faut laisser le robot entrer et lui montrer le `noindex`.

### Lever le pré-lancement (une fois le SIRET reçu)

1. Compléter les champs `[À COMPLÉTER]` dans `mentions-legales.html` et `cgv.html` : nom, adresse, SIRET. **Obligatoire** (art. 6 III de la LCEN) dès que le site est référencé.
2. Retirer la balise `<meta name="robots" content="noindex" />` et son commentaire `PRÉ-LANCEMENT` dans `index.html`, `cgv.html` et `mentions-legales.html`. Ne pas y toucher dans `404.html` ni dans `demos/` : le `noindex` y est permanent et voulu.
3. Ne rien changer dans `robots.txt`.
4. Déployer, puis inscrire le site sur [Google Search Console](https://search.google.com/search-console) et soumettre `sitemap.xml`.

Pour vérifier ce qui reste :

```bash
grep -rn "À COMPLÉTER" *.html
grep -rn "PRÉ-LANCEMENT" *.html
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
