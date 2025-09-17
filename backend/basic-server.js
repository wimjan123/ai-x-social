const http = require('http');
const url = require('url');

const port = 3001;

const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'https://x.polibase.nl');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Credentials', 'true');

    // Handle preflight requests
    if (method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Set content type to JSON
    res.setHeader('Content-Type', 'application/json');

    // Route handling
    if (path === '/api/health' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ok',
            message: 'AI Social Backend is running via Traefik',
            timestamp: new Date().toISOString(),
            service: 'ai-x-social-backend',
            version: '1.0.0'
        }));
    } else if (path === '/api/status' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            status: 'ready',
            services: {
                api: 'online',
                database: 'simulated',
                redis: 'simulated'
            },
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || 'development'
        }));
    } else if (path === '/api' && method === 'GET') {
        res.writeHead(200);
        res.end(JSON.stringify({
            name: 'AI Social Media Platform API',
            version: '1.0.0',
            description: 'Backend API for AI-powered social media platform',
            endpoints: {
                health: '/api/health',
                status: '/api/status'
            }
        }));
    } else {
        // 404 handler
        res.writeHead(404);
        res.end(JSON.stringify({
            error: 'Not Found',
            message: `Route ${method} ${path} not found`,
            timestamp: new Date().toISOString()
        }));
    }
});

server.listen(port, '0.0.0.0', () => {
    console.log(`AI Social Backend running on port ${port}`);
    console.log(`Health check: http://localhost:${port}/api/health`);
    console.log('Ready to receive requests via Traefik');
});