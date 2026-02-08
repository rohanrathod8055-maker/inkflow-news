import { createClient } from "@libsql/client";
import { createTableSQL } from "./schema";

// Initialize Turso client
// For local development, you can use a local database file
// For production (Vercel), use Turso cloud database
const db = createClient({
    url: process.env.TURSO_DATABASE_URL || "file:local.db",
    authToken: process.env.TURSO_AUTH_TOKEN,
});

// Initialize tables
async function initializeDatabase() {
    try {
        await db.execute(createTableSQL);
        console.log(`✅ Database initialized successfully`);
    } catch (error) {
        console.error("❌ Database initialization failed:", error);
        throw error;
    }
}

// Run initialization
initializeDatabase();

export default db;

