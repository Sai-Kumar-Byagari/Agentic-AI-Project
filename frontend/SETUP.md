# Setup Guide - Agentic AI Platform Frontend

## Prerequisites

- **Node.js:** v18 or higher
- **npm:** v9 or higher
- **Git:** For version control

## Installation

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages from `package.json`:
- React 19.2.5
- Redux Toolkit with React Redux
- React Router v7
- Axios for HTTP requests
- Tailwind CSS v4
- TypeScript 6.0.3
- Vite as the build tool
- Testing libraries (Vitest, Testing Library)

### 2. Environment Setup

Copy the example environment file and configure for local development:

```bash
cp .env.example .env
```

The `.env` file is already configured for **mock data mode**:
```
VITE_USE_MOCK_DATA=true
VITE_API_BASE_URL=http://localhost:3000/api
```

**For Phase 1 (Login & Dashboard):**
- All API responses are mocked with hardcoded data
- No backend server required
- Perfect for UI development and testing

## Running the Application

### Development Mode

```bash
npm run local
```

This starts the Vite dev server on `http://localhost:3001` with hot-reload enabled.

**What you'll see:**
1. Login page with SSO + email/password forms
2. Mock credentials: `demo@bank.example` / `password123`
3. Dashboard with full mock data (KPIs, charts, sources, queue, runs)

### Production Build

```bash
npm run build
```

This creates an optimized production bundle in the `dist/` folder.

### Preview Production Build

```bash
npm run preview
```

This serves the production build locally for testing before deployment.

## Project Structure

```
src/
├── pages/              # Routed page components
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── redux/             # Redux store and slices
├── services/          # API service layer
├── api/              # Axios config and endpoints
├── types/            # TypeScript interfaces
├── constants/        # Constants and mock data
├── utils/            # Utility functions
├── __tests__/        # Test files (stub phase)
├── Root.tsx          # Redux provider wrapper
├── App.tsx           # Route definitions
├── main.jsx          # Entry point
└── index.css         # Global styles
```

## Code Style & Standards

Follow the frontend coding standards defined in `_developer_instructions/FRONTEND_RULES.md`:

- **TypeScript:** Strict mode enabled - no `@ts-ignore`
- **Components:** Functional components with React hooks
- **State:** Redux for auth, component state for UI
- **Styling:** Tailwind CSS with inline classes
- **Error Handling:** Error Boundary at component level
- **Accessibility:** Semantic HTML, ARIA labels, keyboard navigation
- **Performance:** Memoization for expensive components

## Development Workflow

### 1. Start the Dev Server

```bash
npm run local
```

### 2. Make Changes

- Edit files in `src/` - Vite automatically reloads
- Check `http://localhost:3001` in your browser
- Use browser DevTools for debugging

### 3. Check Code Quality

```bash
# Linting
npm run lint

# Type checking (if applicable)
# npx tsc --noEmit
```

### 4. Run Tests (Stub Phase)

```bash
npm test
```

Tests are stubbed out and ready for implementation in Stage 8.

### 5. Commit Changes

```bash
git add -A
git commit -m "feat: description of changes"
```

## Mock Data

The application uses **hardcoded mock data** for Phase 1. To see different data:

1. Edit `src/constants/mockData.ts`
2. Change the mock values (KPIs, runs, etc.)
3. Vite will automatically reload

### Using Real Backend (When Ready)

When the backend is ready:

1. Set `VITE_USE_MOCK_DATA=false` in `.env`
2. Set `VITE_API_BASE_URL` to your backend URL
3. Services will automatically call real APIs
4. No code changes needed - service layer handles both

## Testing

### Unit Tests (Stub Phase)

Test files are in `src/__tests__/` with basic structure:
- `hooks/useAuth.test.ts`
- `hooks/useFormValidation.test.ts`
- `services/authService.test.ts`

To run tests:

```bash
npm test
```

To run tests in watch mode:

```bash
npm test -- --watch
```

## Troubleshooting

### Issue: Port 3001 Already in Use

```bash
# Change port in package.json or kill the process
lsof -i :3001          # macOS/Linux
netstat -ano | findstr :3001  # Windows
```

### Issue: Module Not Found

```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript Errors

```bash
# Ensure TypeScript is properly installed
npm install typescript@latest --save-dev
```

### Issue: Tailwind Styles Not Loading

```bash
# Restart the dev server and clear browser cache
npm run local
# Then Ctrl+Shift+R to hard-refresh browser
```

## Environment Variables Reference

| Variable | Value | Purpose |
|----------|-------|---------|
| `VITE_USE_MOCK_DATA` | `true` \| `false` | Toggle mock API responses |
| `VITE_API_BASE_URL` | URL | Backend API base path |
| `VITE_ENCRYPTION_KEY` | Hex string | Optional request/response encryption |
| `VITE_OKTA_TENANT_URL` | URL | Okta tenant URL (future) |
| `VITE_OKTA_CLIENT_ID` | String | Okta app client ID (future) |

## Next Steps

1. **Stage 2 (Current):** Auth hooks & services implemented ✅
2. **Stage 3:** Login UI components refined
3. **Stage 4:** Dashboard hooks & services
4. **Stage 5:** Dashboard UI components
5. **Stage 6:** Routing & app integration
6. **Stage 7:** Error handling & edge cases
7. **Stage 8:** Testing & quality assurance
8. **Stage 9:** Documentation & handoff

## Useful Commands

```bash
# Development
npm run local              # Start dev server
npm run lint             # Check code quality
npm test                 # Run tests

# Building
npm run build            # Build for production
npm run build:qa         # Build for QA environment
npm run build:staging    # Build for staging
npm run preview          # Preview production build

# Utilities
npm run dev              # Alias for local
npm run prod             # Start production build
```

## Resources

- **React Docs:** https://react.dev
- **Redux Docs:** https://redux.js.org
- **Tailwind CSS:** https://tailwindcss.com
- **TypeScript:** https://www.typescriptlang.org
- **Vite:** https://vitejs.dev
- **Vitest:** https://vitest.dev

## Support

For issues or questions:
1. Check the FRONTEND_RULES.md for coding standards
2. Review existing code patterns in `src/`
3. Check test stubs for testing patterns
4. Refer to the implementation roadmap in `_plans/implementation-roadmap.md`

---

**Happy coding! 🚀**
