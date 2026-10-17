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
- **Styles:** CSS and [Open Props](https://open-props.style/)
- **Code quality:** Astro Check, ESLint, and Prettier

### Git workflow

- Feature and maintenance branches are proposed to `development` by pull request; `development` is the staging branch.
- Production changes go from `development` to `main` by pull request.
- Urgent fixes use a `hotfix/*` branch and separate pull requests to both `main` and `development`.
- Local hooks block pushes to `development` and `main`. GitHub branch protection should also require pull requests and passing CI checks.
- Commit messages must follow Conventional Commits. The first line is limited to 70 characters; a local `commit-msg` hook checks both rules.
- Keep commits atomic: each commit should contain one coherent, reviewable change without unrelated work.

### Checks

Local hooks block pushes to the protected branches, validate Conventional Commit messages (first line limited to 70 characters), and check types (warnings fail), ESLint with zero warnings allowed, and formatting before each commit. GitHub Actions runs the quality checks and an Astro production build for every pull request to `development` or `main`.

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

Calculator logic must have unit tests when implemented. No calculation test script is configured yet.

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
- **Styles :** CSS et [Open Props](https://open-props.style/)
- **Qualité du code :** Astro Check, ESLint et Prettier

### Workflow Git

- Les branches de fonctionnalité et de maintenance sont proposées à `development` par pull request ; `development` est la branche de staging.
- Les changements destinés à la production passent de `development` à `main` par pull request.
- Les correctifs urgents utilisent une branche `hotfix/*` et deux pull requests distinctes vers `main` et `development`.
- Les hooks locaux bloquent les pushes vers `development` et `main`. La protection des branches GitHub doit également imposer les pull requests et la réussite des vérifications CI.
- Les messages de commit suivent Conventional Commits. La première ligne est limitée à 70 caractères ; un hook `commit-msg` vérifie ces deux règles.
- Les commits restent atomiques : chacun contient un changement cohérent et révisable, sans travail sans rapport.

### Vérifications

Les hooks locaux bloquent les pushes vers les branches protégées, valident les messages Conventional Commits (première ligne limitée à 70 caractères) et vérifient avant chaque commit les types (les avertissements font échouer la vérification), ESLint sans avertissement autorisé et le formatage. GitHub Actions exécute les contrôles de qualité ainsi qu’un build Astro de production pour chaque pull request vers `development` ou `main`.

```bash
npm run typecheck
npm run lint
npm run format:check
npm run build
```

La logique de calcul devra être couverte par des tests unitaires lorsqu’elle sera implémentée. Aucun script de test des calculs n’est encore configuré.

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
