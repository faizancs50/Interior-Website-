async function runTests() {
  const BASE_URL = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  console.log('--- Starting Admin & API Test Suite ---\n');

  // 1. Health check
  console.log('1. API Health Check:');
  const healthRes = await fetch(`${BASE_URL}/api/health`);
  const health = await healthRes.json();
  assert(health.status === 'ok', 'Server health is ok');

  // 2. Public Projects List
  console.log('\n2. Public Projects:');
  const pubRes = await fetch(`${BASE_URL}/api/projects`);
  const pubData = await pubRes.json();
  assert(pubData.projects && pubData.projects.length >= 8, `Public projects returned (${pubData.count} items)`);
  assert(pubData.projects.every(p => p.status === 'published'), 'All public projects have status: published');

  // 3. Public Project Detail by Slug
  console.log('\n3. Public Project Detail:');
  const detailRes = await fetch(`${BASE_URL}/api/projects/modern-minimal-residence`);
  const detailData = await detailRes.json();
  assert(detailData.project && detailData.project.slug === 'modern-minimal-residence', 'Found project by slug');
  assert(Array.isArray(detailData.related), 'Related projects returned');

  // 4. Security: Unauthorized access rejected
  console.log('\n4. Security Checks:');
  const unauthRes = await fetch(`${BASE_URL}/api/projects/admin/all`);
  assert(unauthRes.status === 401, 'Unauthenticated request to /admin/all rejected with 401');

  const fakeTokenRes = await fetch(`${BASE_URL}/api/projects/admin/all`, {
    headers: { Authorization: 'Bearer fake_invalid_token_12345' }
  });
  assert(fakeTokenRes.status === 401, 'Fake token request rejected with 401');

  // 5. Authentication: Owner and Developer Login
  console.log('\n5. Admin Authentication:');
  // Wrong password
  const badLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'owner@carpenters.com.sg', password: 'WrongPassword!' })
  });
  assert(badLoginRes.status === 401, 'Bad credentials rejected with 401');

  // Owner login
  const ownerLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'owner@carpenters.com.sg', password: 'OwnerCarpenters2026!' })
  });
  const ownerLogin = await ownerLoginRes.json();
  assert(ownerLogin.token && ownerLogin.user.email === 'owner@carpenters.com.sg', 'Website Owner login succeeded');
  const ownerToken = ownerLogin.token;

  // Developer login
  const devLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'developer@carpenters.com.sg', password: 'DevCarpenters2026!' })
  });
  const devLogin = await devLoginRes.json();
  assert(devLogin.token && devLogin.user.email === 'developer@carpenters.com.sg', 'Website Developer login succeeded');

  // Verify /api/auth/me
  const meRes = await fetch(`${BASE_URL}/api/auth/me`, {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  const meData = await meRes.json();
  assert(meData.user && meData.user.role === 'admin', 'Auth session /me returns verified admin profile');

  // 6. Admin Project Management Workflow
  console.log('\n6. Project Lifecycle (Create, Draft Check, Publish, Update, Delete):');
  
  // Create a draft project
  const createRes = await fetch(`${BASE_URL}/api/projects/admin`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ownerToken}`
    },
    body: JSON.stringify({
      title: 'Automated Test Sky Penthouse',
      category: 'Residential',
      location: 'South Beach Residences',
      propertyType: 'Penthouse',
      style: 'Modern Minimalist',
      year: '2026',
      client: 'Test Client',
      area: '3,500 sqft',
      coverImage: '/images/hero/hero-1.webp',
      galleryImages: ['/images/hero/hero-1.webp', '/images/hero/hero-2.webp'],
      shortDescription: 'Exclusive test penthouse crafted for verification.',
      description: 'Full architectural layout review and custom millwork detailing.',
      featured: false,
      status: 'draft'
    })
  });
  const createData = await createRes.json();
  assert(createRes.status === 201 && createData.project.id, 'Created new project in database');
  const testProj = createData.project;

  // Verify draft is NOT visible in public list
  const pubCheckRes = await fetch(`${BASE_URL}/api/projects`);
  const pubCheck = await pubCheckRes.json();
  assert(!pubCheck.projects.some(p => p.id === testProj.id), 'Draft project is NOT visible on public website');

  // Publish project
  const pubToggleRes = await fetch(`${BASE_URL}/api/projects/admin/${testProj.id}/publish`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  const pubToggleData = await pubToggleRes.json();
  assert(pubToggleData.project.status === 'published', 'Project published via PATCH status toggle');

  // Verify project is NOW visible in public list
  const pubCheck2Res = await fetch(`${BASE_URL}/api/projects`);
  const pubCheck2 = await pubCheck2Res.json();
  assert(pubCheck2.projects.some(p => p.id === testProj.id), 'Published project is NOW visible on public website');

  // Verify public detail endpoint for this project
  const testDetailRes = await fetch(`${BASE_URL}/api/projects/${testProj.slug}`);
  const testDetailData = await testDetailRes.json();
  assert(testDetailData.project && testDetailData.project.title === 'Automated Test Sky Penthouse', 'Public detail page loads published project');

  // Toggle featured
  const featRes = await fetch(`${BASE_URL}/api/projects/admin/${testProj.id}/featured`, {
    method: 'PATCH',
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  const featData = await featRes.json();
  assert(featData.project.featured === true, 'Project marked as featured');

  // Update project
  const updateRes = await fetch(`${BASE_URL}/api/projects/admin/${testProj.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${ownerToken}`
    },
    body: JSON.stringify({
      title: 'Automated Test Sky Penthouse (Updated)',
      location: 'Sentosa Cove Luxury Waterfront'
    })
  });
  const updateData = await updateRes.json();
  assert(updateData.project.location === 'Sentosa Cove Luxury Waterfront', 'Project updated successfully');

  // Delete project
  const delRes = await fetch(`${BASE_URL}/api/projects/admin/${testProj.id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  assert(delRes.ok, 'Project deleted successfully');

  // Verify deletion from public site
  const pubCheck3Res = await fetch(`${BASE_URL}/api/projects`);
  const pubCheck3 = await pubCheck3Res.json();
  assert(!pubCheck3.projects.some(p => p.id === testProj.id), 'Deleted project no longer in public list');

  // 7. Admin Statistics
  console.log('\n7. Admin Stats Endpoint:');
  const statsRes = await fetch(`${BASE_URL}/api/projects/admin/stats`, {
    headers: { Authorization: `Bearer ${ownerToken}` }
  });
  const statsData = await statsRes.json();
  assert(typeof statsData.total === 'number' && typeof statsData.published === 'number', 'Admin dashboard statistics returned properly');

  console.log(`\n========================================`);
  console.log(`Test Suite Complete: ${passed} Passed, ${failed} Failed`);
  console.log(`========================================\n`);

  if (failed > 0) process.exit(1);
}

runTests().catch(err => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
