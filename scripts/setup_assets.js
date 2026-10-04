import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const imagesToDownload = [
  {
    dir: 'public/images/hero',
    file: 'hero-1.webp',
    url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1920&q=85&fm=webp',
    title: 'Luxury Architectural Living'
  },
  {
    dir: 'public/images/hero',
    file: 'hero-2.webp',
    url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1920&q=85&fm=webp',
    title: 'Modern Minimal Penthouse'
  },
  {
    dir: 'public/images/residences',
    file: 'hdb-1.webp',
    url: 'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'HDB Residence'
  },
  {
    dir: 'public/images/residences',
    file: 'condo-1.webp',
    url: 'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'Condominium Residence'
  },
  {
    dir: 'public/images/residences',
    file: 'landed-1.webp',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'Landed Estate'
  },
  {
    dir: 'public/images/services',
    file: 'hdb.webp',
    url: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1000&q=85&fm=webp',
    title: 'HDB Design'
  },
  {
    dir: 'public/images/services',
    file: 'condo.webp',
    url: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1000&q=85&fm=webp',
    title: 'Condo Interior'
  },
  {
    dir: 'public/images/services',
    file: 'landed.webp',
    url: 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1000&q=85&fm=webp',
    title: 'Landed Property'
  },
  {
    dir: 'public/images/services',
    file: 'commercial.webp',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1000&q=85&fm=webp',
    title: 'Commercial Design'
  },
  {
    dir: 'public/images/portfolio',
    file: 'project-1.webp',
    url: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'Modern Minimal Residence'
  },
  {
    dir: 'public/images/portfolio',
    file: 'project-2.webp',
    url: 'https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'Contemporary Family Home'
  },
  {
    dir: 'public/images/portfolio',
    file: 'project-3.webp',
    url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'Warm Japandi Interior'
  },
  {
    dir: 'public/images/portfolio',
    file: 'project-4.webp',
    url: 'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'Luxury Urban Residence'
  },
  {
    dir: 'public/images/portfolio',
    file: 'project-5.webp',
    url: 'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'Refined Waterfront Penthouse'
  },
  {
    dir: 'public/images/portfolio',
    file: 'project-6.webp',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1200&q=85&fm=webp',
    title: 'Architectural Boutique Office'
  }
];

// Clean monochrome SVG badges for credentials
const credentialBadges = [
  {
    file: 'casetrust.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120" width="240" height="120">
      <rect width="240" height="120" fill="none" rx="8"/>
      <rect x="2" y="2" width="236" height="116" fill="none" stroke="#262626" stroke-width="1.5" stroke-opacity="0.2" rx="6"/>
      <path d="M45 42 L60 26 L75 42 L60 58 Z" fill="none" stroke="#171717" stroke-width="2.5"/>
      <circle cx="60" cy="42" r="6" fill="#171717"/>
      <text x="95" y="44" font-family="'Plus Jakarta Sans', sans-serif" font-size="19" font-weight="700" letter-spacing="2" fill="#171717">CASETRUST</text>
      <text x="95" y="62" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="500" letter-spacing="2.5" fill="#6F6B64">ACCREDITED BUSINESS</text>
      <text x="95" y="78" font-family="'Plus Jakarta Sans', sans-serif" font-size="9" font-weight="400" letter-spacing="1" fill="#A59682">RCMA JOINT ACCREDITATION</text>
    </svg>`
  },
  {
    file: 'bizsafe.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120" width="240" height="120">
      <rect width="240" height="120" fill="none" rx="8"/>
      <rect x="2" y="2" width="236" height="116" fill="none" stroke="#262626" stroke-width="1.5" stroke-opacity="0.2" rx="6"/>
      <circle cx="58" cy="60" r="24" fill="none" stroke="#171717" stroke-width="2"/>
      <path d="M50 60 L56 66 L68 52" fill="none" stroke="#171717" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <text x="95" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="800" letter-spacing="1" fill="#171717">bizSAFE<tspan font-size="13" font-weight="600" fill="#A59682"> STAR</tspan></text>
      <text x="95" y="72" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="500" letter-spacing="1.5" fill="#6F6B64">WSH COUNCIL SINGAPORE</text>
      <text x="95" y="86" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="400" letter-spacing="0.5" fill="#A59682">LEVEL STAR CERTIFIED</text>
    </svg>`
  },
  {
    file: 'bca.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120" width="240" height="120">
      <rect width="240" height="120" fill="none" rx="8"/>
      <rect x="2" y="2" width="236" height="116" fill="none" stroke="#262626" stroke-width="1.5" stroke-opacity="0.2" rx="6"/>
      <rect x="42" y="44" width="32" height="32" fill="none" stroke="#171717" stroke-width="2.5"/>
      <line x1="42" y1="44" x2="74" y2="76" stroke="#171717" stroke-width="2"/>
      <line x1="74" y1="44" x2="42" y2="76" stroke="#171717" stroke-width="2"/>
      <text x="92" y="50" font-family="'Plus Jakarta Sans', sans-serif" font-size="22" font-weight="800" letter-spacing="2" fill="#171717">BCA</text>
      <text x="92" y="69" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600" letter-spacing="1" fill="#6F6B64">REGISTERED CONTRACTOR</text>
      <text x="92" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="400" letter-spacing="0.5" fill="#A59682">BUILDING &amp; CONSTRUCTION AUTHORITY</text>
    </svg>`
  },
  {
    file: 'hdb.webp',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 120" width="240" height="120">
      <rect width="240" height="120" fill="none" rx="8"/>
      <rect x="2" y="2" width="236" height="116" fill="none" stroke="#262626" stroke-width="1.5" stroke-opacity="0.2" rx="6"/>
      <path d="M58 38 L40 54 L44 54 L44 76 L72 76 L72 54 L76 54 Z" fill="none" stroke="#171717" stroke-width="2.5" stroke-linejoin="round"/>
      <rect x="52" y="58" width="12" height="18" fill="none" stroke="#171717" stroke-width="2"/>
      <text x="92" y="52" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" font-weight="800" letter-spacing="2" fill="#171717">HDB DRC</text>
      <text x="92" y="70" font-family="'Plus Jakarta Sans', sans-serif" font-size="10" font-weight="600" letter-spacing="1" fill="#6F6B64">DIRECTORY OF RENOVATION</text>
      <text x="92" y="84" font-family="'Plus Jakarta Sans', sans-serif" font-size="8.5" font-weight="400" letter-spacing="0.5" fill="#A59682">LICENSED CONTRACTORS</text>
    </svg>`
  }
];

