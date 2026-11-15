# St. Francis Xavier's Church, Neduvila (Kerala, India)
### Production-Ready Parish Website, Marian Devotions & Admin Portal
**വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം, നെടുവില**

[![Repository](https://img.shields.io/badge/GitHub-Repository-blue?logo=github)](https://github.com/Jinesh1717/St.-Francis-Xavier-s-Church-Neduvila.git)
[![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-Glassmorphism-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 1. Overview & Architectural Showcase

A complete, production-ready full-stack web application designed for **St. Francis Xavier's Roman Catholic Church, Neduvila** (Archdiocese of Changanacherry, Kerala, India). Built with a serene, modern glassmorphic visual language, the website delivers an accessible spiritual sanctuary for parishioners and visitors worldwide, while providing church administrators with a secure portal for parish ministry management.

### Key Capabilities
- **Exact Church Geolocation**: Pinpointed coordinates (`8.340649, 77.1415017`) with embedded Google Map, "Get Directions", and direct Google Maps place integration.
- **Japamala (വിശുദ്ധ ജപമാല / Holy Rosary)**: Complete guide, Joyful/Luminous/Sorrowful/Glorious mysteries with automatic highlighting for the current day of the week, plus an interactive step-by-step "Pray Along" counter with visual decade bead progression.
- **Kurisinte Vazhi (കുരിശിന്റെ വഴി / Way of the Cross)**: All 14 sacred stations with English and Malayalam titles, meditations, and a focused fullscreen "Walk the Stations" mode with keyboard arrow navigation.
- **Parish Announcements & Circulars**: Categorized announcements with pinned/important badges and automatic expiry date handling.
- **Sacred Liturgical Events Calendar**: Filterable by upcoming and past celebrations with dates, timings, venues, and posters.
- **Parish Photo Gallery**: High-resolution albums (Sanctuary, Sacraments, Feast Celebrations, Youth) with an accessible frosted lightbox.
- **Hidden Admin Management Portal (`/admin`)**: Protected behind bcrypt hashing, short-lived httpOnly JWT cookies, CSRF double-submit token verification, IP rate limiting, account lockout protection, and automatic 30-minute inactivity logout.

---

## 2. Screenshots & UI Progression

```
+---------------------------------------------------------------------------------+
|  ✝ St. Francis Xavier's Church, Neduvila    Home  Events  Japamala  Way-of-Cross|
+---------------------------------------------------------------------------------+
|                                                                                 |
|           [ Warm Cream & Soft Sky Blue Glassmorphic Hero Banner ]               |
|            "വിശുദ്ധ ഫ്രാൻസിസ് സേവ്യർ ദൈവാലയം, നെടുവില"                        |
|                                                                                 |
|          [ View Events ]       [ Japamala / ജപമാല ]       [ Get Directions ]     |
|                                                                                 |
+---------------------------------------------------------------------------------+
|  Important Announcements        Upcoming Liturgies       14 Stations Preview    |
|  [ Pinned Novena Schedule ]     [ Parish Feast Mass ]    [ Walk the Stations ]  |
+---------------------------------------------------------------------------------+
```

---

## 3. Directory Layout

```
church/
├── client/                     # Frontend React 18 + Vite application
│   ├── public/
│   ├── src/
│   │   ├── api/client.js       # Axios instance with automatic CSRF interceptor
│   │   ├── config/church.js    # Coordinates, Maps, and parish configuration
│   │   ├── components/         # Navbar, Footer, Lightbox, Modal, Skeleton, Toast
│   │   ├── context/            # AuthContext with 30-min inactivity auto-logout
│   │   ├── pages/              # Home, Events, Japamala, KurisinteVazhi, Gallery, Notices, About, NotFound
│   │   │   └── admin/          # AdminLogin, AdminLayout, Overview, Events, Prayers, Gallery, Notices, Settings
│   │   ├── App.jsx             # Route definitions & ambient glass layouts
│   │   ├── main.jsx            # React root mount
│   │   └── index.css           # Glassmorphism CSS variables, mesh gradients & typography
│   ├── .env.example
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── package.json
├── server/                     # Backend Express REST API
│   ├── src/
│   │   ├── config/             # MongoDB connection (Atlas & in-memory) & Cloudinary
│   │   ├── controllers/        # Auth, Event, Prayer, Gallery, Notice, Setting controllers
│   │   ├── middleware/         # Auth, RateLimiter, Security, Upload, Validation, ErrorHandler
│   │   ├── models/             # Admin, Event, Prayer, Timing, Gallery, Notice, Setting schemas
│   │   ├── routes/             # Public & Admin route definitions
│   │   ├── scripts/seed.js     # Admin & bilingual church data seed script
│   │   ├── app.js              # Express app with Helmet, CSP, CORS, CSRF, sanitizers
│   │   └── server.js           # Server bootstrap & listener
│   ├── tests/                  # Jest & Supertest test suite (19 test cases)
│   ├── .env.example
│   └── package.json
├── README.md                   # Full production documentation
└── package.json                # Root convenience commands
```

---

## 4. Environment Variables Reference

### Backend (`server/.env`)
Create `server/.env` using `server/.env.example`:
```env
PORT=5000
NODE_ENV=development

# Frontend Origin for CORS
FRONTEND_URL=http://localhost:5173

# Database Connection (MongoDB Atlas URI or mongodb://localhost:27017/church_db)
# If left empty in development/testing, an embedded in-memory MongoDB instance runs automatically.
MONGODB_URI=

# JWT Secret (minimum 32 characters)
JWT_SECRET=your_super_secret_jwt_key_at_least_32_chars_generate_random

# Default Admin Credentials for Seeding (npm run seed:admin)
ADMIN_USERNAME=churchadmin
ADMIN_PASSWORD=change_this_secure_password_in_production_123!

# Cloudinary Storage (optional in local dev; falls back to local disk storage if unset)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`client/.env`)
Create `client/.env` using `client/.env.example`:
```env
VITE_API_URL=/api
```

---

## 5. Quick Start & Execution

### 1. Install Dependencies
```bash
# In server directory:
cd server
npm install

# In client directory:
cd ../client
npm install
```

### 2. Seed Admin & Parish Data
Seed the default parish administrator account, mass timings, sample events, notices, gallery photos, Holy Rosary structure, and 14 Stations of the Cross:
```bash
cd server
npm run seed:admin
```
- **Default Admin Username:** `churchadmin`
- **Default Admin Password:** `StFrancisXavier@2026#Secure!` *(or custom password defined in your server/.env)*

### 3. Start Local Development
Open two terminal windows:

**Terminal 1 (Backend API - Port 5000):**
```bash
cd server
npm run dev
```

**Terminal 2 (Frontend Client - Port 5173):**
```bash
cd client
npm run dev
```

- Public Site: `http://localhost:5173`
- Japamala: `http://localhost:5173/japamala`
- Kurisinte Vazhi: `http://localhost:5173/kurisinte-vazhi`
- Admin Portal: `http://localhost:5173/admin`

---

## 6. Automated Testing

Run the full Jest & Supertest test suite covering authentication, account lockout, rate limiting, CSRF verification, route security, and prayer validation:
```bash
cd server
npm test
```
*Result: 19 automated tests passing across 2 test suites.*

---

## 7. Security Hardening Summary

| Dimension | Implementation |
| :--- | :--- |
| **Password Storage** | Passwords hashed using `bcrypt` (cost 12). Plaintext is never stored or logged (`select: false`). |
| **Session Security** | Short-lived JWT (30 minutes) stored in an `httpOnly`, `Secure` (production), `SameSite=Strict` cookie (`token`). |
| **Inactivity Auto-Logout** | Client detects user inactivity across mouse, key, and touch events, automatically clearing the session after 30 minutes. |
| **Brute-Force & Lockout** | `express-rate-limit` limits login attempts to 5 per 15 minutes per IP. Automatic 15-minute account lockout upon 5 failed attempts with artificial delay to prevent timing attacks. |
| **CSRF Defense** | State-changing admin endpoints (`POST`, `PUT`, `DELETE`, `PATCH`) enforce double-submit verification matching header `X-CSRF-Token` against cookie `XSRF-TOKEN`. |
| **Server Hardening** | `helmet` Content-Security-Policy restricted to self, Cloudinary (`res.cloudinary.com`), Google Maps (`https://www.google.com`, `https://maps.google.com`), and Google Fonts. HSTS enabled, `x-powered-by` disabled. |
| **NoSQL & Parameter Tampering** | `express-mongo-sanitize` strips `$` and `.` operators. `hpp` prevents parameter pollution. |
| **XSS & Content Sanitization** | Text inputs sanitized with HTML stripping (`xss`). React renders plain text without `dangerouslySetInnerHTML`. Malayalam & English rendered using UTF-8 and `white-space: pre-line`. |
| **Secure File Uploads** | Multer memory storage; verifies allowed MIME types (`image/jpeg`, `image/png`, `image/webp`) AND inspects raw buffer magic bytes (`0xFF 0xD8 0xFF`, `0x89 0x50 0x4E...`, `RIFF...WEBP`). Capped at 5 MB, max 10 files per request. |
| **Hidden Admin Route** | Admin portal URL (`/admin`) is unlinked in public navigation and has `<meta name="robots" content="noindex, nofollow">` to prevent web crawlers from indexing. |

---

## 8. Deployment Guide

1. **Frontend Hosting (Vercel / Netlify)**:
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Set environment variable: `VITE_API_URL=https://your-api-domain.com/api`
   - Add SPA fallback rewrite (`/*` -> `/index.html`).

2. **Backend Hosting (Render / Railway / Fly.io)**:
   - Start Command: `node src/server.js`
   - Environment variables: `NODE_ENV=production`, `PORT=5000`, `FRONTEND_URL=https://your-church-domain.com`, `MONGODB_URI=mongodb+srv://...`, `JWT_SECRET=...`, `CLOUDINARY_CLOUD_NAME=...`, `CLOUDINARY_API_KEY=...`, `CLOUDINARY_API_SECRET=...`.

3. **Database (MongoDB Atlas)**:
   - Configure a least-privilege user on the church database.
   - Restrict Network Access IP allow-list to your backend hosting provider.

---

## 9. GitHub Repository

Official Repository: [https://github.com/Jinesh1717/St.-Francis-Xavier-s-Church-Neduvila.git](https://github.com/Jinesh1717/St.-Francis-Xavier-s-Church-Neduvila.git)
