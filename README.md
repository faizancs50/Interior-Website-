# CARPENTERS — Modern Luxury Interior Design & Renovation

A bespoke, production-ready React web application inspired by the architectural distinction, editorial visual structure, and interactive experience of [Carpenters Singapore](https://carpenters.com.sg/).

Built with React, Vite, pure Vanilla CSS design systems, GSAP ScrollTrigger animations, and Lucide React icons.

---

## 1. Tech Stack

- **Core**: React 18, JavaScript (ESM)
- **Tooling**: Vite 6
- **Routing**: React Router DOM (v6)
- **Styling**: Vanilla CSS (Modular design tokens, CSS variables, zero Tailwind)
- **Animations**: GSAP 3 + GSAP ScrollTrigger plugin
- **Icons**: Lucide React
- **Typography**: Google Fonts (*Cormorant Garamond* display serif & *Plus Jakarta Sans* architectural sans-serif)

---

## 2. Folder Structure

```
carpenters-clone/
│
├── public/
│   ├── images/
│   │   ├── hero/
│   │   │   ├── hero-1.webp
│   │   │   └── hero-2.webp
│   │   │
│   │   ├── residences/
│   │   │   ├── hdb-1.webp
│   │   │   ├── condo-1.webp
│   │   │   └── landed-1.webp
│   │   │
│   │   ├── services/
│   │   │   ├── hdb.webp
│   │   │   ├── condo.webp
│   │   │   ├── landed.webp
│   │   │   └── commercial.webp
│   │   │
│   │   ├── portfolio/
│   │   │   ├── project-1.webp
│   │   │   ├── project-2.webp
│   │   │   ├── project-3.webp
│   │   │   └── project-4.webp
│   │   │
│   │   └── credentials/
│   │       ├── casetrust.webp
│   │       ├── bizsafe.webp
│   │       ├── bca.webp
│   │       └── hdb.webp
│   │
│   └── fonts/
│
├── src/
│   ├── assets/
│   │   └── logo.svg
│   │
│   ├── components/
│   │   ├── Navbar/ (Navbar.jsx, Navbar.css)
│   │   ├── Hero/ (Hero.jsx, Hero.css)
│   │   ├── Intro/ (Intro.jsx, Intro.css)
│   │   ├── Residences/ (Residences.jsx, Residences.css)
│   │   ├── Services/ (Services.jsx, Services.css)
│   │   ├── Portfolio/ (Portfolio.jsx, Portfolio.css)
│   │   ├── Process/ (Process.jsx, Process.css)
│   │   ├── Credentials/ (Credentials.jsx, Credentials.css)
│   │   ├── Testimonials/ (Testimonials.jsx, Testimonials.css)
│   │   ├── FAQ/ (FAQ.jsx, FAQ.css)
│   │   ├── CTA/ (CTA.jsx, CTA.css)
│   │   └── Footer/ (Footer.jsx, Footer.css)
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── About.jsx
│   │   ├── Services.jsx
│   │   ├── Portfolio.jsx
│   │   ├── Contact.jsx
│   │   └── Consultation.jsx
│   │
│   ├── data/
│   │   ├── services.js
│   │   ├── projects.js
│   │   ├── testimonials.js
│   │   └── faq.js
│   │
│   ├── animations/
│   │   ├── heroAnimations.js
│   │   ├── scrollAnimations.js
│   │   └── pageTransitions.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
│
├── package.json
├── vite.config.js
└── README.md
```

---

## 3. Installation & Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Start Local Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:3000` in your web browser.

3. **Build for Production**:
   ```bash
   npm run build
   ```

4. **Preview Production Build**:
   ```bash
   npm run preview
   ```

---

## 4. Customization & Maintenance Guide

### Where to Replace Images
All imagery is organized into dedicated categories inside `public/images/`:
- **Hero Banners**: `public/images/hero/hero-1.webp`, `hero-2.webp`
- **Residence Cards**: `public/images/residences/hdb-1.webp`, `condo-1.webp`, `landed-1.webp`
- **Services Photography**: `public/images/services/`
- **Portfolio Projects**: `public/images/portfolio/`
- **Accreditation Badges**: `public/images/credentials/`

### Where to Modify Content & Copy
Structured, realistic interior design data is decoupled in `src/data/`:
- **Services & Specifications**: `src/data/services.js`
- **Portfolio Works & Categorization**: `src/data/projects.js`
- **Client Testimonials & Ratings**: `src/data/testimonials.js`
- **Frequently Asked Questions**: `src/data/faq.js`

### Where GSAP Animations Are Located
- **Hero Entrance & Ambient Pan**: `src/animations/heroAnimations.js`
- **ScrollTrigger, Stagger, Parallax & Reveals**: `src/animations/scrollAnimations.js`
- **Page Transitions**: `src/animations/pageTransitions.js`

---

## 5. Key Architectural Features

- **Transparent-to-Opaque Sticky Navbar**: Seamlessly transitions from transparent over the hero to backdrop-blurred with active navigation states and full-screen animated mobile menu.
- **Cinematic Full-Screen Hero**: Line-by-line staggered text reveal, slow continuous pan effect, and subtle scroll cue.
- **Editorial Residences Gallery**: Interactive large image cards with subtle zooms and upward content shift.
- **Interactive Vertical Services List**: Editorial text hierarchy with live synchronized preview panel.
- **Dynamic Portfolio with Filtering**: Smooth GSAP transitions when switching between All, HDB, Condo, Landed, and Commercial categories, along with a full modal detail view.
- **5-Phase Process Timeline**: Horizontal timeline on desktop with scroll-activated step highlights, converting to a clean vertical timeline on mobile.
- **Accordion FAQ**: Accessible ARIA accordions enforcing single-item expansion with smooth CSS height transitions.
- **Full Turnkey Consultation Booking**: Dedicated form with property type selectors, budget brackets, design style pre-population, and floor plan file upload preview.
