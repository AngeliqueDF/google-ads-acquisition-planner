# Google Ads Calculator

[English](#english) | [Français](#français)

## English

A Google Ads acquisition calculator in development. This portfolio project demonstrates the design and delivery of an interactive web experience.

### Project status

The public page is currently a work in progress. The calculator is not available yet.

The planned first version will help Google Ads specialists build an acquisition scenario with a prospect, starting from a business goal. Planned scenarios include quote inquiries, the steps after a click and after a conversion, and the assumptions connecting budget to expected outcomes. Company history may complement market benchmarks when those capabilities are developed.

### Engineering approach

The project records decisions about scope, user flow, and technical choices as the work evolves. Planned features are labeled as planned and do not describe current page behavior.

### Stack

- **Framework:** [Astro](https://astro.build/) static site generation
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styles:** CSS
- **Code quality:** Astro Check, ESLint, and Prettier

### Why TypeScript everywhere

TypeScript is used across the entire codebase—from calculations to Astro page components and tooling scripts—for specific engineering reasons:

- **Mathematical and financial precision:** Google Ads acquisition models depend on interdependent calculations (CPA, CPC, CVR, margins, and budget limits). Strict typing guarantees explicit numeric contracts and prevents silent `NaN` or `undefined` runtime errors in financial estimations.
- **Contract-first architecture:** Domain models are defined as pure TypeScript interfaces (`ScenarioInputs`, `ScenarioOutputs`). These serve as living contracts shared between the business logic engine, UI components, and host integrations.
- **Compile-time Astro validation:** Astro Check (`astro check`) validates `.astro` component props, markup expressions, and imports at build time, eliminating template runtime errors before deployment.
- **Self-documenting domain model:** Types explicitly describe units and constraints (e.g. percentages, currency values, client counts), making the codebase accessible and maintainable.

### Git workflow

- Feature and maintenance branches are proposed to `development` by pull request; `development` is the staging branch.
- Production changes go from `development` to `main` by pull request.
- Urgent fixes use a `hotfix/*` branch and separate pull requests to both `main` and `development`.
- Local hooks block direct pushes to `development` and `main`. GitHub branch protection also enforces pull requests and passing CI checks.
- Commit messages must follow Conventional Commits. The first line is limited to 70 characters; a local `commit-msg` hook checks both rules.
- Keep commits atomic: each commit should contain one coherent, reviewable change without unrelated work.

### Quality gates and Git hooks

The repository enforces a "shift-left" quality approach through local Git hooks and GitHub Actions CI. Hooks are located in `.githooks/` and are automatically configured during `npm install` via `scripts/setup-git-hooks.mjs`:

1. **`pre-commit`:** Automatically formats code with Prettier (`npm run format`), updates the Git index, runs type checks with Astro Check (warnings fail), and runs ESLint (0 warnings allowed).
2. **`commit-msg`:** Validates that the commit message adheres to Conventional Commits and stays within the 70-character first-line limit.
3. **`pre-push`:** Blocks direct pushes to protected branches (`development` and `main`), enforcing the Pull Request workflow.

GitHub Actions runs the quality checks and an Astro production build for every pull request to `development` or `main`.

### NPM scripts

| Command                | Action                                                                   | Purpose                                                               |
| :--------------------- | :----------------------------------------------------------------------- | :-------------------------------------------------------------------- |
| `npm run dev`          | `astro dev`                                                              | Starts local development server with hot module replacement.          |
| `npm run build`        | `astro build`                                                            | Compiles static site to `dist/` with sub-second performance.          |
| `npm run preview`      | `astro preview`                                                          | Locally serves the production `dist/` build for verification.         |
| `npm run typecheck`    | `astro check --minimumSeverity warning --minimumFailingSeverity warning` | Runs Astro and TypeScript type checks; fails on any error or warning. |
| `npm run lint`         | `eslint . --max-warnings=0`                                              | Lints code; fails on any warning.                                     |
| `npm run lint:fix`     | `eslint . --fix`                                                         | Automatically fixes auto-correctable ESLint issues.                   |
| `npm run format`       | `prettier --write .`                                                     | Formats all files according to project formatting standards.          |
| `npm run format:check` | `prettier --check .`                                                     | Checks formatting without modifying files.                            |
| `npm run check`        | `npm run typecheck && npm run lint && npm run format:check`              | Runs all code quality gates (types, linting, formatting).             |
| `npm run validate`     | `npm run check && npm run build`                                         | Full pre-PR verification (all quality checks + production build).     |
| `npm run prepare`      | `node scripts/setup-git-hooks.mjs`                                       | Configures Git to use `.githooks` directory.                          |

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

Un calculateur d’acquisition Google Ads en cours de développement. Ce projet de portfolio montre la conception et la réalisation d’une expérience web interactive.

### État du projet

La page publique est actuellement une page en cours de réalisation. Le calculateur n’est pas encore disponible.

La première version prévue aidera les spécialistes Google Ads à construire un scénario d’acquisition avec un prospect, à partir d’un objectif commercial. Les scénarios prévus incluent les demandes de devis, les étapes après le clic et après la conversion, ainsi que les hypothèses reliant le budget aux résultats attendus. Les données historiques de l’entreprise pourront compléter les benchmarks lorsque ces fonctionnalités seront développées.

### Approche technique

Le projet consigne au fil de son évolution les décisions concernant le périmètre, le parcours utilisateur et les choix techniques. Les fonctionnalités prévues sont identifiées comme telles et ne décrivent pas le comportement actuel de la page.

### Stack

- **Framework :** génération de site statique avec [Astro](https://astro.build/)
- **Langage :** [TypeScript](https://www.typescriptlang.org/)
- **Styles :** CSS
- **Qualité du code :** Astro Check, ESLint et Prettier

### Pourquoi TypeScript partout

TypeScript est utilisé sur l’ensemble du projet — des fonctions de calcul aux composants Astro et scripts d’outillage — pour des raisons d’ingénierie précises :

- **Précision mathématique et financière :** Les modèles d'acquisition Google Ads reposent sur des calculs interdépendants (CPA, CPC, taux de conversion, marges et budget maximal). Le typage strict garantit des contrats numériques explicites et empêche les erreurs d'exécution silencieuses comme `NaN` ou `undefined` dans les estimations financières.
- **Architecture orientée contrats :** Les modèles de domaine sont définis sous forme d'interfaces TypeScript pures (`ScenarioInputs`, `ScenarioOutputs`). Ils servent de contrats partagés entre le moteur de calcul, les composants d'interface et les intégrations hôtes.
- **Validation Astro à la compilation :** Astro Check (`astro check`) valide les props des composants `.astro`, les expressions du template et les imports dès la compilation, éliminant les erreurs à l'exécution avant la mise en production.
- **Modèle métier auto-documenté :** Les types explicitent les unités et les contraintes (pourcentages, devises, volumes de clients), facilitant la maintenance et la lisibilité du code.

### Workflow Git

- Les branches de fonctionnalité et de maintenance sont proposées à `development` par pull request ; `development` est la branche de staging.
- Les changements destinés à la production passent de `development` à `main` par pull request.
- Les correctifs urgents utilisent une branche `hotfix/*` et deux pull requests distinctes vers `main` et `development`.
- Les hooks locaux bloquent les pushes directs vers `development` et `main`. La protection des branches GitHub impose également les pull requests et la validation des contrôles CI.
- Les messages de commit suivent Conventional Commits. La première ligne est limitée à 70 caractères ; un hook `commit-msg` vérifie ces deux règles.
- Les commits restent atomiques : chacun contient un changement cohérent et révisable, sans travail sans rapport.

### Portes de qualité et hooks Git

Le dépôt applique une démarche qualité « shift-left » via des hooks Git locaux et l'intégration continue GitHub Actions. Les hooks se trouvent dans `.githooks/` et sont automatiquement configurés lors du `npm install` via `scripts/setup-git-hooks.mjs` :

1. **`pre-commit` :** Formate automatiquement le code avec Prettier (`npm run format`), met à jour l'index Git, vérifie les types avec Astro Check (les avertissements échouent) et exécute ESLint (0 avertissement autorisé).
2. **`commit-msg` :** Vérifie que le message de commit respecte Conventional Commits et ne dépasse pas 70 caractères sur la première ligne.
3. **`pre-push` :** Bloque les pushes directs vers les branches protégées (`development` et `main`), imposant le passage par Pull Request.

GitHub Actions exécute les contrôles de qualité ainsi qu’un build Astro de production pour chaque pull request vers `development` ou `main`.

### Scripts NPM

| Commande               | Action                                                                   | Rôle                                                                      |
| :--------------------- | :----------------------------------------------------------------------- | :------------------------------------------------------------------------ |
| `npm run dev`          | `astro dev`                                                              | Lance le serveur local avec rechargement à chaud.                         |
| `npm run build`        | `astro build`                                                            | Compile le site statique dans `dist/` en moins d'une seconde.             |
| `npm run preview`      | `astro preview`                                                          | Sert localement le build de production pour vérification.                 |
| `npm run typecheck`    | `astro check --minimumSeverity warning --minimumFailingSeverity warning` | Vérifie les types Astro et TypeScript ; échoue à la moindre alerte.       |
| `npm run lint`         | `eslint . --max-warnings=0`                                              | Analyse le code avec ESLint ; 0 avertissement autorisé.                   |
| `npm run lint:fix`     | `eslint . --fix`                                                         | Corrige automatiquement les règles ESLint compatibles.                    |
| `npm run format`       | `prettier --write .`                                                     | Formate l'ensemble des fichiers selon les standards du projet.            |
| `npm run format:check` | `prettier --check .`                                                     | Vérifie le formatage sans modifier les fichiers.                          |
| `npm run check`        | `npm run typecheck && npm run lint && npm run format:check`              | Exécute l'ensemble des contrôles de qualité (types, linting, formatage).  |
| `npm run validate`     | `npm run check && npm run build`                                         | Vérification complète avant PR (contrôles qualité + build de production). |
| `npm run prepare`      | `node scripts/setup-git-hooks.mjs`                                       | Configure Git pour utiliser le dossier `.githooks`.                       |

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
