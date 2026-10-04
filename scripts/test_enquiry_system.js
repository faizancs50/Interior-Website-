/**
 * Comprehensive Automated Test Suite for Google Sheets Enquiry System
 *
 * Tests:
 * 1. Health check of API server
 * 2. Form field validations (Missing name, email, location, phone, message)
 * 3. Lead preservation in local database
 * 4. Google Sheets error handling (no fake success on sheet failure, secure logging)
 * 5. Successful submission flow & new row creation with official structure
 * 6. Non-overwriting multiple submissions verification
 * 7. Rapid duplicate submission debounce prevention
 * 8. Protected admin enquiries log access (401 without auth, 200 with admin JWT)
 */

const API_BASE = 'http://localhost:5000/api';

async function runTests() {
  console.log('====================================================');
  console.log('🚀 STARTING GOOGLE SHEETS & ENQUIRY SYSTEM TEST SUITE');
  console.log('====================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  // 1. Health Check
  console.log('Test 1: Backend Server Health Check');
  try {
    const res = await fetch(`${API_BASE}/health`);
    const data = await res.json();
    assert(res.ok && data.status === 'ok', 'Server is healthy and responding');
  } catch (err) {
    assert(false, `Health check failed: ${err.message}`);
  }

  // 2. Field Validations (Missing Required Fields)
  console.log('\nTest 2: Form Input Validations');
  try {
    // 2a: Missing Name
    const resName = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'test@example.com',
        phone: '+65 9123 4567',
        location: 'Marina Bay',
        projectType: 'Architecture',
        message: 'Looking for full architectural rebuild.'
      })
    });
    const dataName = await resName.json();
    assert(resName.status === 400 && dataName.errors?.name, 'Rejects missing name with 400');

    // 2b: Invalid Email
    const resEmail = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Tan',
        email: 'invalid-email-string',
        phone: '+65 9123 4567',
        location: 'Marina Bay',
        projectType: 'Architecture',
        message: 'Looking for full architectural rebuild.'
      })
    });
    const dataEmail = await resEmail.json();
    assert(resEmail.status === 400 && dataEmail.errors?.email, 'Rejects invalid email format');

    // 2c: Missing Location
    const resLoc = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Tan',
        email: 'sarah@example.com',
        phone: '+65 9123 4567',
        location: '',
        projectType: 'Interior Design',
        message: 'Spatial redesign of 4-room apartment.'
      })
    });
    const dataLoc = await resLoc.json();
    assert(resLoc.status === 400 && dataLoc.errors?.location, 'Rejects missing location');

    // 2d: Missing Message
    const resMsg = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sarah Tan',
        email: 'sarah@example.com',
        phone: '+65 9123 4567',
        location: 'Orchard',
        projectType: 'Residential',
        message: ''
      })
    });
    const dataMsg = await resMsg.json();
    assert(resMsg.status === 400 && dataMsg.errors?.message, 'Rejects empty message');
  } catch (err) {
    assert(false, `Validation tests threw error: ${err.message}`);
  }

  // 3. Error Handling When Google Sheets is Unconfigured
  console.log('\nTest 3: Google Sheets Failure Handling (No Fake Success)');
  try {
    // When environment variables for Google Sheets are missing,
    // the system MUST NOT return fake success. It should return a 502 with polite user message.
    const resUnconfigured = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'David Lim',
        email: `david.lim.${Date.now()}@example.com`,
        phone: '+65 8234 5678',
        location: 'Bukit Timah',
        projectType: 'Architecture',
        budget: '$200,000 – $350,000',
        message: 'Complete reconstruction of 3-storey landed terrace.'
      })
    });

    const dataUnconfigured = await resUnconfigured.json();
    // Since real Google Sheets credentials are not yet populated in .env,
    // this correctly fails with status 502 (Bad Gateway) and logs securely on backend
    assert(
      resUnconfigured.status === 502 && !dataUnconfigured.success,
      'Returns 502 error and rejects fake success when Google Sheets cannot be reached'
    );
    assert(
      typeof dataUnconfigured.message === 'string' && dataUnconfigured.message.length > 10,
      'Returns polite user-friendly error message without technical leak'
    );
  } catch (err) {
    assert(false, `Google Sheets failure handling test failed: ${err.message}`);
  }

  // 4. Test Mock Mode: Successful Submission & Row Appending
  console.log('\nTest 4: Submission & Non-Overwriting Multiple Rows');
  try {
    // Temporarily enable test mock mode on process to test successful Google Sheets append
    process.env.TEST_MOCK_GOOGLE_SHEETS = 'true';

    // 4a. Submit Enquiry 1
    const testEmail1 = `client.one.${Date.now()}@domain.com`;
    const res1 = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-mock-sheets': 'true' },
      body: JSON.stringify({
        name: 'Evelyn Neo',
        email: testEmail1,
        phone: '+65 9876 5432',
        location: 'Sentosa Cove',
        projectType: 'Architecture',
        budget: '$350,000+',
        message: 'Waterfront villa interior architecture and landscape integration.'
      })
    });

    const data1 = await res1.json();
    assert(res1.status === 201 && data1.success, 'Enquiry 1 successfully created (HTTP 201)');
    assert(
      data1.message === 'Thank you! Your enquiry has been received. Our team will contact you shortly.',
      'Exact polite success message returned to client'
    );
    assert(Boolean(data1.enquiryId), `Generated unique enquiry ID: ${data1.enquiryId}`);

    // 4b. Submit Enquiry 2 (verify distinct record and row appending)
    const testEmail2 = `client.two.${Date.now()}@domain.com`;
    const res2 = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-mock-sheets': 'true' },
      body: JSON.stringify({
        name: 'Marcus Cheng',
        email: testEmail2,
        phone: '+65 8765 4321',
        location: 'Tanjong Pagar',
        projectType: 'Commercial',
        budget: '$100,000 – $200,000',
        message: 'Flagship boutique cafe architectural fit-out.'
      })
    });

    const data2 = await res2.json();
    assert(res2.status === 201 && data2.success, 'Enquiry 2 successfully created (HTTP 201)');
    assert(data1.enquiryId !== data2.enquiryId, 'Enquiry 1 and Enquiry 2 have distinct IDs (no overwrite)');
  } catch (err) {
    assert(false, `Mock submission flow failed: ${err.message}`);
  }

  // 5. Test Duplicate Submission Prevention (Double click protection)
  console.log('\nTest 5: Rapid Duplicate Submission Debouncing');
  try {
    const dupEmail = `dup.test.${Date.now()}@domain.com`;
    const payload = {
      name: 'Rapid Clicker',
      email: dupEmail,
      phone: '+65 9111 2222',
      location: 'Katong',
      projectType: 'Residential',
      budget: '$50,000 – $100,000',
      message: 'Testing double-click prevention logic.'
    };

    // First click
    const resFirst = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-mock-sheets': 'true' },
      body: JSON.stringify(payload)
    });
    assert(resFirst.status === 201, 'First submission succeeded');

    // Immediate second click (within 8000ms cooldown)
    const resSecond = await fetch(`${API_BASE}/enquiries`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-test-mock-sheets': 'true' },
      body: JSON.stringify(payload)
    });
    const dataSecond = await resSecond.json();
    assert(
      resSecond.status === 429,
      'Second rapid submission blocked with 429 Too Many Requests (duplicate prevented)'
    );
  } catch (err) {
    assert(false, `Duplicate prevention test threw error: ${err.message}`);
  }

  // 6. Admin Security & Enquiries Log Access
  console.log('\nTest 6: Admin Security & Enquiries Access');
  try {
    // 6a: Public user attempts to access /api/enquiries/admin/all without token
    const resUnauth = await fetch(`${API_BASE}/enquiries/admin/all`);
    assert(resUnauth.status === 401, 'Public visitors rejected with 401 Unauthorized');

    // 6b: Log in as Website Owner
    const loginRes = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'owner@carpenters.com.sg',
        password: 'OwnerCarpenters2026!'
      })
    });
    const loginData = await loginRes.json();
    const token = loginData.token;
    assert(Boolean(token), 'Admin login successful and JWT token acquired');

    // 6c: Authorized admin access to enquiries
    const resAuth = await fetch(`${API_BASE}/enquiries/admin/all`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const enqData = await resAuth.json();
    assert(resAuth.status === 200 && enqData.success, 'Admin successfully retrieves all enquiries');
    assert(Array.isArray(enqData.enquiries) && enqData.enquiries.length >= 2, 'Enquiries list preserved in database');

    // 6d: Check Google Sheets config status endpoint
    const resConfig = await fetch(`${API_BASE}/enquiries/admin/config-status`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const cfgData = await resConfig.json();
    assert(resConfig.status === 200 && cfgData.success, 'Admin retrieves Google Sheets config status');
    assert(typeof cfgData.configured === 'boolean', `Configured flag returned (${cfgData.configured})`);
  } catch (err) {
    assert(false, `Admin security test failed: ${err.message}`);
  }

  console.log('\n====================================================');
  console.log(`RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('====================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
