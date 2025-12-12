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

## Phase 5 — Authentication & Authorization

Implemented features:

- OTP-based MFA: login uses email/username + password to initiate a time-limited OTP sent via email; successful verification issues a JWT.
- JWT authentication: backend signs JWTs; `authenticate` middleware validates tokens and `/api/auth/me` returns the current user.
- RBAC: users have a `role` (admin|teacher|student) and `authorize(...roles)` middleware enforces role checks.
- Route protection: public read-only GETs remain accessible; POST/PUT endpoints require authentication; admin-only endpoints use `authorize('admin')`.
- Ownership-based permissions: users can edit/delete vocabulary items they created; resources, exams, and feedback are admin-only.
- Frontend integration: `src/api.js` attaches the JWT token as Bearer auth; `Login`, `OtpVerify`, `Signup` implement the client flow; logout clears the token.
- Conditional UI: action buttons (edit/delete) are shown only to users with appropriate permissions (role + ownership checks).
- Gmail API integration: emails sent via Gmail API (HTTP-based, no SMTP ports) — works on Render free tier and platforms that block SMTP.
- Dev conveniences: `DEV_SHOW_OTP` for local testing, Ethereal fallback for email preview, and `/api/auth/debug-smtp` for email checks.

Requirements status: All Phase 5 requirements have been implemented — public routes are accessible without a token, protected routes require a valid token, and role-restricted routes perform role checks with ownership validation where applicable.

### Deployment

- **Backend**: Deployed on Render with MongoDB Atlas and Gmail API for email delivery
- **Frontend**: Deployed on Vercel with `VITE_API_BASE_URL` pointing to backend
- **Environment variables**: `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REFRESH_TOKEN`, `SMTP_USER`, `JWT_SECRET`, `MONGO_URI`
