# CARPENTERS — Modern Luxury Interior Design & Renovation

A bespoke, production-ready fullstack web application inspired by the architectural distinction, editorial visual structure, and interactive experience of [Carpenters Singapore](https://carpenters.com.sg/).

Built with React, Vite, Express, persistent database storage, pure Vanilla CSS design systems, GSAP ScrollTrigger animations, and Lucide React icons.

---

## 1. Tech Stack

- **Frontend**: React 18, JavaScript (ESM), React Router DOM (v6)
- **Backend**: Node.js, Express 4, Multer (multipart image uploads), bcryptjs, jsonwebtoken
- **Database**: Persistent file-backed JSON database engine (`server/data/db.json`) with atomic writes
- **Theme System**: Custom Vanilla CSS design tokens (`data-theme="light"` / `data-theme="dark"`), system preference detection, and `localStorage` persistence
- **Tooling**: Vite 6, concurrently
- **Animations**: GSAP 3 + ScrollTrigger plugin
- **Icons**: Lucide React
- **Typography**: Google Fonts (*Cormorant Garamond* display serif & *Plus Jakarta Sans* architectural sans-serif)

---

## 2. Authorized Administrator Accounts

The application enforces server-side and client-side authentication for the secure `/admin` management console. Passwords are encrypted with bcrypt salts.

| Account Type | Email | Default Password | Role |
| :--- | :--- | :--- | :--- |
| **Website Owner / Client** | `owner@carpenters.com.sg` | `OwnerCarpenters2026!` | `admin` |
| **Website Developer** | `developer@carpenters.com.sg` | `DevCarpenters2026!` | `admin` |

*Credentials can be configured via `.env` (see Environment Variables section below).*

---

## 3. Project Structure

```
carpenters-clone/
│
├── public/
│   ├── images/
│   │   ├── hero/
│   │   ├── residences/
│   │   ├── services/
│   │   ├── portfolio/
│   │   └── credentials/
│   └── uploads/                  # Uploaded project cover & gallery images
│
├── server/                       # Production-ready Backend & API
│   ├── data/
│   │   └── db.json               # Persistent project & admin database
│   ├── middleware/
│   │   └── auth.js               # JWT verification & role authorization
│   ├── routes/
│   │   ├── auth.js               # Admin login, me, logout endpoints
│   │   ├── projects.js           # Public & admin project management CRUD
│   │   └── upload.js             # Multer image upload handler
│   ├── db.js                     # Database engine & auto-seeding
│   └── index.js                  # Express API server entrypoint (port 5000)
│
├── src/
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── Admin/                # Admin Panel Layout & Protected Routes
│   │   │   ├── AdminLayout.jsx & AdminLayout.css
│   │   │   └── ProtectedRoute.jsx
│   │   ├── Navbar/               # Transparent-to-blur nav with theme toggle
│   │   ├── Hero/                 # Full-screen architectural hero
│   │   ├── Intro/                # Philosophy, stats & why choose us
│   │   ├── Residences/           # HDB, Condo, Landed interactive cards
│   │   ├── Services/             # Vertical list with live hover preview
│   │   ├── Portfolio/            # Dynamic published works grid
│   │   ├── Process/              # 5-step timeline with scroll highlighting
│   │   ├── Credentials/          # CaseTrust, bizSAFE, BCA, HDB badges
│   │   ├── Testimonials/         # Client reviews slider
│   │   ├── FAQ/                  # Accordion with height animation
│   │   ├── CTA/                  # Full-bleed consultation banner
│   │   └── Footer/               # 4-column footer
│   │
│   ├── context/
│   │   ├── AuthContext.jsx       # Admin session & token management
│   │   └── ThemeContext.jsx      # Light / Dark mode management
│   │
│   ├── pages/
│   │   ├── Admin/
│   │   │   ├── AdminLogin.jsx & AdminLogin.css
│   │   │   ├── AdminDashboard.jsx & AdminDashboard.css
│   │   │   ├── AdminProjects.jsx & AdminProjects.css
│   │   │   └── AdminProjectForm.jsx & AdminProjectForm.css
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Portfolio.jsx         # Dynamic public portfolio with filter tabs
│   │   ├── ProjectDetail.jsx     # Public case study page with gallery lightbox
│   │   ├── Contact.jsx
│   │   └── Consultation.jsx
│   │
│   ├── data/
│   │   ├── services.js
│   │   ├── projects.js           # Default project seeds
│   │   ├── testimonials.js
│   │   └── faq.js
│   │
│   ├── animations/
│   ├── App.jsx                   # Central routing & protected route trees
│   ├── main.jsx
│   └── index.css                 # Design tokens for Light and Dark modes
│
├── .env.example
├── .env                          # Local secrets (git-ignored)
├── package.json
├── vite.config.js                # Vite config with /api and /uploads proxy
└── README.md
```

---

## 4. Getting Started

### 1. Installation
```bash
npm install
```

### 2. Run Fullstack Development Environment
Starts both the Express API server (port 5000) and the Vite frontend (port 3000) concurrently:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser.

- Public website: `http://localhost:3000/`
- Public portfolio: `http://localhost:3000/portfolio`
- Project case studies: `http://localhost:3000/projects/:slug`
- Admin panel: `http://localhost:3000/admin`
- Admin login: `http://localhost:3000/admin/login`

### 3. Run Automated Test Suite
To verify API health, security rejection of unauthorized requests, login verification, and complete project CRUD lifecycle:
```bash
node scripts/test_admin_system.js
```

### 4. Build for Production
```bash
npm run build
```

### 5. Production Start
```bash
npm run start
```

---

## 5. How to Use the Admin Panel

1. Navigate to **`/admin`** (or click the login link, or visit **`/admin/login`**).
2. Sign in with either the **Website Owner** or **Website Developer** credentials.
3. Once logged in, the **Dashboard** displays:
   - Total Projects
   - Published Projects
   - Draft Projects
   - Featured Project count
   - Recent projects with quick edit/view links
4. Click **"All Projects"** to:
   - Search by title, location, or category
   - Filter by status (`Published` or `Draft`)
   - Toggle publish/unpublish with 1 click
   - Toggle featured status with 1 click
   - Delete projects (protected by confirmation dialog)
5. Click **"Add Project"** to:
   - Enter title, auto-generating a clean slug (e.g., `/projects/modern-minimalist-penthouse`)
   - Select category (`Residential`, `Commercial`, `Interior Design`, `Architecture`, `Other`)
   - Enter location, year, client, area, short narrative, and detailed concept description
   - Upload high-resolution cover image with instant preview
   - Upload multiple gallery images with live previews, move up/down order controls, and deletion
   - Choose whether to publish immediately or save as a draft
6. **Public Website Synchronization**:
   - As soon as a project is set to **Published**, it automatically appears on the public portfolio (`/portfolio`) and homepage.
   - Clicking the project opens its dedicated project page (`/projects/:slug`).
   - Projects saved as **Draft** are strictly hidden from normal visitors and public API responses.

---

## 6. Light / Dark Mode System

- Toggle button (☀️ Sun / 🌙 Moon) is positioned in the desktop navbar and mobile menu.
- Colors are defined via CSS custom properties in `src/index.css`:
  - `[data-theme="light"]`: Luxury warm cream `#F5F3EF`, charcoal text, white cards.
  - `[data-theme="dark"]`: Midnight architectural surface `#0F0F0E`, warm off-white text, dark luxury card surfaces.
- Remembers user selection in `localStorage`.
- Automatically respects system `prefers-color-scheme` on first visit.
- Seamless CSS transition (`transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease`).

---

## 7. Environment Variables (`.env`)

```ini
PORT=5000
JWT_SECRET=carpenters_super_secret_jwt_key_2026_architectural_distinction

# Authorized Admin 1 (Website Owner / Client)
ADMIN_OWNER_EMAIL=owner@carpenters.com.sg
ADMIN_OWNER_PASSWORD=OwnerCarpenters2026!

# Authorized Admin 2 (Website Developer)
ADMIN_DEV_EMAIL=developer@carpenters.com.sg
ADMIN_DEV_PASSWORD=DevCarpenters2026!
```

---

## 8. Deployment Guide

1. **Deploying on a Node Server / VPS / Docker / Railway / Render**:
   - Set environment variables (`PORT`, `JWT_SECRET`, `ADMIN_OWNER_EMAIL`, `ADMIN_OWNER_PASSWORD`, etc.) in the platform's dashboard.
   - Build frontend: `npm run build`.
   - Start production server: `npm run start`.
   - The Express server serves the static frontend bundle from `dist/`, the uploaded assets from `public/uploads/`, and handles all API endpoints on the specified port.
