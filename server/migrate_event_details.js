const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.kmikxqgekmwfdpufoqis:Horacewitaba2026@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'
});

async function runMigration() {
    try {
        await client.connect();
        console.log('Connected to DB');

        await client.query(`
            ALTER TABLE events ADD COLUMN IF NOT EXISTS venue TEXT;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS time TEXT;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS category TEXT;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS capacity INTEGER DEFAULT 0;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS vip_price NUMERIC;
            ALTER TABLE events ADD COLUMN IF NOT EXISTS vip_capacity INTEGER DEFAULT 0;
        `);

        console.log('Migration successful');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.end();
    }
}
runMigration();
