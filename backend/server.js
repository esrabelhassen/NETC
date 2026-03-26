import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'db.json');
const PORT = Number(process.env.API_PORT || 8787);
const ENTITY_KEYS = ['services', 'categories', 'contents', 'leads', 'orders'];

const json = (res, statusCode, payload) => {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  });
  res.end(JSON.stringify(payload));
};
const noContent = (res) => { res.writeHead(204); res.end(); };
const readDb = async () => JSON.parse(await fs.readFile(DB_PATH, 'utf-8'));
const writeDb = async (db) => fs.writeFile(DB_PATH, JSON.stringify(db, null, 2));

const server = http.createServer(async (req, res) => {
  if (!req.url) return json(res, 400, { message: 'Invalid request' });
  if (req.method === 'OPTIONS') return noContent(res);

  const url = new URL(req.url, `http://localhost:${PORT}`);
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
