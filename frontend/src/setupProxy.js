const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api/v1',
    createProxyMiddleware({
      target: 'http://localhost:5000',
      changeOrigin: true,
      secure: false,
      onProxyReq: (proxyReq, req, res) => {
        // Log proxy requests
        console.log(`Proxying ${req.method} ${req.path} to ${proxyReq.path}`);
      },
      onError: (err, req, res) => {
        console.error('Proxy error:', err);
        res.status(500).json({ error: 'Proxy error' });
      }
    })
  );
};
