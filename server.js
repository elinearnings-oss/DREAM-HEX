import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = (process.env.PORT && process.env.PORT !== '8080') ? parseInt(process.env.PORT, 10) : 3000;
const HOST = '0.0.0.0';

const distPath = path.join(__dirname, 'dist');

// If dist does not exist, trigger build synchronously before serving
if (!fs.existsSync(distPath) || !fs.existsSync(path.join(distPath, 'index.html'))) {
  try {
    const { execSync } = await import('child_process');
    console.log('Dist directory not found. Running npm run build...');
    execSync('npm run build', { stdio: 'inherit' });
  } catch (err) {
    console.error('Auto-build failed:', err);
  }
}

// Serve static assets from dist with caching
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath, {
    maxAge: '1d',
    setHeaders: (res, filePath) => {
      if (filePath.endsWith('.html')) {
        res.setHeader('Cache-Control', 'no-cache');
      }
    }
  }));
}

// Serve public directory fallback if available
const publicPath = path.join(__dirname, 'public');
if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

// Health check endpoint for Cloud Run / platforms
app.get('/healthz', (_req, res) => {
  res.status(200).send('OK');
});

// Single Page Application (SPA) fallback to index.html
app.get('*', (_req, res) => {
  const indexPath = path.join(distPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(503).send('Building application, please refresh in a moment...');
  }
});

app.listen(PORT, HOST, () => {
  console.log(`VELORA production server running on http://${HOST}:${PORT}`);
});
