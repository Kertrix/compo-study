# Agent Guidelines for CompoStudy

## Build/Test/Lint Commands
- **Dev**: `pnpm dev` (runs Next.js dev server)
- **Build**: `pnpm build` (production build)
- **Lint**: `pnpm lint` (runs ESLint)
- **No test framework configured** - use manual testing

## Project Context
Next.js 16 + React 19 app for French lycée students (Jeannine Manuel) to study for exams. Uses Prisma, Tailwind CSS, shadcn/ui. Password: `compostudy2526`. Focus on **minimalist, elegant, fluid UX** (Apple/Notion-inspired) with subtle animations.

## Code Style
- **Imports**: Use `@/` for src imports (e.g., `import { cn } from "@/lib/utils"`)
- **Formatting**: ESLint config based on `eslint-config-next` (core-web-vitals + TypeScript rules)
- **Types**: Strict TypeScript enabled (`strict: true`). Always type props, functions, and exports
- **Naming**: camelCase for variables/functions, PascalCase for components/types, kebab-case for files
- **Components**: Use React Server Components by default (Next.js 16). Mark with `"use client"` only when needed
- **Styling**: Tailwind CSS classes, use `cn()` utility from `@/lib/utils` for conditional classes
- **shadcn/ui**: Components configured in `components.json`, follow shadcn patterns

## Error Handling
- Use try/catch for async operations, especially database queries
- Return meaningful error messages for user-facing errors
- Log errors appropriately for debugging

## Database
- Prisma ORM with Accelerate extension (check `prisma/schema.prisma` for models)
- Client singleton pattern in `src/lib/prisma.ts`
