import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();

// ============================================================================
// Public Routes
// ============================================================================

// GET /api/projects (Only returns published projects)
router.get('/', (req, res) => {
  try {
    const { category } = req.query;
    const projects = db.getAllProjects({ includeDrafts: false, category });
    res.json({ projects, count: projects.length });
  } catch (err) {
    console.error('Error fetching public projects:', err);
    res.status(500).json({ error: 'Failed to retrieve projects.' });
  }
});

// GET /api/projects/:slug (Public project detail by slug)
router.get('/:slug', (req, res) => {
  try {
    const { slug } = req.params;
    const project = db.getProjectBySlug(slug);

    if (!project || project.status !== 'published') {
      return res.status(404).json({ error: 'Project not found or not published.' });
    }

    // Also find related projects in same category
    const related = db
      .getAllProjects({ includeDrafts: false })
      .filter((p) => p.id !== project.id && p.category === project.category)
      .slice(0, 3);

    res.json({ project, related });
  } catch (err) {
    console.error('Error fetching project by slug:', err);
    res.status(500).json({ error: 'Failed to retrieve project details.' });
  }
});

// ============================================================================
// Protected Admin Routes (Requires authMiddleware)
// ============================================================================

// GET /api/admin/stats
router.get('/admin/stats', authMiddleware, (req, res) => {
  try {
    const stats = db.getAdminStats();
    res.json(stats);
  } catch (err) {
    console.error('Error fetching admin stats:', err);
    res.status(500).json({ error: 'Failed to retrieve dashboard statistics.' });
  }
});

// GET /api/admin/projects (Returns all projects including drafts)
router.get('/admin/all', authMiddleware, (req, res) => {
  try {
    const projects = db.getAllProjects({ includeDrafts: true });
    res.json({ projects, count: projects.length });
  } catch (err) {
    console.error('Error fetching admin projects:', err);
    res.status(500).json({ error: 'Failed to retrieve admin projects.' });
  }
});

// GET /api/admin/projects/:id
router.get('/admin/detail/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const project = db.getProjectById(id);

    if (!project) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json({ project });
  } catch (err) {
    console.error('Error fetching admin project detail:', err);
    res.status(500).json({ error: 'Failed to retrieve project detail.' });
  }
});

// POST /api/admin/projects (Create new project)
router.post('/admin', authMiddleware, (req, res) => {
  try {
    const {
      title,
      category,
      location,
      propertyType,
      style,
      year,
      client,
      area,
      coverImage,
      galleryImages,
      shortDescription,
      description,
      featured,
      status,
      slug
    } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({ error: 'Project title is required.' });
    }

    const created = db.createProject({
      title: title.trim(),
      category: category || 'Residential',
      location: location || '',
      propertyType: propertyType || '',
      style: style || '',
      year: year || new Date().getFullYear().toString(),
      client: client || '',
      area: area || '',
      coverImage: coverImage || '/images/portfolio/project-1.webp',
      galleryImages: Array.isArray(galleryImages) ? galleryImages : [],
      shortDescription: shortDescription || '',
      description: description || '',
      featured: Boolean(featured),
      status: status === 'draft' ? 'draft' : 'published',
      slug: slug || title
    });

    res.status(201).json({
      message: 'Project created successfully.',
      project: created
    });
  } catch (err) {
    console.error('Error creating project:', err);
    res.status(500).json({ error: 'Failed to create project.' });
  }
});

// PUT /api/admin/projects/:id (Update project)
router.put('/admin/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const existing = db.getProjectById(id);

    if (!existing) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    const updated = db.updateProject(id, req.body);
    res.json({
      message: 'Project updated successfully.',
      project: updated
    });
  } catch (err) {
    console.error('Error updating project:', err);
    res.status(500).json({ error: 'Failed to update project.' });
  }
});

// DELETE /api/admin/projects/:id (Delete project)
router.delete('/admin/:id', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteProject(id);

    if (!success) {
      return res.status(404).json({ error: 'Project not found or already deleted.' });
    }

    res.json({ message: 'Project deleted successfully.' });
  } catch (err) {
    console.error('Error deleting project:', err);
    res.status(500).json({ error: 'Failed to delete project.' });
  }
});

// PATCH /api/admin/projects/:id/publish (Toggle publish/draft)
router.patch('/admin/:id/publish', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.togglePublish(id);

    if (!updated) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json({
      message: `Project ${updated.status === 'published' ? 'published' : 'saved as draft'} successfully.`,
      project: updated
    });
  } catch (err) {
    console.error('Error toggling project publish state:', err);
    res.status(500).json({ error: 'Failed to toggle project publish state.' });
  }
});

// PATCH /api/admin/projects/:id/featured (Toggle featured flag)
router.patch('/admin/:id/featured', authMiddleware, (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.toggleFeatured(id);

    if (!updated) {
      return res.status(404).json({ error: 'Project not found.' });
    }

    res.json({
      message: `Project ${updated.featured ? 'marked as featured' : 'unmarked from featured'} successfully.`,
      project: updated
    });
  } catch (err) {
    console.error('Error toggling project featured state:', err);
    res.status(500).json({ error: 'Failed to toggle featured state.' });
  }
});

export default router;