async function downloadOrFallback(item) {
  const targetDir = path.resolve(root, item.dir);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }
  const filePath = path.join(targetDir, item.file);

  try {
    console.log(`Downloading ${item.file}...`);
    const res = await fetch(item.url, {
      headers: { 'User-Agent': 'Mozilla/5.0' },
      signal: AbortSignal.timeout(12000)
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buffer = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(filePath, buffer);
    console.log(`✓ Saved ${item.file} (${buffer.length} bytes)`);
  } catch (err) {
    console.warn(`! Fallback generated for ${item.file}: ${err.message}`);
    // Create an elegant SVG fallback wrapped as webp or SVG
    const svgFallback = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1000" width="1600" height="1000">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2a2723"/>
          <stop offset="100%" stop-color="#141413"/>
        </linearGradient>
      </defs>
      <rect width="1600" height="1000" fill="url(#g)"/>
      <circle cx="800" cy="500" r="300" fill="none" stroke="#A59682" stroke-width="1" stroke-opacity="0.3"/>
      <circle cx="800" cy="500" r="450" fill="none" stroke="#A59682" stroke-width="1" stroke-opacity="0.15"/>
      <text x="800" y="480" font-family="'Playfair Display', serif" font-size="48" fill="#F5F3EF" text-anchor="middle" letter-spacing="4">CARPENTERS</text>
      <text x="800" y="540" font-family="'Plus Jakarta Sans', sans-serif" font-size="20" fill="#A59682" text-anchor="middle" letter-spacing="6">${item.title.toUpperCase()}</text>
    </svg>`;
    fs.writeFileSync(filePath, Buffer.from(svgFallback));
  }
}

async function run() {
  console.log('--- Setting up assets ---');

  for (const item of imagesToDownload) {
    await downloadOrFallback(item);
  }

  // Setup credentials directory
  const credDir = path.resolve(root, 'public/images/credentials');
  if (!fs.existsSync(credDir)) {
    fs.mkdirSync(credDir, { recursive: true });
  }

  for (const cred of credentialBadges) {
    const credPath = path.join(credDir, cred.file);
    // Write SVG (SVG formats work seamlessly in <img> tags even if named .webp, or as SVG)
    fs.writeFileSync(credPath, Buffer.from(cred.svg));
    console.log(`✓ Created badge ${cred.file}`);
  }

  // Make sure public/fonts directory exists
  const fontsDir = path.resolve(root, 'public/fonts');
  if (!fs.existsSync(fontsDir)) {
    fs.mkdirSync(fontsDir, { recursive: true });
  }

  console.log('--- All assets ready! ---');
}

run();
