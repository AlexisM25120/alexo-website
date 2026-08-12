/* ==========================================================================
   Fond animé « chemins flottants »

   Portage natif du composant React « Background Paths ». Le composant
   d'origine repose sur React, framer-motion, Tailwind et TypeScript ; ce site
   n'utilise aucun des quatre. La géométrie des tracés est reprise à
   l'identique, l'animation passe de framer-motion à `stroke-dashoffset` en
   CSS, et les couleurs viennent de la palette du site.

   Le SVG est construit ici plutôt qu'écrit dans chaque page : 72 tracés
   représentent une quinzaine de kilo-octets qui seraient rechargés à chaque
   visite, alors que ce fichier est mis en cache un an.
   ========================================================================== */
(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Formule du composant d'origine, reprise telle quelle : chaque tracé est
  // décalé du précédent, et `position` inverse le sens du faisceau.
  const pathData = (i, position) =>
    `M-${380 - i * 5 * position} -${189 + i * 6}C-${380 - i * 5 * position} -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${152 - i * 5 * position} ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${684 - i * 5 * position} ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`;

  const NS = 'http://www.w3.org/2000/svg';

  const buildBeam = (position) => {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('viewBox', '0 0 696 316');
    svg.setAttribute('fill', 'none');
    // `slice` fait couvrir toute la fenêtre ; `meet` laisserait des bandes
    // vides en haut et en bas sur un écran large.
    svg.setAttribute('preserveAspectRatio', 'xMidYMid slice');
    svg.setAttribute('aria-hidden', 'true');

    for (let i = 0; i < 36; i++) {
      const path = document.createElementNS(NS, 'path');
      path.setAttribute('d', pathData(i, position));
      path.setAttribute('stroke', 'currentColor');
      path.setAttribute('stroke-width', (0.5 + i * 0.03).toFixed(2));
      path.setAttribute('stroke-opacity', (0.1 + i * 0.03).toFixed(2));
      // pathLength normalise la longueur du tracé à 1, quelle que soit sa
      // taille réelle : les pointillés et le décalage deviennent des
      // fractions, donc une seule règle CSS anime les 72 tracés.
      path.setAttribute('pathLength', '1');
      if (!reduced) {
        path.style.setProperty('--dur', `${(20 + Math.random() * 10).toFixed(1)}s`);
        path.style.setProperty('--delay', `${(-Math.random() * 20).toFixed(1)}s`);
      }
      svg.appendChild(path);
    }
    return svg;
  };

  const layer = document.createElement('div');
  layer.className = 'bg-paths' + (reduced ? ' bg-paths-static' : '');
  layer.setAttribute('aria-hidden', 'true');
  layer.appendChild(buildBeam(1));
  layer.appendChild(buildBeam(-1));

  const mount = () => document.body.prepend(layer);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount, { once: true });
  } else {
    mount();
  }
})();
