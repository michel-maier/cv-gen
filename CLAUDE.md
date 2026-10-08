# CV et plaquettes — Michel MAIER

Dépôt générateur. Six documents produits depuis six fichiers **JSON Resume**,
rendus par `resumed` avec des thèmes Handlebars locaux, imprimés en PDF par
puppeteer, publiés sur GitHub Pages par une action GitHub.

Ce fichier est en français parce qu'il porte des règles de rédaction française
(typographie, formulations, arbitrages de contenu) et cite des décisions prises
telles quelles. **Le code, les commentaires et les commits sont en anglais** : le
dépôt est public.

---

## Les 10 règles

1. **Le fichier JSON source contient le contenu final.** Pas de script qui
   remplace des chaînes après coup, pas de génération d'un JSON à partir d'un
   autre. Une correction se fait dans le JSON, à la main, une fois.
2. **On reste sur JSON Resume.** Les six sources valident contre le schéma
   (`yarn validate`). Tout ce qui est propre à un document passe par des champs du
   schéma, ou par une clé additionnelle que le schéma tolère — jamais par une
   donnée déformée pour arranger l'affichage. Une URL est une URI complète ; c'est
   au thème de l'afficher raccourcie (helper `host` des thèmes plaquette).
3. **On reste sur `resumed` et `convert-to-pdf.js`.** La chaîne est volontairement
   minimale : un script yarn par document, `cat <source> > resume.json && yarn
   resumed --theme <thème> -o <sortie>`, puis `node convert-to-pdf.js`. Un seul
   convertisseur pour les six documents. Pas de couche d'orchestration maison
   par-dessus.
4. **Le français est la référence.** On écrit d'abord `resume-french.json`, puis on
   traduit fidèlement dans `resume-english.json`. Jamais l'inverse.
5. **Zéro marqueur d'écriture IA.** Pas de tiret quadratin (`—`), pas de « il ne
   s'agit pas seulement de », pas de triades décoratives. Les `–` déjà présents
   dans les intitulés de poste et le nom de l'école sont des séparateurs
   existants, on les garde.
6. **Le HTML inline du JSON est structurel.** `<br/>`, `<b>`, `<a target="_blank">`
   servent la mise en page ; le thème les interprète en triple accolade
   (`{{{summary}}}`). On ne les retire pas, on ne les échappe pas.
7. **Aucun chiffre inventé.** Uniquement du prouvable ou du fourni. En l'absence
   de chiffre, on écrit sans chiffre. Et rien qui ne tienne pas en entretien.
8. **Une expérience n'est jamais coupée sur deux pages.** `page-break-inside:
   avoid` sur `.work-item` est un choix délibéré. C'est cette contrainte qui
   explique les blancs de bas de page, et elle prime sur le remplissage.
9. **Parité FR/EN**, avec une exception voulue : `certificates` (l'agrément CII)
   n'existe qu'en français, un dispositif fiscal français ne parlant pas à un
   lecteur étranger. **Espaces insécables** (U+00A0) avant `:` `;` `!` `?` et entre
   un nombre et son unité, dans les fichiers français.
10. **Ne rien committer sans demande explicite.** Les documents sont déplacés à la
    main.

---

## Commandes

```bash
yarn validate           # les six sources contre le schéma JSON Resume

yarn rfrench            # resume-french.json        -> resume_fr.html
yarn renglish           # resume-english.json       -> resume_en.html
yarn rfrench-short      # resume-french-short.json  -> resume_fr_short.html
yarn rfrench-php        # resume-french-php.json         -> resume_fr_php.html
yarn rfrench-short-php  # resume-french-short-php.json   -> resume_fr_short_php.html
yarn renglish-short     # resume-english-short.json -> resume_en_short.html
yarn pfrench            # resume-plaquette-fr.json  -> plaquette_fr.html
yarn penglish           # resume-plaquette-en.json  -> plaquette_en.html
yarn rbp                # le thème de référence, pour comparer un rendu

