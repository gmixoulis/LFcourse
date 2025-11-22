# LFcourse

A lightweight Next.js + TypeScript quiz app with AI-assisted question and hint generation. This project is a small learning/course prototype built with modern React (Next.js App Router), Tailwind CSS, and a modular UI component set. It includes client-side quiz components and small AI flows/tools for generating quiz questions and hints from content.

**Key features:**
- **Purpose:** A sandbox for building interactive quizzes and AI-assisted content generation.
- **Tech stack:** `Next.js` (App Router), `TypeScript`, `Tailwind CSS`, and simple AI flows under `src/ai`.
- **Components:** Reusable UI primitives in `src/components/ui` and a quiz client in `src/components/quiz-client.tsx`.
- **Content:** Example quizzes stored in `src/data/quizzes` (e.g. `blockchain.json`).

---

**Quick Start**

- **Prerequisites:** Node.js (v16+ recommended) and `pnpm` (the repo uses `pnpm` lockfile). If you prefer `npm`/`yarn`, you can adapt the commands.
- **Install dependencies:**

```
pnpm install
```

- **Run development server:**

```
pnpm dev
```

- **Build for production:**

```
pnpm build
pnpm start
```

---

**Project layout (high level)**

- **`src/app`**: Next.js App Router pages and client+server entry points (layout, page, global styles).
- **`src/components`**: App UI and the `quiz-client` component used to render interactive quizzes.
- **`src/components/ui`**: Collection of UI primitives (buttons, inputs, dialogs, etc.).
- **`src/data/quizzes`**: JSON quiz data used by the quiz client (example: `blockchain.json`).
- **`src/ai`**: Small AI utilities and flows for generating questions and hints (`dev.ts`, `genkit.ts`, `flows/`).
- **`src/lib`**: Types and helper utilities.

---

**How it works (overview)**

- The app renders a quiz UI via `src/components/quiz-client.tsx`, which reads JSON quizzes from `src/data/quizzes`.
- The `src/ai` directory contains flows to programmatically generate hints and questions from source content. These are intended as developer tools / experiment flows that can be integrated into the quiz pipeline.
- UI components live under `src/components/ui` to keep presentation consistent and reusable across different pages.

---

**Development notes & tips**

- To add a new quiz: create a JSON file under `src/data/quizzes` following the `blockchain.json` structure and load it from the quiz client.
- To extend AI flows: look at `src/ai/flows/generate-questions.ts` and `generate-hint.ts` to see how questions/hints are generated programmatically.
- UI changes: prefer adding small, focused components in `src/components/ui` to keep the component library cohesive.

---

**Testing & formatting**

- Add or run existing test scripts if present in `package.json` (the project uses Next.js default test/integration flows if configured).
- Run format/lint scripts as configured (e.g., `pnpm lint`, `pnpm format`) — adjust if your repo uses different scripts.

---

