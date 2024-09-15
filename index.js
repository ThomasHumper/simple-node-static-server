// server.js
const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to determine the correct MIME type
function getContentType(ext) {
  switch (ext) {
    case '.html':
      return 'text/html';
    case '.css':
      return 'text/css';
    case '.js':
      return 'application/javascript';
    case '.png':
      return 'image/png';
    case '.jpg':
    case '.jpeg':
      return 'image/jpeg';
    default:
      return 'application/octet-stream';
  }
}

const server = http.createServer((req, res) => {
  let filePath = './public' + (req.url === '/' ? '/index.html' : req.url);
  const ext = path.extname(filePath);

  // Serve the requested file
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500);
        res.end(`Server Error: ${err.code}`);
      }
    } else {
      res.writeHead(200, { 'Content-Type': getContentType(ext) });
      res.end(content, 'utf-8');
    }
  });
});

// Listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
