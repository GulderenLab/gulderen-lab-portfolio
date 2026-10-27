#!/usr/bin/env node
const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = 3000;
const HOST = 'localhost';

// MIME types for common files
const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.txt': 'text/plain'
};

function getMimeType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return mimeTypes[ext] || 'application/octet-stream';
}

const server = http.createServer((req, res) => {
    // Parse URL
    const parsedUrl = url.parse(req.url);
    let pathname = parsedUrl.pathname;
    
    // Default to index.html if root is requested
    if (pathname === '/') {
        pathname = '/index.html';
    }
    
    // Construct file path
    const filePath = path.join(__dirname, pathname);
    
    // Log the request
    console.log(`[${new Date().toISOString()}] ${req.method} ${pathname}`);
    
    // Check if file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            // File not found
            console.log(`   ❌ 404 - File not found: ${filePath}`);
            res.writeHead(404, { 'Content-Type': 'text/html' });
            res.end(`
                <html>
                    <body>
                        <h1>404 - Not Found</h1>
                        <p>The file <code>${pathname}</code> was not found.</p>
                        <p><a href="/">Go to Home</a></p>
                    </body>
                </html>
            `);
            return;
        }
        
        // Check if it's a directory
        fs.stat(filePath, (err, stats) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
                return;
            }
            
            if (stats.isDirectory()) {
                // Try to serve index.html from directory
                const indexPath = path.join(filePath, 'index.html');
                fs.access(indexPath, fs.constants.F_OK, (err) => {
                    if (err) {
                        // List directory contents
                        fs.readdir(filePath, (err, files) => {
                            if (err) {
                                res.writeHead(500, { 'Content-Type': 'text/plain' });
                                res.end('Error reading directory');
                                return;
                            }
                            
                            res.writeHead(200, { 'Content-Type': 'text/html' });
                            res.end(`
                                <html>
                                    <body>
                                        <h1>Directory listing: ${pathname}</h1>
                                        <ul>
                                            ${pathname !== '/' ? '<li><a href="../">../</a></li>' : ''}
                                            ${files.map(file => `<li><a href="${pathname}${pathname.endsWith('/') ? '' : '/'}${file}">${file}</a></li>`).join('')}
                                        </ul>
                                    </body>
                                </html>
                            `);
                        });
                    } else {
                        // Serve index.html
                        serveFile(indexPath, res);
                    }
                });
            } else {
                // Serve the file
                serveFile(filePath, res);
            }
        });
    });
});

function serveFile(filePath, res) {
    const mimeType = getMimeType(filePath);
    
    fs.readFile(filePath, (err, data) => {
        if (err) {
            console.log(`   ❌ Error reading file: ${err.message}`);
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('Error reading file');
            return;
        }
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        res.writeHead(200, { 
            'Content-Type': mimeType,
            'Content-Length': data.length
        });
        res.end(data);
        
        console.log(`   ✅ Served: ${path.basename(filePath)} (${mimeType}, ${data.length} bytes)`);
    });
}

// Start server
server.listen(PORT, HOST, () => {
    console.log('🚀 Server starting...');
    console.log(`📂 Serving directory: ${__dirname}`);
    console.log(`🌐 Server running at: http://${HOST}:${PORT}`);
    console.log(`🖼️  Test image at: http://${HOST}:${PORT}/data/images/genital_aciller/ga_1.png`);
    console.log(`🩺 Quiz at: http://${HOST}:${PORT}/quiz.html?quiz=genital-emergencies-quiz`);
    console.log(`🏠 Quiz Hub at: http://${HOST}:${PORT}/quiz-hub.html`);
    console.log('\n⏹️  Press Ctrl+C to stop the server');
    console.log('-'.repeat(80));
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.log(`❌ Port ${PORT} is already in use. Please stop the existing server or use a different port.`);
    } else {
        console.log(`❌ Error starting server: ${err.message}`);
    }
    process.exit(1);
});

process.on('SIGINT', () => {
    console.log('\n🛑 Server stopped by user');
    process.exit(0);
});