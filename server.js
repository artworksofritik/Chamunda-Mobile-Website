const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const BASE_DIR = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.mp4': 'video/mp4'
};

const server = http.createServer((req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = decodeURIComponent(url.pathname);

  // API Endpoints
  if (pathname === '/api/status') {
    const now = new Date();
    // IST is UTC + 5:30
    const istOffset = 5.5 * 60 * 60 * 1000;
    const istTime = new Date(now.getTime() + istOffset);
    const hours = istTime.getUTCHours();
    const minutes = istTime.getUTCMinutes();
    const currentDecimal = hours + (minutes / 60);

    // Store is open 10:00 AM to 9:30 PM (21.5)
    const isOpen = currentDecimal >= 10.0 && currentDecimal <= 21.5;

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      showroom: 'Chamunda Mobile Showroom',
      location: 'Sector-8, Airoli, Navi Mumbai',
      phones: ['+91 76205 75529', '+91 86906 89207'],
      hours: '10:00 AM - 9:30 PM (Mon - Sun)',
      isOpen: isOpen,
      currentTimeIST: istTime.toUTCString().replace('GMT', 'IST'),
      timestamp: Date.now()
    }));
    return;
  }

  if (pathname === '/api/enquiry' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const data = JSON.parse(body);
        const enquiriesFile = path.join(BASE_DIR, 'enquiries.json');
        let enquiries = [];
        if (fs.existsSync(enquiriesFile)) {
          try { enquiries = JSON.parse(fs.readFileSync(enquiriesFile, 'utf8')); } catch (e) {}
        }
        data.receivedAt = new Date().toISOString();
        data.id = 'ENQ-' + Date.now();
        enquiries.unshift(data);
        fs.writeFileSync(enquiriesFile, JSON.stringify(enquiries, null, 2));

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, message: 'Enquiry received successfully!', enquiryId: data.id }));
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, error: 'Invalid payload' }));
      }
    });
    return;
  }

  // Default to index.html
  if (pathname === '/') {
    pathname = '/index.html';
  }

  const filePath = path.join(BASE_DIR, pathname);

  // Security check: ensure path is within BASE_DIR
  if (!filePath.startsWith(BASE_DIR)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('403 Forbidden');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for client routing if not an asset
      if (!path.extname(pathname)) {
        const fallbackPath = path.join(BASE_DIR, 'index.html');
        fs.readFile(fallbackPath, (errFallback, content) => {
          if (errFallback) {
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else {
            res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(content);
          }
        });
        return;
      }
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('404 Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, {
      'Content-Type': contentType,
      'Cache-Control': 'no-cache',
      'Content-Length': stats.size
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`====================================================`);
  console.log(`  Chamunda Mobile Web Portal is LIVE on Localhost!  `);
  console.log(`  URL: http://localhost:${PORT}                      `);
  console.log(`  Serving from: ${BASE_DIR}                         `);
  console.log(`====================================================`);
});