yarn 2pdf <in.html> <out.pdf>    # impression PDF, pour les six documents
```

Chaque script écrit sa source dans `resume.json` avant de rendre : **ils ne
peuvent pas tourner en parallèle**.

**La marge d'impression appartient au thème**, dans sa règle `@page` (0,3 in pour
les CV, 0 pour les plaquettes afin que leurs bandes aillent bord à bord). Cette
règle CSS l'emporte sur tout ce qu'on passerait à `page.pdf` : vérifié au pixel,
d'où un unique convertisseur sans option de marge.

**Piège vérifié :** `node_modules/theme-*` sont des **copies**, pas des liens
symboliques. Toute modification d'un thème exige `yarn install` avant de
regénérer, sinon le rendu utilise l'ancien thème et le changement paraît sans
effet.

**Le nombre de pages est à vérifier à la main** après toute modification de
contenu ou de style : `pdfinfo <fichier>.pdf | grep Pages`. Cibles ci-dessous.

---

## Les six documents

| source                      | thème                | sortie                 | pages |
| --------------------------- | -------------------- | ---------------------- | ----- |
| `resume-french.json`        | `theme-french`       | `resume_fr.html`       | 7     |
| `resume-english.json`       | `theme-english`      | `resume_en.html`       | 7     |
| `resume-french-short.json`  | `theme-french`       | `resume_fr_short.html` | 2     |
| `resume-english-short.json` | `theme-english`      | `resume_en_short.html` | 2     |
| `resume-plaquette-fr.json`  | `theme-plaquette-fr` | `plaquette_fr.html`    | 2     |
| `resume-plaquette-en.json`  | `theme-plaquette-en` | `plaquette_en.html`    | 2     |

Les six sources sont **indépendantes et maintenues à la main**. Un CV court n'est
pas dérivé du CV long : une correction de fond doit être portée dans les fichiers
concernés, un par un.

Les CV courts activent `meta.compact` (le thème réduit la taille du corps) et
laissent les entrées anciennes sans `summary`, ce qui déclenche leur rendu en une
seule ligne (`.work-item--slim`) : date, poste, société, ville, les sociétés
alignées sur un axe vertical unique.

**Variantes PHP.** `resume-french-php.json` (7 pages) et
`resume-french-short-php.json` (2 pages) sont les CV français réorientés PHP /
Symfony pour les candidatures où le dernier poste en TypeScript ferait croire à un
abandon de PHP : titre, profil et ordre des compétences mènent par PHP, même
contenu factuel sinon. Indépendantes elles aussi, validées, non publiées par
l'action, sans équivalent anglais pour l'instant.

Les plaquettes rangent leur contenu sous une clé `plaquette` à la racine. Le
schéma JSON Resume autorise les champs additionnels, les fichiers valident.

---

## Publication

L'action `.github/workflows/deploy-cv.yml` valide, rend les six documents, les
imprime en PDF, exporte les quatre CV en Word (pandoc), assemble `public/fr` et
`public/en` puis pousse sur `gh-pages`.

**Les adresses historiques sont inchangées** (`fr/resume_fr.html`,
`fr/resume_michelmaier_fr.pdf`, `.docx`) : les liens déjà diffusés continuent de
fonctionner. Les quatre nouveaux documents s'ajoutent dans les mêmes répertoires.

Pas d'export Word des plaquettes : une mise en page pleine page n'y survit pas.

**Annuaire privé.** `annuaire/index.html` liste les six documents dans leurs trois
formats et se déploie en `public/perso-8b41d6/`. Aucune page n'y renvoie et il
porte `<meta name="robots" content="noindex, nofollow, noarchive">`, donc il reste
introuvable par recherche. Ce n'est pas pour autant un secret : **le dépôt est
public**, donc le chemin est lisible dans le workflow par quiconque ouvre le repo.
Pas de `robots.txt` : y déclarer le chemin reviendrait à l'annoncer. Le renommer se
fait en un seul endroit, l'étape de publication.

C'est le seul fichier `.html` versionné, d'où la négation `!annuaire/index.html`
dans `.gitignore`.

`resume.json`, les `*.html`, `*.pdf`, `*.docx` et `public/` sont des artefacts
générés, ignorés par git. Ne pas les éditer à la main.

---

## Contenu : ce qui est arbitré

**Positionnement.** Développeur senior fullstack, backend / cloud / IA. Ni
« développeur PHP », ni « expert AWS » : ce qui se vend est la reprise de systèmes
en production, sécurisation par les tests, découpage ou passage à l'échelle sans
interrompre l'activité, plus l'intégration de l'IA dans les outils de production.

**Atténuation chronologique.** Le nombre de puces décroît vers le passé. Les
expériences les plus anciennes n'ont aucun détail : le poste seul suffit à dire ce
qui a été fait.

**L'entrée GoTombola 2026 ne perd aucun fait.** C'est elle qui vend le CV, c'est
la plus récente, et c'est la seule qui porte la couche IA. Elle n'est pas une
variable d'ajustement quand il faut gagner de la place.

**Ne figurent pas au CV, sur décision explicite :**

- la participation au capital de GoTombola ;
- la levée de fonds (non publique) ;
- le chiffre d'économies réalisé chez leboncoin (confidentiel) ;
- le fait qu'Olivier Hoareau ait introduit Michel chez Sanofi.

**Assumé au contraire :** le fil Olivier Hoareau (CTO d'ItiQiti 2015-2018, CTO de
GoTombola aujourd'hui) est nommé et expliqué. Caché, c'est une mauvaise surprise
en prise de référence ; nommé avec sa raison — un CTO qui reprend le même
développeur depuis dix ans parce qu'il sait qu'il peut compter sur lui — c'est
l'argument le moins imitable du CV.

**Sur l'âge et l'ancienneté :** 19 ans d'expérience est un argument, pas une gêne.
Ce qui dessert n'est pas l'âge mais un profil qui *paraît* daté. D'où l'ouverture
sur 2026, les agents de code, les modèles exécutés en local — ce dernier point
étant aussi l'antidote nécessaire pour les comptes qui interdisent l'envoi de code
vers un LLM tiers (pharma, banque, assurance, défense).

---

## Mise en page

Trois faits qui ont coûté du temps, à ne pas réapprendre :

- **La hauteur utile d'une page est d'environ 1045 px**, pas 1123 : A4 à 96 dpi
  moins les marges `@page` de 0,3 in et le rembourrage du corps. Mesurer une
  pagination avec 1123 donne un résultat faux.
- **Mesurer en média `print`** (`emulateMediaType('print')`, largeur 736 px), pas
  en média écran : les règles `@media print` changent les tailles de police.
  Mesurer les hauteurs **avec les marges**.
- **`margin-left: auto` en flexbox absorbe l'espace libre avant `flex-grow`.** Une
  colonne qui refuse de s'étendre à côté d'un `auto` vient de là.

---

## Dépendances

`yarn install` affiche un avertissement `YN0060` : `resumed` déclare un peer
**optionnel** sur puppeteer `^24` et le projet est en 25. C'est attendu — on
pilote l'export PDF nous-mêmes, avec `convert-to-pdf.js`, et on n'utilise jamais
celui de `resumed`.

`handlebars` est une dépendance directe : les quatre thèmes le chargent
explicitement.
