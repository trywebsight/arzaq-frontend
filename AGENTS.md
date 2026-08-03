# Arzaq — working agreements

Arabic-only, RTL-first marketing site for a Kuwaiti real-estate company.
Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, TypeScript strict.
`app/` lives in the project root — there is no `src/`. `@/*` maps to `./*`.

## Tooling

- **pnpm only.** `pnpm add`, `pnpm dlx`. Never `npm` or `npx`. Docs that say
  `npx shadcn@latest …` mean `pnpm dlx shadcn@latest …`.
- If a dependency needs a build script, add it to `allowBuilds` in
  `pnpm-workspace.yaml` instead of running interactive `pnpm approve-builds`.
- A dev server runs on <http://localhost:3000>. Don't start a second one.
- `pnpm build` and `pnpm lint` must both pass before you hand off.

## RTL — the rule that matters most

`dir="rtl"` on `<html>` is the entire mechanism. Flex and grid already lay out
right-to-left; the browser has done the mirroring for you.

- **Never write `flex-row-reverse`, and never write `rtl:flex-row-reverse`.**
  That double-reverses and is the single most common bug in this codebase's
  history.
- Use logical utilities everywhere:
  `ms-/me-`, `ps-/pe-`, `start-/end-`, `text-start/text-end`,
  `border-s/border-e`, `rounded-ss/se/es/ee`, `inset-inline-*`.
- Reserve the `rtl:` variant for genuinely mirrored **glyphs** — chevrons,
  arrows, "read more" carets — via `rtl:-scale-x-100`.
- Horizontal GSAP tweens must not hardcode a sign. Use `rtlX()` /
  `directionSign()` / `offsetFor()` from `@/lib/gsap`.
- Libraries with their own coordinate maths need explicit configuration.
  Embla is already wired (`components/ui/carousel.tsx` reads `useDirection()`).

## Copy and data

- **All Arabic copy lives in `messages/ar.json`.** Read keys, never add them,
  never inline Arabic in a component. Structural data (ordering, hrefs, raw
  numbers) lives in `lib/site.ts`.
- Western digits (0-9), not Arabic-Indic — Gulf convention. `CountUp` and the
  `en-US`/`latn` formatters already enforce this.
- Mock fixtures live in `mocks/` and are complete. Add fields to
  `features/*/types.ts` first, then the fixture.
- Images: import from `@/lib/assets`. Never reference a filename in `public/`.

## Components

- Every component is prop-driven and reusable. No hardcoded copy, no
  hardcoded data, no single-use components where a generic one will do.
- Cards, links and sections take their content as props so listing pages can
  reuse them.
- Haptics fire on every clickable. `Button`, `HapticLink` and `HapticCard`
  already call `haptic()` — do not add a second call on top.
- Icon-only controls need an accessible name from `messages/ar.json`.

## Animation

- **GSAP is the only animation engine.** No `motion`/`framer-motion`, no
  `react-spring`. If a copied component ships with `motion`, port it to GSAP
  at paste time rather than adding a second library that writes to the same
  `transform`.
- Reach for the primitives in `components/motion/` before writing a raw tween:
  `Reveal`, `StaggerGroup`, `SplitHeading`, `CountUp`, `Magnetic`.
- Every animation runs inside `gsap.matchMedia()` with a
  `(prefers-reduced-motion: reduce)` branch that renders the **final state
  instantly** — not a shortened animation. Use `matchMotion()` from
  `@/lib/gsap`.
- Register plugins nowhere but `lib/gsap.ts`; import `gsap` from there.
- `SplitHeading` never splits by characters: Arabic is a connected script and
  per-character inline-blocks break letter joining.

## Data layer

- `lib/api/client.ts` is the only file that knows where data comes from.
  Swapping to a real backend is `NEXT_PUBLIC_API_URL` +
  `NEXT_PUBLIC_MOCK_MODE=false` (legacy: `NEXT_PUBLIC_USE_MOCKS=false`).
  Mock mode wins when true even if the API URL is set.
- Use the `queryOptions()` factories in `features/*/queries.ts` on both sides
  (server prefetch and `useQuery`) so keys match exactly. Never inline a key.
- Sections must render all five states through `<QueryState>`:
  loading, error + retry, empty, background refetch, success.
- Skeletons go through `<BoneSkeleton>` and **must** pass a hand-written
  Tailwind `fallback` that looks correct on its own. Bones have not been
  captured yet — `pnpm exec boneyard-js build` runs at the very end, against
  finished markup. `bones/registry.js` is a placeholder until then.
- Force any state without code changes: `?mockState=loading|error|empty|slow`
  or `NEXT_PUBLIC_MOCK_STATE`.

## Code style

- No narrating comments. Don't write `// import the module`, `// map over the
  items`, or comments explaining the change you just made. Comment only
  constraints the code cannot express.
- Public primitives get a short TSDoc block with `@param`/`@example`; three
  other agents consume them without being able to ask questions.
- Prefer logical CSS properties, `text-balance`/`text-pretty` for headings and
  paragraphs, and `next/image` with explicit `sizes`.
