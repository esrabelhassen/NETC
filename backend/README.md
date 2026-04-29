## Backend storage

The local backend (`backend/server.js`) now supports both a JSON file backend (used during local development) and a PostgreSQL backend (used in production).

### PostgreSQL (preferred)

- Provision a managed PostgreSQL database (Render private service or another provider) and expose the connection string as `DATABASE_URL`.
- Deploy the API with that environment variable set; `backend/storage.js` will automatically:
  1. Create `entity_store` if missing.
  2. Migrate any existing rows from `backend/db.json` into Postgres on the first boot.
  3. Serve all CRUD operations from the `entity_store` table while continuing to honor the old `/api` routes.

### Local fallback (JSON)

- If `DATABASE_URL` is not set, the backend reads/writes from `backend/db.json` so you can keep working locally without a database.
- Changes made in development can be migrated automatically once you point `DATABASE_URL` at a real Postgres instance (see the note above).

### Post-deployment

Render automatically redeploys whenever you push to the connected GitHub branch, so once the database is configured in Render's environment sections you can commit + push without any extra redeploy steps.
