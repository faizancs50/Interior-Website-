import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');
const UPLOADS_DIR = path.resolve(__dirname, '..', 'public', 'uploads');

// Ensure storage directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Initial seed projects (from current projectsData)
const initialProjects = [
  {
    id: 'modern-minimal-residence',
    title: 'Modern Minimal Residence',
    slug: 'modern-minimal-residence',
    category: 'Condo',
    location: 'Marina One Residences',
    propertyType: '3-Bedroom Luxury Apartment',
    style: 'Modern Minimalist',
    coverImage: '/images/portfolio/project-1.webp',
    galleryImages: [
      '/images/portfolio/project-1.webp',
      '/images/residences/condo-1.webp',
      '/images/hero/hero-2.webp'
    ],
    year: '2025',
    area: '1,540 sqft',
    shortDescription: 'A serene urban retreat characterized by continuous microcement textures and monolithic travertine accents.',
    description: 'A serene urban retreat characterized by continuous microcement textures, concealed architectural doors, and monolithic travertine accents. Designed for seamless everyday comfort with bespoke concealed storage and ambient cove lighting.',
    client: 'Private Owner',
    featured: true,
    status: 'published',
    createdAt: '2025-01-15T08:00:00.000Z',
    updatedAt: '2025-01-15T08:00:00.000Z'
  },
  {
    id: 'contemporary-family-home',
    title: 'Contemporary Family Home',
    slug: 'contemporary-family-home',
    category: 'Landed',
    location: 'Bukit Timah Estate',
    propertyType: 'Semi-Detached Landed House',
    style: 'Contemporary Architectural',
    coverImage: '/images/portfolio/project-2.webp',
    galleryImages: [
      '/images/portfolio/project-2.webp',
      '/images/residences/landed-1.webp',
      '/images/services/landed.webp'
    ],
    year: '2025',
    area: '4,200 sqft',
    shortDescription: 'Generous multi-generational spatial planning integrating double-volume lightwells and custom walnut millwork.',
    description: 'Generous multi-generational spatial planning integrating double-volume lightwells, custom walnut millwork, and private landscaped courtyard views. Every floor features customized joinery engineered in our direct Singapore factory.',
    client: 'The Tan Family',
    featured: true,
    status: 'published',
    createdAt: '2025-02-10T09:30:00.000Z',
    updatedAt: '2025-02-10T09:30:00.000Z'
  },
  {
    id: 'warm-japandi-interior',
    title: 'Warm Japandi Interior',
    slug: 'warm-japandi-interior',
    category: 'HDB',
    location: 'Tampines GreenVerdant',
    propertyType: '5-Room BTO Flat',
    style: 'Japandi & Wabi-Sabi',
    coverImage: '/images/portfolio/project-3.webp',
    galleryImages: [
      '/images/portfolio/project-3.webp',
      '/images/residences/hdb-1.webp',
      '/images/services/hdb.webp'
    ],
    year: '2024',
    area: '1,216 sqft',
    shortDescription: 'Harmonious interplay of pale oak, natural lime-wash wall finishes, and tatami-inspired platform storage.',
    description: 'Harmonious interplay of pale oak, natural lime-wash wall finishes, tatami-inspired platform storage, and gentle ambient cove lighting. Complete spatial reconfiguration transforming standard BTO compartments into an expansive open gallery.',
    client: 'Marcus & Cheryl',
    featured: true,
    status: 'published',
    createdAt: '2024-11-20T10:15:00.000Z',
    updatedAt: '2024-11-20T10:15:00.000Z'
  },
  {
    id: 'luxury-urban-residence',
    title: 'Luxury Urban Residence',
    slug: 'luxury-urban-residence',
    category: 'Condo',
    location: 'The Nassim',
    propertyType: '4-Bedroom Penthouse',
    style: 'Quiet Luxury',
    coverImage: '/images/portfolio/project-4.webp',
    galleryImages: [
      '/images/portfolio/project-4.webp',
      '/images/services/condo.webp',
      '/images/hero/hero-1.webp'
    ],
    year: '2024',
    area: '2,850 sqft',
    shortDescription: 'Rich dark walnut finishes, bookmatched Italian Statuario marble, and temperature-controlled wine displays.',
    description: 'Rich dark walnut finishes, bookmatched Italian Statuario marble, brushed bronze hardware, and temperature-controlled custom wine displays. Crafted with discreet luxury details and integrated smart-home automation.',
    client: 'C-Suite Executive',
    featured: true,
    status: 'published',
    createdAt: '2024-09-05T14:20:00.000Z',
    updatedAt: '2024-09-05T14:20:00.000Z'
  },
  {
    id: 'refined-waterfront-penthouse',
    title: 'Refined Waterfront Penthouse',
    slug: 'refined-waterfront-penthouse',
    category: 'Condo',
    location: 'Corals at Keppel Bay',
    propertyType: 'Duplex Penthouse',
    style: 'Coastal Modern',
    coverImage: '/images/portfolio/project-5.webp',
    galleryImages: [
      '/images/portfolio/project-5.webp',
      '/images/services/condo.webp'
    ],
    year: '2024',
    area: '3,100 sqft',
    shortDescription: 'Sweeping sea views echoed through light travertine floors and organic curvature in ceiling coves.',
    description: 'Sweeping sea views echoed through light travertine floors, organic curvature in ceiling coves, and bespoke floating cabinetry. Uncompromising materiality crafted to withstand coastal humidity.',
    client: 'Private Collector',
    featured: false,
    status: 'published',
    createdAt: '2024-08-12T11:00:00.000Z',
    updatedAt: '2024-08-12T11:00:00.000Z'
  },
  {
    id: 'heritage-resale-reinvention',
    title: 'Heritage Resale Reinvention',
    slug: 'heritage-resale-reinvention',
    category: 'HDB',
    location: 'Tiong Bahru Estate',
    propertyType: 'Executive Resale Flat',
    style: 'Mid-Century Contemporary',
    coverImage: '/images/residences/hdb-1.webp',
    galleryImages: [
      '/images/residences/hdb-1.webp',
      '/images/portfolio/project-3.webp'
    ],
    year: '2024',
    area: '1,380 sqft',
    shortDescription: 'Full gut renovation merging compartmentalized rooms into a panoramic open-concept living gallery.',
    description: 'Full gut renovation merging two compartmentalized rooms into a panoramic open-concept living gallery with restored terrazzo sensibilities and custom micro-fluted oak partitions.',
    client: 'Design Director',
    featured: false,
    status: 'published',
    createdAt: '2024-06-18T16:40:00.000Z',
    updatedAt: '2024-06-18T16:40:00.000Z'
  },
  {
    id: 'atelier-commercial-loft',
    title: 'Atelier & Commercial Loft',
    slug: 'atelier-commercial-loft',
    category: 'Commercial',
    location: 'Orchard Road',
    propertyType: 'Boutique Creative Studio',
    style: 'Industrial Luxe',
    coverImage: '/images/services/commercial.webp',
    galleryImages: [
      '/images/services/commercial.webp',
      '/images/hero/hero-2.webp'
    ],
    year: '2025',
    area: '2,600 sqft',
    shortDescription: 'Modular timber acoustic pods, integrated presentation walls, and a welcoming hospitality bar.',
    description: 'Modular timber acoustic pods, integrated presentation walls, and a welcoming hospitality bar designed for client gatherings and creative collaboration.',
    client: 'Venture Capital Atelier',
    featured: false,
    status: 'published',
    createdAt: '2025-01-08T13:10:00.000Z',
    updatedAt: '2025-01-08T13:10:00.000Z'
  },
  {
    id: 'coronation-sanctuary',
    title: 'Coronation Sanctuary',
    slug: 'coronation-sanctuary',
    category: 'Landed',
    location: 'Coronation Road West',
    propertyType: 'Good Class Bungalow',
    style: 'Timeless Monolithic',
    coverImage: '/images/residences/landed-1.webp',
    galleryImages: [
      '/images/residences/landed-1.webp',
      '/images/portfolio/project-2.webp'
    ],
    year: '2025',
    area: '6,800 sqft',
    shortDescription: 'Monolithic stone islands, concealed automated glass sliders, and tranquil water feature vistas.',
    description: 'A masterclass in indoor-outdoor fluidity featuring monolithic stone islands, concealed automated glass sliders, and tranquil water feature vistas. Designed for multi-generational living.',
    client: 'Dr. & Mrs. Low',
    featured: true,
    status: 'published',
    createdAt: '2025-02-28T17:00:00.000Z',
    updatedAt: '2025-02-28T17:00:00.000Z'
  }
];

