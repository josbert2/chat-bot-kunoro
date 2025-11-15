#!/usr/bin/env node

/**
 * Servidor simple para probar la API Bearer
 * Sirve el archivo test-api.html sin problemas de CORS
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 8888;
const HOST = 'localhost';

// MIME types
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

const server = http.createServer((req, res) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);

  // Servir test-api.html por defecto
  let filePath = req.url === '/' ? '/test-api.html' : req.url;
  filePath = path.join(__dirname, filePath);

  // Obtener extensión del archivo
  const extname = String(path.extname(filePath)).toLowerCase();
  const contentType = mimeTypes[extname] || 'application/octet-stream';

  // Leer y servir el archivo
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // Archivo no encontrado
        res.writeHead(404, { 'Content-Type': 'text/html' });
        res.end(`
          <!DOCTYPE html>
          <html>
          <head>
            <title>404 - No encontrado</title>
            <style>
              body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100vh;
                margin: 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              }
              .error-box {
                background: white;
                padding: 40px;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0,0,0,0.2);
                text-align: center;
              }
              h1 { color: #667eea; margin-bottom: 10px; }
              p { color: #666; }
              a { color: #667eea; text-decoration: none; font-weight: 600; }
            </style>
          </head>
          <body>
            <div class="error-box">
              <h1>404 - Archivo no encontrado</h1>
              <p>El archivo <code>${req.url}</code> no existe.</p>
              <p><a href="/">← Volver al inicio</a></p>
            </div>
          </body>
          </html>
        `, 'utf-8');
      } else {
        // Error del servidor
        res.writeHead(500);
        res.end(`Error del servidor: ${error.code}`);
      }
    } else {
      // Éxito
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, HOST, () => {
  console.log('\n╔══════════════════════════════════════════════════════════╗');
  console.log('║                                                          ║');
  console.log('║       🚀 Servidor de Prueba API Bearer - Kunoro         ║');
  console.log('║                                                          ║');
  console.log('╚══════════════════════════════════════════════════════════╝\n');
  console.log(`✅ Servidor corriendo en: http://${HOST}:${PORT}`);
  console.log(`📄 Archivo de prueba: http://${HOST}:${PORT}/test-api.html`);
  console.log(`\n📝 Instrucciones:`);
  console.log(`   1. Asegúrate de que tu API esté corriendo en http://localhost:3000`);
  console.log(`   2. Abre http://${HOST}:${PORT} en tu navegador`);
  console.log(`   3. Ingresa tu token Bearer y prueba los endpoints\n`);
  console.log(`⏹️  Presiona Ctrl+C para detener el servidor\n`);
});

// Manejo de errores
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: El puerto ${PORT} ya está en uso.`);
    console.error(`   Intenta detener otros servidores o usa otro puerto.\n`);
  } else {
    console.error(`\n❌ Error del servidor: ${error.message}\n`);
  }
  process.exit(1);
});

// Manejo de cierre graceful
process.on('SIGINT', () => {
  console.log('\n\n👋 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente\n');
    process.exit(0);
  });
});

process.on('SIGTERM', () => {
  console.log('\n\n👋 Cerrando servidor...');
  server.close(() => {
    console.log('✅ Servidor cerrado correctamente\n');
    process.exit(0);
  });
});

