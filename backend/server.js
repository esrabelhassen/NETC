import http from 'node:http';
import { randomUUID } from 'node:crypto';
import {
  ENTITY_KEYS,
  initStorage,
  listEntities,
  createEntity,
  updateEntity,
  deleteEntity,
} from './storage.js';

const PORT = Number(process.env.API_PORT || 8787);
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

const parseJsonBody = async (req) => {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  if (!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf-8'));
};

const server = http.createServer(async (req, res) => {
  if (!req.url) {
    return json(res, 400, { message: 'Invalid request' });
  }
  if (req.method === 'OPTIONS') {
    return noContent(res);
  }

  const url = new URL(req.url, `http://localhost:${PORT}`);
  const normalizedPath = url.pathname.endsWith('/') && url.pathname.length > 1
    ? url.pathname.replace(/\/+$/, '')
    : url.pathname;
  const isAdminSessionPath = ADMIN_SESSION_PATHS.has(normalizedPath);

  if (isAdminSessionPath) {
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
      const body = await parseJsonBody(req);
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
  if (!match) {
    return json(res, 404, { message: 'Route not found' });
  }

  const [, entity, id] = match;
  if (!ENTITY_KEYS.includes(entity)) {
    return json(res, 404, { message: 'Unknown entity.' });
  }

  if (req.method === 'GET' && !id) {
    const sort = url.searchParams.get('sort') || '';
    const items = await listEntities(entity, sort);
    return json(res, 200, items);
  }

  if (req.method === 'POST' && !id) {
    const body = await parseJsonBody(req);
    const payload = await createEntity(entity, body);
    return json(res, 201, payload);
  }

  if (req.method === 'PUT' && id) {
    const body = await parseJsonBody(req);
    const updated = await updateEntity(entity, id, body);
    if (!updated) {
      return json(res, 404, { message: 'Record not found.' });
    }
    return json(res, 200, updated);
  }

  if (req.method === 'DELETE' && id) {
    const removed = await deleteEntity(entity, id);
    if (!removed) {
      return json(res, 404, { message: 'Record not found.' });
    }
    return noContent(res);
  }

  return json(res, 405, { message: 'Method not allowed.' });
});

initStorage()
  .then(() => {
    server.listen(PORT, () => console.log(`Local API running on http://localhost:${PORT}`));
  })
  .catch((error) => {
    console.error('Failed to initialize storage', error);
    process.exit(1);
  });
