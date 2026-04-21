import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'db.json');
const PORT = Number(process.env.API_PORT || 8787);
const ENTITY_KEYS = ['services', 'categories', 'contents', 'leads', 'orders', 'videos'];
const ADMIN_SESSION_PATHS = new Set(['/api/admin/session', '/admin/session']);
const PASSCODE = 'Netadminc1234';
const MAX_ADMIN_ATTEMPTS = 4;
const adminSessions = new Map();
const adminAttempts = new Map();

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Admin-Client-Id',
};

const json = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    ...CORS_HEADERS,
  });
  res.end(JSON.stringify(payload));
};
const noContent = (res) => {
  res.writeHead(204, CORS_HEADERS);
  res.end();
};
const readDb = async () => JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
const writeDb = async (db) => fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));

const server = http.createServer(async (req, res) => {
  if (!req.url) return json(res, 400, { message: 'Invalid request' });
  if (req.method === 'OPTIONS') return noContent(res);

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const normalizedPath = url.pathname.endsWith('/') && url.pathname.length > 1
    ? url.pathname.replace(/\/+$/, '')
    : url.pathname;
  const isAdminSessionPath = ADMIN_SESSION_PATHS.has(normalizedPath);

  if (isAdminSessionPath) {
    console.log(`[admin] ${req.method} ${url.pathname}`);
    const clientId = req.headers['x-admin-client-id'] || '';
    const authHeader = req.headers.authorization || '';
    const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : authHeader;
    const clientKey = clientId || (req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'anon');

    if (req.method === 'GET') {
      const session = token ? adminSessions.get(token) : undefined;
      if (!session) {
        const attemptCount = adminAttempts.get(clientKey) || 0;
        const attemptsLeft = Math.max(0, MAX_ADMIN_ATTEMPTS - attemptCount);
        return json(res, 401, { message: 'Authentication required', attemptsLeft, maxAttempts: MAX_ADMIN_ATTEMPTS });
      }
      return json(res, 200, { user: { email: 'admin@netc.fr', role: 'admin', name: 'NETC Admin' } });
    }

    if (req.method === 'POST') {
      const chunks = []; for await (const c of req) chunks.push(c);
      const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {};
      if (!Object.prototype.hasOwnProperty.call(body, 'passcode')) {
        return json(res, 400, { message: 'Passcode is required' });
      }
      const attemptCount = adminAttempts.get(clientKey) || 0;
      if (attemptCount >= MAX_ADMIN_ATTEMPTS) {
        return json(res, 429, { message: 'Too many attempts', attemptsLeft: 0, maxAttempts: MAX_ADMIN_ATTEMPTS });
      }
      if (body.passcode !== PASSCODE) {
        const nextCount = attemptCount + 1;
        adminAttempts.set(clientKey, nextCount);
        const attemptsLeft = Math.max(0, MAX_ADMIN_ATTEMPTS - nextCount);
        return json(res, 401, { message: 'Invalid passcode', attemptsLeft, maxAttempts: MAX_ADMIN_ATTEMPTS });
      }
      adminAttempts.delete(clientKey);
      const newToken = randomUUID();
      adminSessions.set(newToken, { clientId: clientId || clientKey, created_date: new Date().toISOString() });
      return json(res, 200, {
        token: newToken,
        user: { email: 'admin@netc.fr', role: 'admin', name: 'NETC Admin' },
        maxAttempts: MAX_ADMIN_ATTEMPTS,
      });
    }

    if (req.method === 'DELETE') {
      if (token) adminSessions.delete(token);
      return noContent(res);
    }

    return json(res, 405, { message: 'Method not allowed.' });
  }

  const match = url.pathname.match(/^\/api\/([^/]+)(?:\/([^/]+))?$/);
  if (!match) return json(res, 404, { message: 'Route not found' });

  const [, entity, id] = match;
  if (!ENTITY_KEYS.includes(entity)) return json(res, 404, { message: 'Unknown entity.' });

  const db = await readDb();

  if (req.method === 'GET' && !id) return json(res, 200, db[entity] || []);

  if (req.method === 'POST' && !id) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {};
    const now = new Date().toISOString();
    const payload = { id: randomUUID(), created_date: now, updated_date: now, ...body };
    db[entity].push(payload); await writeDb(db);
    return json(res, 201, payload);
  }

  if (req.method === 'PUT' && id) {
    const chunks = []; for await (const c of req) chunks.push(c);
    const body = chunks.length ? JSON.parse(Buffer.concat(chunks).toString('utf-8')) : {};
    const i = db[entity].findIndex((x) => x.id === id);
    if (i === -1) return json(res, 404, { message: 'Record not found.' });
    db[entity][i] = { ...db[entity][i], ...body, id, updated_date: new Date().toISOString() };
    await writeDb(db);
    return json(res, 200, db[entity][i]);
  }

  if (req.method === 'DELETE' && id) {
    db[entity] = db[entity].filter((x) => x.id !== id);
    await writeDb(db);
    return noContent(res);
  }

  return json(res, 405, { message: 'Method not allowed.' });
});

server.listen(PORT, () => console.log(`Local API running on http://localhost:${PORT}`));
