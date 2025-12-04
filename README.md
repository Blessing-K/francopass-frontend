## Phase 4 — Frontend Integration (React)

This is a React single-page application delivering full CRUD interfaces and a responsive, user-friendly UI that connects to the existing Express backend.

Implemented features:

- Routing & Layout: `react-router-dom`-based routing with a top navigation and dedicated pages for Resources, Users, Vocab, Exams, and Feedback.
- Central API: `src/api.js` provides a centralized `axios` instance used for all network calls.
- CRUD Views: List and Form pages for each resource supporting Create, Read, Update, and Delete operations.
- Validation: Client-side validation for required fields and common input formats with inline error display.
- User Feedback: Transient flash messages for create/update actions (navigates back to list with a message) and immediate local flashes for deletes; all auto-dismiss after a short interval.
- Defensive Data Handling: Normalization for backend responses (e.g., handling populated `userId` objects) to avoid rendering errors.
- Visual Theme: Site-wide styling and a black + yellow theme implemented in `src/index.css` and `src/App.css`.
- Responsiveness: Mobile-first CSS across the app — stacked navigation, single-column lists/cards, compact forms, and touch-friendly buttons.
- UX Improvements: Card-based resource lists, prominent primary CTAs, consistent form layouts, and accessible touch targets on mobile.

Key files

- `src/App.jsx` — Router and top-level layout
- `src/api.js` — Axios base instance
- `src/App.css`, `src/index.css` — Theme and responsive styles
- `src/*Page.jsx`, `src/*Form.jsx` — Pages and forms for Resources, Users, Vocab, Exams, Feedback

Boluwatito Kajopelaye-Ola — solo project.
