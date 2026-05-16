import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';

// In-memory store
let users = [];
let entries = [
  { id: '1', userId: 'system', name: 'System', message: 'Welcome to the Secure Guestbook!', timestamp: new Date().toISOString() }
];

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Simple Auth Middleware
  const authenticate = (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) return res.status(401).json({ error: 'Unauthorized' });
    const user = users.find(u => u.id === token);
    if (!user) return res.status(401).json({ error: 'Invalid session' });
    req.user = user;
    next();
  };

  // Auth Routes
  app.post('/api/auth/signup', (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Missing fields' });
    if (users.find(u => u.username === username)) return res.status(400).json({ error: 'User exists' });
    
    const newUser = { id: Math.random().toString(36).substr(2, 9), username, password };
    users.push(newUser);
    res.status(201).json({ id: newUser.id, username: newUser.username });
  });

  app.post('/api/auth/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ id: user.id, username: user.username });
  });

  // API Routes (Protected)
  app.get('/api/entries', authenticate, (req, res) => {
    // Only see own entries (plus system entries)
    const userEntries = entries.filter(e => e.userId === req.user.id || e.userId === 'system');
    res.json(userEntries);
  });

  app.post('/api/entries', authenticate, (req, res) => {
    const { message } = req.body;
    if (!message) return res.status(400).json({ error: 'Message is required' });
    
    const newEntry = {
      id: Math.random().toString(36).substr(2, 9),
      userId: req.user.id,
      name: req.user.username,
      message,
      timestamp: new Date().toISOString(),
    };
    entries.unshift(newEntry);
    res.status(201).json(newEntry);
  });

  app.get('/info', (req, res) => {
    res.json({
      status: 'ok',
      datastore: 'In-memory (simulated redis)',
      version: 'v2',
      auth: 'enabled'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
