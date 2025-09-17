import express from 'express';

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3001;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://x.polibase.nl');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// Health endpoint
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    message: 'AI Social Backend is running via Traefik',
    timestamp: new Date().toISOString(),
    service: 'ai-x-social-backend',
    version: '1.0.0'
  });
});

// Status endpoint
app.get('/api/status', (_req, res) => {
  res.json({
    status: 'ready',
    services: {
      api: 'online',
      database: 'simulated',
      redis: 'simulated'
    },
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Root API endpoint
app.get('/api', (_req, res) => {
  res.json({
    name: 'AI Social Media Platform API',
    version: '1.0.0',
    description: 'Backend API for AI-powered social media platform',
    endpoints: {
      health: '/api/health',
      status: '/api/status'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`,
    timestamp: new Date().toISOString()
  });
});

// Error handler
app.use((error, _req, res, _next) => {
  console.error('Server Error:', error);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong on the server',
    timestamp: new Date().toISOString()
  });
});

app.listen(port, '0.0.0.0', () => {
  console.log(`AI Social Backend running on port ${port}`);
  console.log(`Health check: http://localhost:${port}/api/health`);
  console.log('Ready to receive requests via Traefik');
});
