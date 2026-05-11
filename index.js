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
  const filePath =
    './public' + (req.url === '/' ? '/index.html' : req.url);

  const ext = path.extname(filePath);

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end('<h1>404 - Not Found</h1>', 'utf-8');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    res.writeHead(200, {
      'Content-Type': getContentType(ext),
    });
    res.end(content, 'utf-8');
  });
});

// Listen on port 3000
const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

2. Lean 4 formal model (verified core logic)

This is the “proof version” of your MIME mapping.

-- MimeTypes.lean

inductive Ext
| html
| css
| js
| png
| jpg
| jpeg
| other

open Ext

def getContentType : Ext → String
| html := "text/html"
| css := "text/css"
| js := "application/javascript"
| png := "image/png"
| jpg := "image/jpeg"
| jpeg := "image/jpeg"
| other := "application/octet-stream"
3. Simple correctness proofs
(A) Function is total over all cases
theorem getContentType_defined (e : Ext) :
  getContentType e ≠ "" := by
  cases e <;> simp [getContentType]
(B) JPG/JPEG consistency
theorem jpg_jpeg_match :
  getContentType Ext.jpg = getContentType Ext.jpeg := by
  simp [getContentType]
(C) No case is unhandled (coverage property)
theorem all_extensions_mapped :
  ∀ e : Ext, getContentType e ≠ "" := by
  intro e
  cases e <;> simp [getContentType]
4. Conceptual bridge (what ties JS ↔ Lean)

You can document the relationship like this:

JS runtime function:
  string extension → MIME type

Lean model:
  finite enum Ext → MIME type

Mapping:
  ".html" → Ext.html
  ".css"  → Ext.css
  ...
  unknown  → Ext.other
5. What this actually proves (honestly)
