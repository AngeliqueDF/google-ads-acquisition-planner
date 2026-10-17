# Project instructions

Project documentation and development notes should be written in English by default. The README may be bilingual, with the English version first and the French version last.

## Project context

- This repository is for the interactive React calculator island. The portfolio is a separate Astro project and will host the calculator on its own page.
- Keep the product specialist-led: Google Ads specialists are the primary audience. The initial use case is lead generation, including quote inquiries and what happens after the click and after conversion.
- Treat broader acquisition-planning ideas as potential future work, not assumed scope. Keep the mini diagnostic deferred.
- Work through one small, sequential issue at a time. Do not create an umbrella issue or sub-issues unless the work later needs independent tracking.
- Write tests first for calculation logic, keep calculations in pure TypeScript, and cover every calculation with unit tests.
- Keep private product reasoning and raw feedback out of public project documentation; record only durable direction and implementation constraints here.

## Design and CSS

- Prefer existing Open Props variables before introducing arbitrary values.
- This applies to typography, spacing, dimensions, colors, borders, shadows, radii, and animations.
- Add an arbitrary value only when no Open Props variable meets the design need.
- When an arbitrary value is necessary, keep it consistent with the existing Open Props scale and briefly document the reason when it is not obvious.

## Git and branches

- All commit messages must follow Conventional Commits and pass the `commit-msg` hook.
- The first line of a commit message must not exceed 70 characters.
- Keep commits atomic: include only coherent changes that belong to one reviewable change.
- Do all new development on a dedicated branch.
- Open feature and maintenance branches to `development`, the staging branch, by pull request.
- Deploy to production exclusively through a pull request from `development` to `main`.
- Never push locally to `development` or `main`. The repository `pre-push` hook blocks these destinations.
- Never open `main` to `development` or to another branch.
- Hotfixes are the only exception to the normal `main` workflow: open a `hotfix/*` branch to both `main` and `development` by pull request so the fix is retained in ongoing development.
- Any hotfix applied to `main` must also be opened to `development`.

## Quality and calculations

- Before each commit, hooks check Astro/TypeScript types (warnings fail), run ESLint with no warnings allowed, and check formatting with Prettier.
- Pull requests to `development` and `main` must pass the same checks and the production build in GitHub Actions.
- Cover all calculation logic added to the product with unit tests.
