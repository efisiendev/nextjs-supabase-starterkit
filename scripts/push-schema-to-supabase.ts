import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

// Extract project ref from URL (e.g., https://kjpfhtsnowkjervwuaii.supabase.co)
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

async function pushSchema() {
  console.log('🚀 Pushing database schema to Supabase...\n');

  // Prompt for database password
  console.log('🔑 Please enter your Supabase database password');
  console.log('   (You can find this in Supabase Dashboard → Settings → Database → Connection String)');
  console.log('   Or use the password you set when creating the project\n');

  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.question('Database Password: ', async (dbPassword: string) => {
    rl.close();

    if (!dbPassword.trim()) {
      console.error('❌ Password is required');
      process.exit(1);
    }

    const client = new Client({
      host: `db.${projectRef}.supabase.co`,
      port: 5432,
      database: 'postgres',
      user: 'postgres',
      password: dbPassword.trim(),
      ssl: {
        rejectUnauthorized: false
      }
    });

    try {
      console.log('\n📡 Connecting to Supabase database...');
      await client.connect();
      console.log('✅ Connected successfully!\n');

      // Read the schema SQL file
      const schemaPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
      const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

      console.log('📄 Executing schema SQL...');
      console.log('   This may take a minute...\n');

      await client.query(schemaSql);

      console.log('✅ Schema executed successfully!\n');
      console.log('📊 Tables created:');
      console.log('   - members');
      console.log('   - articles');
      console.log('   - events');
      console.log('   - leadership\n');
      console.log('🔐 RLS policies enabled');
      console.log('📈 Indexes and triggers created\n');

      // Verify tables
      const result = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name IN ('members', 'articles', 'events', 'leadership')
        ORDER BY table_name
      `);

      console.log('✅ Verified tables:', result.rows.map(r => r.table_name).join(', '));

      await client.end();
      console.log('\n🎉 Schema push completed successfully!');

    } catch (error: any) {
      console.error('\n❌ Schema push failed:', error.message);
      
      if (error.message.includes('password')) {
        console.log('\n💡 Tip: Make sure you\'re using the correct database password');
        console.log('   Find it in: Supabase Dashboard → Settings → Database');
      }
      
      console.log('\n💡 Alternative: Run SQL manually in Supabase Dashboard → SQL Editor');
      console.log('   File location: supabase/migrations/001_initial_schema.sql');
      
      await client.end();
      process.exit(1);
    }
  });
}

pushSchema();
