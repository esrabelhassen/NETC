import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Pool } from 'pg';
import { randomUUID } from 'node:crypto';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_PATH = path.join(__dirname, 'db.json');

export const ENTITY_KEYS = ['services', 'categories', 'contents', 'leads', 'orders', 'videos'];
const SORTABLE_KEYS = new Set(['order', 'created_date', 'updated_date']);

const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    })
  : null;

const defaultDb = () => {
  const db = {};
  for (const key of ENTITY_KEYS) {
    db[key] = [];
  }
  return db;
};

const normalizeDb = (db) => {
  const normalized = {};
  for (const key of ENTITY_KEYS) {
    normalized[key] = Array.isArray(db?.[key]) ? db[key] : [];
  }
  return normalized;
};

const readJsonDb = async () => {
  try {
    const raw = await fs.readFile(DB_PATH, 'utf-8');
    return normalizeDb(JSON.parse(raw));
  } catch (error) {
    if (error.code === 'ENOENT') {
      const empty = defaultDb();
      await writeJsonDb(empty);
      return empty;
    }
    throw error;
  }
};

const writeJsonDb = async (db) => {
  await fs.writeFile(DB_PATH, JSON.stringify(normalizeDb(db), null, 2));
};

const ensureEntityArray = (db, entity) => {
  if (!Array.isArray(db[entity])) {
    db[entity] = [];
  }
  return db[entity];
};

const parseSortParam = (sort) => {
  if (!sort) return null;
  const direction = sort.startsWith('-') ? 'DESC' : 'ASC';
  const key = sort.replace(/^-/, '');
  if (!SORTABLE_KEYS.has(key)) return null;
  return { key, direction };
};

const sortEntities = (items, sort) => {
  const meta = parseSortParam(sort);
  if (!meta) return items;
  return [...items].sort((a, b) => {
    const getValue = (item) => item?.[meta.key];
    const aValue = getValue(a);
    const bValue = getValue(b);
    if (aValue == null && bValue == null) return 0;
    if (aValue == null) return meta.direction === 'ASC' ? -1 : 1;
    if (bValue == null) return meta.direction === 'ASC' ? 1 : -1;
    if (meta.key === 'order') {
      const diff = Number(aValue) - Number(bValue);
      return meta.direction === 'ASC' ? diff : -diff;
    }
    if (meta.key === 'created_date' || meta.key === 'updated_date') {
      const diff = new Date(aValue).getTime() - new Date(bValue).getTime();
      return meta.direction === 'ASC' ? diff : -diff;
    }
    const left = String(aValue);
    const right = String(bValue);
    return meta.direction === 'ASC' ? left.localeCompare(right) : right.localeCompare(left);
  });
};

const ensureTable = async () => {
  if (!pool) return;
  await pool.query(`
    CREATE TABLE IF NOT EXISTS entity_store (
      entity TEXT NOT NULL,
      id UUID NOT NULL,
      created_date TIMESTAMPTZ NOT NULL,
      updated_date TIMESTAMPTZ NOT NULL,
      payload JSONB NOT NULL,
      PRIMARY KEY (entity, id)
    )
  `);
};

const migrateJsonToPostgres = async () => {
  if (!pool) return;
  const { rows } = await pool.query('SELECT count(*)::int AS count FROM entity_store');
  if (rows[0]?.count > 0) return;
  const db = await readJsonDb();
  for (const entity of ENTITY_KEYS) {
    const records = db[entity] || [];
    for (const record of records) {
      const id = record.id || randomUUID();
      const created_date = record.created_date || new Date().toISOString();
      const updated_date = record.updated_date || created_date;
      const payload = { ...record, id, created_date, updated_date };
      await pool.query(
        'INSERT INTO entity_store(entity,id,created_date,updated_date,payload) VALUES($1,$2,$3,$4,$5) ON CONFLICT DO NOTHING',
        [entity, id, created_date, updated_date, payload]
      );
    }
  }
};

export const initStorage = async () => {
  await readJsonDb();
  if (pool) {
    await ensureTable();
    await migrateJsonToPostgres();
  }
};

const listFromPostgres = async (entity) => {
  if (!pool) return [];
  const { rows } = await pool.query('SELECT payload FROM entity_store WHERE entity = $1', [entity]);
  return rows.map((row) => row.payload);
};

const listFromFile = async (entity) => {
  const db = await readJsonDb();
  return [...ensureEntityArray(db, entity)];
};

const getRecordFromPostgres = async (entity, id) => {
  if (!pool) return null;
  const { rows } = await pool.query('SELECT payload FROM entity_store WHERE entity = $1 AND id = $2', [entity, id]);
  return rows[0]?.payload ?? null;
};

const createInPostgres = async (entity, payload) => {
  if (!pool) return null;
  await pool.query(
    'INSERT INTO entity_store(entity,id,created_date,updated_date,payload) VALUES($1,$2,$3,$4,$5)',
    [entity, payload.id, payload.created_date, payload.updated_date, payload]
  );
  return payload;
};

const updateInPostgres = async (entity, id, payload) => {
  if (!pool) return null;
  await pool.query(
    'UPDATE entity_store SET updated_date = $1, payload = $2 WHERE entity = $3 AND id = $4',
    [payload.updated_date, payload, entity, id]
  );
  return payload;
};

const deleteInPostgres = async (entity, id) => {
  if (!pool) return false;
  const { rowCount } = await pool.query('DELETE FROM entity_store WHERE entity = $1 AND id = $2', [entity, id]);
  return rowCount > 0;
};

const createInFile = async (entity, payload) => {
  const db = await readJsonDb();
  ensureEntityArray(db, entity).push(payload);
  await writeJsonDb(db);
  return payload;
};

const updateInFile = async (entity, id, payload) => {
  const db = await readJsonDb();
  const list = ensureEntityArray(db, entity);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;
  list[index] = payload;
  await writeJsonDb(db);
  return payload;
};

const deleteInFile = async (entity, id) => {
  const db = await readJsonDb();
  const list = ensureEntityArray(db, entity);
  const before = list.length;
  db[entity] = list.filter((item) => item.id !== id);
  const deleted = before !== db[entity].length;
  if (deleted) {
    await writeJsonDb(db);
  }
  return deleted;
};

export const listEntities = async (entity, sort = '') => {
  const items = pool ? await listFromPostgres(entity) : await listFromFile(entity);
  return sortEntities(items, sort);
};

export const createEntity = async (entity, data) => {
  const now = new Date().toISOString();
  const payload = {
    id: data.id || randomUUID(),
    created_date: now,
    updated_date: now,
    ...data,
  };
  return pool ? await createInPostgres(entity, payload) : await createInFile(entity, payload);
};

export const updateEntity = async (entity, id, data) => {
  const now = new Date().toISOString();
  if (pool) {
    const existing = await getRecordFromPostgres(entity, id);
    if (!existing) return null;
    const updated = { ...existing, ...data, id, updated_date: now };
    return await updateInPostgres(entity, id, updated);
  }
  const db = await readJsonDb();
  const list = ensureEntityArray(db, entity);
  const index = list.findIndex((item) => item.id === id);
  if (index === -1) return null;
  const updated = { ...list[index], ...data, id, updated_date: now };
  return await updateInFile(entity, id, updated);
};

export const deleteEntity = async (entity, id) => {
  return pool ? await deleteInPostgres(entity, id) : await deleteInFile(entity, id);
};
