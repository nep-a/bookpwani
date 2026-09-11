const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://postgres.kmikxqgekmwfdpufoqis:Horacewitaba2026@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'
});

async function runMigration() {
    try {
        await client.connect();
        console.log('Connected to DB');

        await client.query(`
            ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ticket_code TEXT;
            ALTER TABLE bookings ADD COLUMN IF NOT EXISTS is_downloaded BOOLEAN DEFAULT FALSE;
            ALTER TABLE bookings ADD COLUMN IF NOT EXISTS total_price NUMERIC;
            ALTER TABLE bookings ADD COLUMN IF NOT EXISTS ticket_tier_name TEXT;
        `);

        console.log('Migration successful');
    } catch (e) {
        console.error('Error:', e);
    } finally {
        await client.end();
    }
}
runMigration();
