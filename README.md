# arXiv Research Explorer

An interactive data tool for exploring and filtering arXiv research paper metadata. Built as a take-home exercise demonstrating thoughtful UX engineering with a focus on performance, code quality, and testability.

## Screenshot
<img width="1646" height="913" alt="arXiv_homepage" src="https://github.com/user-attachments/assets/b1a820e3-1ed0-4a6c-8b49-12fbc9d8dfe8" />

## Features

- **Filter by subject category** — dropdown populated from real data across 37 arXiv categories
- **Filter by date range** — from/to date pickers for publication date
- **Filter by affiliation** — free-text search across author affiliation strings
- **Combined filters** — all filters are AND-ed together and apply instantly
- **Paginated results** — 50 rows per page keeps the DOM lean across 358k records
- **Live stats bar** — shows filtered count vs total at a glance
- **Direct paper links** — every paper ID links to its arXiv abstract page

## Tech Stack

- [Vite](https://vitejs.dev/) — fast dev server and build tool
- [React 19](https://react.dev/) — UI component library
- [Vitest](https://vitest.dev/) — unit and component testing
- [React Testing Library](https://testing-library.com/) — behavior-driven component tests
- Plain CSS — no UI framework, intentional

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm run test:run

# Build for production
npm run build
```

## Data

The app loads `public/data.json` at runtime — a subset of arXiv paper metadata with 358,490 records. Each record contains:

| Field | Description |
|-------|-------------|
| `id` | arXiv paper ID |
| `author_affiliation` | Author institution string |
| `created` | Publication datetime (ISO 8601) |
| `subject_labels` | One or more arXiv subject tags |

The data file is served as a static asset and fetched on mount rather than bundled, keeping the JS bundle small.

## Architecture Decisions

**Custom hooks over component state** — `useArxivData` and `useFilters` separate data concerns from rendering concerns. Each hook is independently readable and testable.

**`useMemo` for filter performance** — with 358k records, recomputing filtered results on every render would be expensive. `useMemo` ensures the filter function only runs when the data or filter values actually change.

**Pure utility functions** — all filter logic lives in `filterHelpers.js` with zero React dependency. Pure functions (input → output, no side effects) are the easiest code to test and reason about.

**Pagination over virtualization** — slicing to 50 rows per page keeps the DOM small without the complexity of a virtual list library. All data lives in memory; pagination is purely a rendering concern.

**Controlled components** — `FilterPanel` owns no state. It receives current values and onChange callbacks from the parent, keeping a single source of truth in `useFilters`.

## Testing

28 tests across two files:

- **`filters.test.jsx`** — 20 unit tests covering `parseDate`, `topCategory`, `normalizeRecord`, `applyFilters`, and `collectCategories`
- **`FilterPanel.test.jsx`** — 8 component tests covering rendering, user interactions, and edge cases

```bash
npm run test:run
```

## Time Spent

Approximately 3.5 hours.