class Database {
  constructor() {
    this.data = { users: [], projects: [] };
    this.init();
  }

  init() {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        this.data = JSON.parse(raw);
      } catch (err) {
        console.error('Error reading db.json, creating new database state:', err);
        this.data = { users: [], projects: [] };
      }
    }

    // Ensure the TWO authorized admin users exist
    this.ensureAdminUsers();

    // Ensure initial projects exist
    if (!this.data.projects || this.data.projects.length === 0) {
      this.data.projects = initialProjects;
      this.save();
    }
  }

  ensureAdminUsers() {
    const ownerEmail = (process.env.ADMIN_OWNER_EMAIL || 'owner@carpenters.com.sg').toLowerCase();
    const ownerPassword = process.env.ADMIN_OWNER_PASSWORD || 'OwnerCarpenters2026!';
    const devEmail = (process.env.ADMIN_DEV_EMAIL || 'developer@carpenters.com.sg').toLowerCase();
    const devPassword = process.env.ADMIN_DEV_PASSWORD || 'DevCarpenters2026!';

    if (!Array.isArray(this.data.users)) {
      this.data.users = [];
    }

    // 1. Website Owner / Client
    let owner = this.data.users.find((u) => u.email.toLowerCase() === ownerEmail);
    if (!owner) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(ownerPassword, salt);
      owner = {
        id: 'admin-owner',
        name: 'Website Owner / Client',
        email: ownerEmail,
        passwordHash,
        role: 'admin',
        title: 'Managing Director & Client Lead',
        createdAt: new Date().toISOString()
      };
      this.data.users.push(owner);
    }

    // 2. Website Developer
    let dev = this.data.users.find((u) => u.email.toLowerCase() === devEmail);
    if (!dev) {
      const salt = bcrypt.genSaltSync(10);
      const passwordHash = bcrypt.hashSync(devPassword, salt);
      dev = {
        id: 'admin-dev',
        name: 'Website Developer',
        email: devEmail,
        passwordHash,
        role: 'admin',
        title: 'Lead Architect & Fullstack Engineer',
        createdAt: new Date().toISOString()
      };
      this.data.users.push(dev);
    }

    this.save();
  }

  save() {
    try {
      const tmpPath = `${DB_FILE}.tmp`;
      fs.writeFileSync(tmpPath, JSON.stringify(this.data, null, 2), 'utf-8');
      fs.renameSync(tmpPath, DB_FILE);
    } catch (err) {
      console.error('Error saving db.json:', err);
    }
  }

  // --- User Methods ---
  findUserByEmail(email) {
    if (!email) return null;
    return this.data.users.find(
      (u) => u.email.toLowerCase() === email.trim().toLowerCase()
    );
  }

  findUserById(id) {
    return this.data.users.find((u) => u.id === id);
  }

  // --- Slug Generator ---
  generateSlug(title, currentId = null) {
    let baseSlug = (title || 'untitled-project')
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');

    if (!baseSlug) baseSlug = 'project';

    let uniqueSlug = baseSlug;
    let counter = 1;

    while (
      this.data.projects.some(
        (p) => p.slug === uniqueSlug && p.id !== currentId
      )
    ) {
      uniqueSlug = `${baseSlug}-${counter}`;
      counter++;
    }

    return uniqueSlug;
  }

  // --- Project Methods ---
  getAllProjects({ includeDrafts = false, category = null } = {}) {
    let list = this.data.projects || [];
    if (!includeDrafts) {
      list = list.filter((p) => p.status === 'published');
    }
    if (category && category !== 'All') {
      list = list.filter(
        (p) => p.category && p.category.toLowerCase() === category.toLowerCase()
      );
    }
    // Return sorted by updatedAt descending
    return list.slice().sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt));
  }

  getProjectBySlug(slug) {
    if (!slug) return null;
    return this.data.projects.find((p) => p.slug === slug);
  }

  getProjectById(id) {
    return this.data.projects.find((p) => p.id === id);
  }

  createProject(data) {
    const now = new Date().toISOString();
    const id = data.id || `proj_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const slug = data.slug ? this.generateSlug(data.slug) : this.generateSlug(data.title || 'project');

    const newProject = {
      id,
      title: data.title || 'Untitled Project',
      slug,
      category: data.category || 'Residential',
      location: data.location || '',
      propertyType: data.propertyType || '',
      style: data.style || '',
      year: data.year || new Date().getFullYear().toString(),
      client: data.client || '',
      area: data.area || '',
      coverImage: data.coverImage || '/images/portfolio/project-1.webp',
      galleryImages: Array.isArray(data.galleryImages) ? data.galleryImages : [],
      shortDescription: data.shortDescription || '',
      description: data.description || '',
      featured: Boolean(data.featured),
      status: data.status === 'draft' ? 'draft' : 'published',
      createdAt: now,
      updatedAt: now
    };

    this.data.projects.unshift(newProject);
    this.save();
    return newProject;
  }

  updateProject(id, data) {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;

    const existing = this.data.projects[index];
    const now = new Date().toISOString();

    let slug = existing.slug;
    if (data.title && data.title !== existing.title && !data.slug) {
      slug = this.generateSlug(data.title, id);
    } else if (data.slug && data.slug !== existing.slug) {
      slug = this.generateSlug(data.slug, id);
    }

    const updated = {
      ...existing,
      ...data,
      id,
      slug,
      updatedAt: now
    };

    this.data.projects[index] = updated;
    this.save();
    return updated;
  }

  deleteProject(id) {
    const index = this.data.projects.findIndex((p) => p.id === id);
    if (index === -1) return false;

    this.data.projects.splice(index, 1);
    this.save();
    return true;
  }

  togglePublish(id) {
    const project = this.getProjectById(id);
    if (!project) return null;
    const newStatus = project.status === 'published' ? 'draft' : 'published';
    return this.updateProject(id, { status: newStatus });
  }

  toggleFeatured(id) {
    const project = this.getProjectById(id);
    if (!project) return null;
    return this.updateProject(id, { featured: !project.featured });
  }

  getAdminStats() {
    const projects = this.data.projects || [];
    const total = projects.length;
    const published = projects.filter((p) => p.status === 'published').length;
    const draft = projects.filter((p) => p.status === 'draft').length;
    const featured = projects.filter((p) => p.featured).length;
    const recent = projects
      .slice()
      .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
      .slice(0, 5);

    return { total, published, draft, featured, recent };
  }
}

export const db = new Database();
