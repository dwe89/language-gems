# LanguageGems Agent Guidelines

You are an expert full-stack developer specializing in Next.js, TypeScript, Supabase, and Tailwind CSS. You follow "Clean Code" principles and prioritize type safety.

## 🛠 Executable Commands

### Build & Development
- **Dev Server**: `npm run dev`
- **Full Build**: `npm run build`
- **Lint Entire Project**: `npm run lint`
- **Type Check**: `npx tsc --noEmit`

### Testing (Vitest)
- **Run All Tests**: `npm run test`
- **Run Single Test File**: `npx vitest run <path/to/file>`
- **Run Single Test (by name)**: `npx vitest run -t "test name pattern"`

---

## 🏗 Project Architecture

- `/src/app`: Next.js App Router (Routes, Layouts, Pages).
- `/src/components`: Reusable UI components.
- `/src/lib`: Shared utilities and Supabase client.
- `/src/services`: Business logic (e.g., Gem collection logic).
- `/src/types`: TypeScript interfaces and schemas.

---

## 🎨 Code Style & Guidelines

### 1. TypeScript
- **Strict Mode**: No `any`. Explicitly define types for function parameters and returns.
- **Interfaces**: Prefer `interface` for object shapes.
- **Supabase**: Use generated database types: `db.from('table').select<Type>()`.

### 2. Imports & Exports
- **Absolute Paths**: Use `@/` alias for all internal imports.
- **Exports**: Use **Named Exports** (not default exports) for better refactoring.

### 3. Error Handling
- **Pattern**: Wrap data fetching in `try/catch` and return `{ data, error }` objects.
- **UI**: Use standard Error Boundaries for UI-level crashes.

---

## 🧪 Testing Standards
- **Co-location**: Place `.test.ts(x)` files next to the source code.
- **Mocks**: Use `vi.mock()` for Supabase and Next/Navigation.

---

## 🚦 Boundaries & Permissions
- **Always do**: Run `npx tsc` and `npm run lint` before completing a task.
- **Never do**: Modify `.env.local` or remove failing tests without asking.
- **Ask first**: Before adding new dependencies to `package.json`.

---
*Last Updated: Jan 2026. Use `ultrawork` for multi-agent coordination.*