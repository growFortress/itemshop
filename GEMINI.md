# Pixel Bazaar - Minecraft Web Store

## Project Overview
Pixel Bazaar is a modern, responsive web store designed for the "Crafted.pl" Minecraft server. It features a pixel-art aesthetic and provides a catalog for purchasing ranks, keys, chests, and other in-game items across various game modes.

### Main Technologies
- **Framework**: [React 18](https://react.dev/) with [TypeScript](https://www.typescriptlang.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [shadcn-ui](https://ui.shadcn.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **State Management**: React `useState` & `localStorage`
- **Testing**: [Vitest](https://vitest.dev/) & [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)

## Building and Running
- **Development**: `npm run dev` (Starts Vite dev server)
- **Production Build**: `npm run build` (Generates `dist/` directory)
- **Linting**: `npm run lint` (ESLint)
- **Testing**:
  - `npm run test`: Run all tests once.
  - `npm run test:watch`: Run tests in watch mode.
- **Preview Production Build**: `npm run preview`

## Project Structure
- `src/components/`:
  - `ui/`: shadcn-ui primitive components.
  - Domain components: `HeroSection`, `ProductGrid`, `GameModeSelector`, `PurchaseModal`, `RankComparisonModal`, etc.
- `src/pages/`:
  - `Index.tsx`: Main shop page with game mode selection and product grid.
  - `NotFound.tsx`: 404 error page.
- `src/data/`:
  - `shopData.ts`: Centralized static data for game modes, products, and rank definitions.
- `src/hooks/`: Custom React hooks like `useCart`.
- `src/lib/`: Utility functions (e.g., `cn` for Tailwind class merging).
- `src/test/`: Vitest setup and configuration.

## Development Conventions
- **Styling**: Use Tailwind CSS utility classes. Custom pixel-art styles (like `bg-pixel-grid`, `text-shadow-pixel`) are defined in `index.css`.
- **Components**: Functional components with hooks. Prefer modularizing large components (e.g., modals are separate files).
- **Data**: All product and game mode definitions should reside in `src/data/shopData.ts` to maintain a "source of truth".
- **Icons**: Use `lucide-react` for consistent iconography.
- **Persistence**: User preferences (like `activeMode`) are stored in `localStorage`.

## Testing Practices
- Tests should be placed in `src/` with `.test.ts` or `.test.tsx` extensions.
- Use `vitest` for the test runner and `jsdom` for the environment.
- Mocking: `src/test/setup.ts` contains common mocks (e.g., `window.matchMedia`).
