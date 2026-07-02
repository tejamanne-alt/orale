# Orale

**Orale** ("Together") is a private, invite-only, time-boxed relationship game for friends and
families — see [`docs/game-design.md`](./docs/game-design.md) for the full design doc. This repo
is the enterprise-grade monorepo scaffold for the React Native (Expo) mobile app, starting with
the first mini-game: **Appreciation Roulette**.

## Stack

| Concern           | Choice                                                                            |
| ----------------- | --------------------------------------------------------------------------------- |
| Mobile app        | [Expo](https://expo.dev) (SDK 54) + React Native 0.81, TypeScript                 |
| Backend           | Firebase (Firestore, Cloud Functions, Auth, Storage)                              |
| Monorepo          | pnpm workspaces + [Turborepo](https://turbo.build)                                |
| Navigation        | React Navigation (native-stack)                                                   |
| Animation         | react-native-reanimated + react-native-svg                                        |
| State             | Zustand (ephemeral UI state) + TanStack Query (server cache, wired incrementally) |
| Local persistence | AsyncStorage (used by the mock data backend)                                      |
| Lint/format       | ESLint (flat config, `eslint-config-expo`) + Prettier                             |
| CI                | GitHub Actions — lint, typecheck, test, format check, EAS preview build           |

## Layout

```
apps/
  mobile/       Expo app (the game itself)
  functions/     Firebase Cloud Functions (server-authoritative game logic)
packages/
  shared/        Domain types, prompt decks, wheel-selection logic, design tokens —
                 shared between the mobile app and Cloud Functions
firestore.rules, firestore.indexes.json, storage.rules, firebase.json
                 Firebase project config
```

Why a monorepo: the "benevolent rig" selection algorithm and prompt decks must produce
_identical_ results whether they run in the mobile app's offline mock mode or in the
`spinRoulette` Cloud Function — `packages/shared` is the single source of truth for that logic,
imported by both.

## Getting started

```bash
pnpm install
pnpm --filter mobile start   # or: pnpm dev
```

Scan the QR code with Expo Go, or press `i` / `a` for a simulator/emulator.

> The app is pinned to Expo SDK 54 deliberately (not npm's `latest` tag) because the public
> App Store build of Expo Go only supports the newest SDK or two — brand-new SDKs are often
> unusable in Expo Go for weeks after they ship on npm. If `expo start` fails in Expo Go with
> "Project is incompatible," check what SDK Expo Go currently supports before assuming it's a
> local setup problem.

The app runs with **zero backend setup** out of the box: `EXPO_PUBLIC_DATA_BACKEND` defaults to
`mock`, which plays the full Roulette loop against local seed data (`src/data/demoGroup.ts`)
persisted to AsyncStorage. Copy `apps/mobile/.env.example` to `apps/mobile/.env` and flip
`EXPO_PUBLIC_DATA_BACKEND=firebase` (with real `EXPO_PUBLIC_FIREBASE_*` values) to run against a
provisioned Firebase project instead — no code changes required, since both backends implement
the same `RouletteRepository` interface (`apps/mobile/src/data/repositories/`).

## Firebase project setup (when you're ready to go live)

1. Create a Firebase project, enable Firestore, Auth, Functions, and Storage.
2. `firebase use --add` to point this repo at it (replace the placeholder in `.firebaserc`).
3. `pnpm --filter @orale/functions run build && firebase deploy --only functions,firestore:rules,storage`
4. Run `firebase emulators:start` (via `pnpm --filter @orale/functions run serve`) to develop
   against local emulators before touching production data.

`spinRoulette` is a callable Cloud Function: it re-runs the same weighted target/mission
selection as the mock repository, but server-side and inside a Firestore transaction, so the
"wheel" can't be gamed from the client and stays idempotent (one spin per member per day, keyed
by the group's local `chestDate`).

## Scripts (run from repo root via Turborepo)

| Command                        | What it does                         |
| ------------------------------ | ------------------------------------ |
| `pnpm lint`                    | ESLint across all workspaces         |
| `pnpm typecheck`               | `tsc --noEmit` across all workspaces |
| `pnpm test`                    | Jest across all workspaces           |
| `pnpm format` / `format:check` | Prettier                             |
| `pnpm --filter mobile start`   | Launch the Expo dev server           |

Husky + lint-staged run ESLint/Prettier on staged files before each commit.

## What's implemented (v1.0 slice)

- Monorepo tooling: pnpm workspaces, Turborepo pipelines, shared TypeScript config, flat-config
  ESLint (`eslint-config-expo` for the app, `typescript-eslint` for shared/functions), Prettier,
  Husky pre-commit hook, GitHub Actions CI.
- `packages/shared`: `Group`/`Member`/`RouletteSpinResult` domain types, the benevolent-rig
  wheel-selection algorithm (`selectRouletteTarget`, biased toward least-paired members, with unit
  tests), the seed prompt deck, and design tokens.
- `apps/functions`: `spinRoulette` callable — auth-gated, transactional, idempotent per
  group/member/day, updates the pair-interaction ledger the rig reads from.
- Firestore security rules that lock spins/pair-stats to Cloud-Function-only writes (the client
  can read but never write them directly, so the rig can't be gamed).
- `apps/mobile`: navigation shell (Home → Roulette), a two-wheel spin animation (outer wheel of
  members, inner ring of mission types) built on Reanimated + SVG-style geometry, a
  `RouletteRepository` abstraction with interchangeable mock/Firebase implementations, and the
  mission-completion form (write a response, optionally anonymous for compliments).

## Roadmap (per the design doc's MVP cut lines)

- **v1.0 remainder:** groups/invites/accept-to-join, treasure map container, Bubble Blast,
  end-of-day reveal screen, group chat/reactions.
- **v1.1:** The Colossus (weekly boss), Photo Scrub + the Vault.
- **v1.2+:** The Unfolding, Ghost Mode, Bridge Builder, photo-mosaic puzzles, Family Archive,
  Operation Surprise / Reunion Meter.

See `docs/game-design.md` for the full picture.
