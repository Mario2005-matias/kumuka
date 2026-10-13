# KUMUKA interface style guide

## Color and surfaces

The design tokens live in `src/index.css` and are exposed as Tailwind v4 color
utilities through `@theme inline`.

- The default palette is dark: `background` → `surface-1` → `surface-2` →
  `surface-3`.
- The browser's light color-scheme preference switches to the paired light
  palette. There is no in-app theme toggle.
- Use semantic utilities such as `bg-background`, `bg-card`, `bg-surface-2`,
  `text-foreground`, `text-muted-foreground`, `text-primary`, `border-border`,
  and `ring-ring`. Do not introduce literal color classes in page components.
- Brand gradients are tokenized as `--gradient-brand`,
  `--gradient-brand-soft`, `--gradient-surface`, and `--gradient-glow`.
  Apply them with Tailwind arbitrary image utilities, for example
  `bg-[image:var(--gradient-brand)]`.
- Use `success`, `warning`, `info`, and `destructive` tokens for state; avoid
  encoding status through color alone.

## Typography and spacing

- Page title: `text-3xl sm:text-4xl font-bold tracking-tight`.
- Section title: `text-xl` to `text-2xl font-semibold`.
- Body copy: `text-sm` or `text-base`, `leading-6`, and
  `text-muted-foreground` for supporting text.
- Compact metadata: `text-xs`; uppercase labels may use
  `tracking-[0.12em]`.
- Use a mobile-first content width and spacing: `gap-4` on small screens,
  increasing to `gap-6`; page sections use `py-6` to `py-10`.

## Components and interactions

- Reuse `Button`, `Card`, `Badge`, `PageHeader`, `SectionCard`, `StatCard`,
  `StatusBadge`, `EmptyState`, and `Skeleton`.
- Primary actions use the brand gradient and restrained `shadow-primary/20`;
  secondary and outline actions use semantic tokens.
- Cards use a subtle border and layered surfaces. Hover and focus states must
  remain visible without relying on color alone.
- Keep keyboard focus visible. Respect `prefers-reduced-motion`; avoid
  long-running or layout-shifting animation.
- Use empty states when real data is unavailable; do not replace absent API
  data with invented progress, opportunities, or achievements.

## Layout patterns

- Authenticated pages render inside `AppShell`: 260px collapsible desktop
  sidebar, sticky 64px topbar, and the four-item mobile bottom navigation.
- The sidebar becomes a drawer on mobile. The topbar offers route breadcrumbs,
  global search (`Ctrl+K` / `⌘K`), notifications placeholder, and the account
  menu.
- Keep pages usable at 375px, 768px, 1024px, and 1440px; prevent horizontal
  overflow and preserve comfortable touch targets.
- Public pages may use their own layout while sharing the same tokens and
  component language.

## Home page motion

- Home-only motion uses GSAP and ScrollTrigger through
  `src/features/home/lib/gsapConfig.ts`; both are dynamically imported when the
  Home mounts. Below-the-fold sections are split into chunks and loaded near
  the viewport.
- Motion (`motion/react`) is used only for short hover interactions. Lenis is
  intentionally not enabled so native scrolling stays light and keyboard- and
  reduced-motion-friendly.
- The hooks in `src/features/home/hooks/` own reduced-motion detection and GSAP
  context cleanup. Add section reveals through `useScrollAnimation`; keep
  animation setup in `src/features/home/lib/animations/`.
- The shared easing and duration defaults are in `gsapConfig.ts`. Tune hero
  timing and stagger in `heroAnimations.ts`; tune reveal and journey timing in
  `sectionAnimations.ts`. The standard ScrollTrigger threshold is defined in
  `scrollTriggers.ts`.
- Every non-essential animation must be skipped when
  `prefers-reduced-motion: reduce` is active. Keep content visible if animation
  setup fails, and avoid infinite loops or layout-affecting properties.
- The Home intentionally has no statistics block until real product metrics
  are available; do not add symbolic or fabricated counts.

From `frontend`, install the Home animation dependencies with
`npm install gsap motion`. Run `npm run dev` and inspect `/`; check 375px,
768px, 1024px, and 1440px widths, keyboard focus, and the browser's reduced
motion setting. Use Lighthouse in Chrome DevTools and Accessibility Insights
or axe DevTools to inspect performance, contrast, and semantics.

## Validation and rollout

From `frontend`:

```powershell
npx eslint src\components\layout src\components\shared src\features
npx vite build
npm run build
npm run dev
```

Check public and authenticated routes at 375px, 768px, 1024px, and 1440px,
including keyboard navigation, reduced motion, and both browser color-scheme
preferences. `npm run build` also checks TypeScript; resolve any existing
project-wide type errors it reports before release.

To revert this redesign safely, first preserve any unrelated working-tree
changes, then use `git revert <design-commit>` after the redesign has been
committed. Avoid restoring entire folders when the worktree contains unrelated
changes.
