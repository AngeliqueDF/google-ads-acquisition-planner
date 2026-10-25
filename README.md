# Google Ads Acquisition Planner

[English](#english) | [Français](#français)

## English

A Google Ads acquisition scenario planner in development. This portfolio project demonstrates the design and delivery of an interactive web experience.

### Project status

The public page is currently a work in progress. The planner is not available yet.

The project is currently in the **UX/UI design and copywriting refinement phase**. The four-step acquisition journey, plain-language copywriting, and mental models connecting business viability to ad budget are being refined in Astro before implementing the interactive React calculator island.

The project overview and product framing are published at [Google Ads Acquisition Planner on angeliquedf.dev](https://angeliquedf.dev/projects/google-ads-acquisition-planner/).

The planned first version will help Google Ads specialists build an acquisition scenario with a prospect, starting from a business goal. Planned scenarios include quote inquiries, the steps after a click and after a conversion, and the assumptions connecting budget to expected outcomes. Company history may complement market benchmarks when those capabilities are developed.

### Product and UX design

The interface is designed for live consultations between a Google Ads specialist and a business owner:

- **Inverted acquisition flow:** Rather than asking for advertising spend first, the planner starts from business reality (customer value, gross margin, minimum profitability to preserve) and works backward to the required traffic and allowable ad budget.
- **Progressive copywriting:** Questions use plain business vocabulary (_nouveaux clients, marge, personnes intéressées_). Each section produces a contextual synthesis sentence explaining what the figures mean, while technical PPC metrics (`CPA`, `CPC`, `CVR`) are secondary summary badges for specialist review.
- **Ergonomics and accessibility:** Form controls prioritize clear labels, accessible helpers, and sensible keyboard navigation before adding rich interactive controls.

### Engineering approach

The project records decisions about scope, user flow, and technical choices as the work evolves. Planned features are labeled as planned and do not describe current page behavior.

### Stack

- **Framework:** [Astro](https://astro.build/) static site generation
- **UI:** [React](https://react.dev/) interactive island
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styles:** CSS
- **Code quality:** Astro Check, ESLint, and Prettier

### Project structure

```text
src/
├── components/          # UI components (Astro and React)
│   └── calculator/      # Interactive React island components (.tsx)
├── layouts/             # Astro layouts (.astro)
├── lib/                 # Pure TypeScript business logic and formatting utilities
├── pages/               # Astro routes and page entry points (.astro)
└── styles/              # Global CSS and custom properties (tokens.css)
```

### Adding code and components

- **Pure logic and math (`src/lib/`):** Put calculation logic, domain contracts, and formatting helpers here as pure TypeScript functions with zero UI dependencies. Write unit tests co-located alongside the file (e.g. `calculator.ts` and `calculator.test.ts`).
- **Interactive React islands (`src/components/calculator/`):** When client-side state or user interaction is required, build the component in React (`.tsx`). To load it on an Astro page, import it and add a client directive (e.g. `<ScenarioForm client:load />`).
- **Static components (`src/components/`):** Use `.astro` components for presentation elements that require no JavaScript in the browser.

### Git workflow

- Feature and maintenance branches are proposed to `development` by pull request; `development` is the staging branch.
- Production changes go from `development` to `main` by pull request.
- Urgent fixes use a `hotfix/*` branch and separate pull requests to both `main` and `development`.
- Local hooks block direct pushes to `development` and `main`. GitHub branch protection also enforces pull requests and passing CI checks.
- Commit messages must follow Conventional Commits. The first line is limited to 70 characters; a local `commit-msg` hook checks both rules.
- Keep commits atomic: each commit should contain one coherent, reviewable change without unrelated work.

### Quality gates and Git hooks

Quality gates are enforced locally before committing and in CI on pull requests. Hooks are located in `.githooks/` and are automatically configured during `npm install` via `scripts/setup-git-hooks.mjs`:

1. **`pre-commit`:** Automatically formats code with Prettier (`npm run format`), updates the Git index, runs unit tests with Vitest (`npm test`), runs type checks with Astro Check (warnings fail), and runs ESLint (0 warnings allowed).
2. **`commit-msg`:** Validates that the commit message adheres to Conventional Commits and stays within the 70-character first-line limit.
3. **`pre-push`:** Blocks direct pushes to protected branches (`development` and `main`), enforcing the Pull Request workflow.

GitHub Actions runs the quality checks and an Astro production build for every pull request to `development` or `main`.

### NPM scripts

| Command                | Action                                                                      | Purpose                                                               |
| :--------------------- | :-------------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| `npm run dev`          | `astro dev`                                                                 | Starts local development server with hot module replacement.          |
| `npm run build`        | `astro build`                                                               | Compiles static site to `dist/` with sub-second performance.          |
| `npm run preview`      | `astro preview`                                                             | Locally serves the production `dist/` build for verification.         |
| `npm test`             | `vitest run`                                                                | Runs unit test suite with Vitest; fails on any failed test.           |
| `npm run test:watch`   | `vitest`                                                                    | Starts Vitest in interactive watch mode for TDD workflows.            |
| `npm run typecheck`    | `astro check --minimumSeverity warning --minimumFailingSeverity warning`    | Runs Astro and TypeScript type checks; fails on any error or warning. |
| `npm run lint`         | `eslint . --max-warnings=0`                                                 | Lints code; fails on any warning.                                     |
| `npm run lint:fix`     | `eslint . --fix`                                                            | Automatically fixes auto-correctable ESLint issues.                   |
| `npm run format`       | `prettier --write .`                                                        | Formats all files according to project formatting standards.          |
| `npm run format:check` | `prettier --check .`                                                        | Checks formatting without modifying files.                            |
| `npm run check`        | `npm run test && npm run typecheck && npm run lint && npm run format:check` | Runs all code quality gates (tests, types, linting, formatting).      |
| `npm run validate`     | `npm run check && npm run build`                                            | Full pre-PR verification (all quality checks + production build).     |
| `npm run prepare`      | `node scripts/setup-git-hooks.mjs`                                          | Configures Git to use `.githooks` directory.                          |

### Helper scripts (`scripts/`)

- `scripts/setup-git-hooks.mjs`: Configures Git to use the `.githooks` directory for hooks (`git config core.hooksPath .githooks`). Triggered automatically on `npm install`.
- `scripts/validate-commit-message.mjs`: Validates Conventional Commits syntax and enforces the 70-character limit on the subject line. Executed automatically by `.githooks/commit-msg`.

### Local development

```bash
npm install
npm run dev
```

Build and preview the static site locally:

```bash
npm run build
npm run preview
```

The build outputs the site to `dist/`, ready for a static host. A hosting provider and automatic deployment are not configured yet.

## Français

Un planificateur de scénarios d’acquisition Google Ads en cours de développement. Ce projet de portfolio montre la conception et la réalisation d’une expérience web interactive.

### État du projet

La page publique est actuellement une page en cours de réalisation. Le planificateur n’est pas encore disponible.

Le projet est actuellement dans sa **phase de conception UX/UI et d’ajustement de la rédaction**. Le parcours d’acquisition en quatre étapes, les choix de vocabulaire accessible et les modèles économiques reliant viabilité commerciale et budget publicitaire sont testés et affinés dans Astro avant le développement de l’îlot interactif React.

La présentation générale et le cadrage du projet sont disponibles sur [Google Ads Acquisition Planner sur angeliquedf.dev](https://angeliquedf.dev/projects/google-ads-acquisition-planner/).

La première version prévue aidera les spécialistes Google Ads à construire un scénario d’acquisition avec un prospect, à partir d’un objectif commercial. Les scénarios prévus incluent les demandes de devis, les étapes après le clic et après la conversion, ainsi que les hypothèses reliant le budget aux résultats attendus. Les données historiques de l’entreprise pourront compléter les benchmarks lorsque ces fonctionnalités seront développées.

### Conception produit et UX

L’interface est pensée pour des échanges en direct entre un spécialiste Google Ads et un dirigeant d’entreprise :

- **Entonnoir d’acquisition inversé :** Plutôt que de demander un budget publicitaire en amont, l’outil part de la réalité économique de l’entreprise (valeur client, marge brute, rentabilité minimale à préserver) et remonte jusqu’au trafic et au budget publicitaire acceptable.
- **Rédaction progressive :** Les questions privilégient un vocabulaire métier simple (_nouveaux clients, marge, personnes intéressées_). Chaque étape produit une phrase de synthèse contextualisée, tandis que le jargon technique PPC (`CPA`, `CPC`, `CVR`) est réservé à des badges secondaires pour la lecture experte.
- **Ergonomie et accessibilité :** Les champs de formulaire mettent l’accent sur des labels clairs, des aides à la saisie accessibles et une navigation clavier fluide avant l’intégration de composants interactifs riches.

### Approche technique

Le projet consigne au fil de son évolution les décisions concernant le périmètre, le parcours utilisateur et les choix techniques. Les fonctionnalités prévues sont identifiées comme telles et ne décrivent pas le comportement actuel de la page.

### Stack

- **Framework :** génération de site statique avec [Astro](https://astro.build/)
- **Interface :** îlot interactif avec [React](https://react.dev/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Styles :** CSS
- **Qualité du code :** Astro Check, ESLint et Prettier

### Structure du projet

```text
src/
├── components/          # Composants d'interface (Astro et React)
│   └── calculator/      # Composants d'îlot React interactifs (.tsx)
├── layouts/             # Mises en page Astro (.astro)
├── lib/                 # Logique métier pure en TypeScript et utilitaires de formatage
├── pages/               # Routes et points d'entrée Astro (.astro)
└── styles/              # CSS global et variables de style (tokens.css)
```

### Ajouter du code et des composants

- **Logique pure et calculs (`src/lib/`) :** Placez ici les fonctions de calcul, contrats métier et fonctions de formatage en TypeScript pur, sans dépendance d'interface. Les tests unitaires sont co-localisés à côté du fichier (par ex. `calculator.ts` et `calculator.test.ts`).
- **Îlots React interactifs (`src/components/calculator/`) :** Lorsqu'un état côté client ou une interaction utilisateur est requise, créez le composant en React (`.tsx`). Pour l'afficher sur une page Astro, importez-le et ajoutez une directive client (par ex. `<ScenarioForm client:load />`).
- **Composants statiques (`src/components/`) :** Utilisez des composants `.astro` pour les éléments visuels ne nécessitant aucun JavaScript dans le navigateur.

### Workflow Git

- Les branches de fonctionnalité et de maintenance sont proposées à `development` par pull request ; `development` est la branche de staging.
- Les changements destinés à la production passent de `development` à `main` par pull request.
- Les correctifs urgents utilisent une branche `hotfix/*` et deux pull requests distinctes vers `main` et `development`.
- Les hooks locaux bloquent les pushes directs vers `development` et `main`. La protection des branches GitHub impose également les pull requests et la validation des contrôles CI.
- Les messages de commit suivent Conventional Commits. La première ligne est limitée à 70 caractères ; un hook `commit-msg` vérifie ces deux règles.
- Les commits restent atomiques : chacun contient un changement cohérent et révisable, sans travail sans rapport.

### Portes de qualité et hooks Git

Les contrôles de qualité sont appliqués localement avant chaque commit et dans la CI lors des pull requests. Les hooks se trouvent dans `.githooks/` et sont automatiquement configurés lors du `npm install` via `scripts/setup-git-hooks.mjs` :

1. **`pre-commit` :** Formate automatiquement le code avec Prettier (`npm run format`), met à jour l'index Git, exécute les tests unitaires avec Vitest (`npm test`), vérifie les types avec Astro Check (les avertissements échouent) et exécute ESLint (0 avertissement autorisé).
2. **`commit-msg` :** Vérifie que le message de commit respecte Conventional Commits et ne dépasse pas 70 caractères sur la première ligne.
3. **`pre-push` :** Bloque les pushes directs vers les branches protégées (`development` et `main`), imposant le passage par Pull Request.

GitHub Actions exécute les contrôles de qualité ainsi qu’un build Astro de production pour chaque pull request vers `development` ou `main`.

### Scripts NPM

| Commande               | Action                                                                      | Rôle                                                                            |
| :--------------------- | :-------------------------------------------------------------------------- | :------------------------------------------------------------------------------ |
| `npm run dev`          | `astro dev`                                                                 | Lance le serveur local avec rechargement à chaud.                               |
| `npm run build`        | `astro build`                                                               | Compile le site statique dans `dist/` en moins d'une seconde.                   |
| `npm run preview`      | `astro preview`                                                             | Sert localement le build de production pour vérification.                       |
| `npm test`             | `vitest run`                                                                | Exécute la suite de tests unitaires avec Vitest.                                |
| `npm run test:watch`   | `vitest`                                                                    | Lance les tests unitaires en mode interactif (watch).                           |
| `npm run typecheck`    | `astro check --minimumSeverity warning --minimumFailingSeverity warning`    | Vérifie les types Astro et TypeScript ; échoue à la moindre alerte.             |
| `npm run lint`         | `eslint . --max-warnings=0`                                                 | Analyse le code avec ESLint ; 0 avertissement autorisé.                         |
| `npm run lint:fix`     | `eslint . --fix`                                                            | Corrige automatiquement les règles ESLint compatibles.                          |
| `npm run format`       | `prettier --write .`                                                        | Formate l'ensemble des fichiers selon les standards du projet.                  |
| `npm run format:check` | `prettier --check .`                                                        | Vérifie le formatage sans modifier les fichiers.                                |
| `npm run check`        | `npm run test && npm run typecheck && npm run lint && npm run format:check` | Exécute l'ensemble des contrôles de qualité (tests, types, linting, formatage). |
| `npm run validate`     | `npm run check && npm run build`                                            | Vérification complète avant PR (contrôles qualité + build de production).       |
| `npm run prepare`      | `node scripts/setup-git-hooks.mjs`                                          | Configure Git pour utiliser le dossier `.githooks`.                             |

### Scripts utilitaires (`scripts/`)

- `scripts/setup-git-hooks.mjs` : Configure Git pour utiliser le dossier `.githooks` (`git config core.hooksPath .githooks`). Exécuté automatiquement lors du `npm install`.
- `scripts/validate-commit-message.mjs` : Valide la syntaxe Conventional Commits et applique la limite de 70 caractères sur la première ligne. Exécuté automatiquement par `.githooks/commit-msg`.

### Développement local

```bash
npm install
npm run dev
```

Pour construire et prévisualiser le site statique en local :

```bash
npm run build
npm run preview
```

Le build génère le site dans `dist/`, prêt à être publié sur un hébergeur statique. Le fournisseur d’hébergement et le déploiement automatique ne sont pas encore configurés.
