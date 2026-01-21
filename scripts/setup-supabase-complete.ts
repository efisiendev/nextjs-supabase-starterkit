#!/usr/bin/env tsx

/**
 * Complete Supabase Setup Script
 * 
 * This script:
 * 1. Creates the database schema (tables, indexes, RLS)
 * 2. Migrates all JSON data to Supabase
 * 
 * Usage:
 *   DB_PASSWORD=your_password npx tsx scripts/setup-supabase-complete.ts
 *   OR
 *   npx tsx scripts/setup-supabase-complete.ts your_password
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { Client } from 'pg';
import { supabaseServer } from '../src/lib/supabase/server';
import {
  memberToDbInsert,
  articleToDbInsert,
  eventToDbInsert,
  leadershipToDbInsert,
} from '../src/lib/supabase/type-mappers';

// Import JSON data
import membersData from '../public/data/members.json';
import articlesData from '../public/data/articles.json';
import eventsData from '../public/data/events.json';
import leadershipData from '../public/data/leadership.json';

import type { Member } from '../src/core/entities/Member';
import type { Article } from '../src/core/entities/Article';
import type { Event } from '../src/core/entities/Event';
import type { Leadership } from '../src/core/entities/Leadership';

// Load environment variables
dotenv.config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const dbPassword = process.env.DB_PASSWORD || process.argv[2];

if (!supabaseUrl) {
  console.error('❌ Missing NEXT_PUBLIC_SUPABASE_URL in .env.local');
  process.exit(1);
}

if (!dbPassword) {
  console.error('❌ Database password required!');
  console.error('   Usage: DB_PASSWORD=your_password npx tsx scripts/setup-supabase-complete.ts');
  console.error('   OR:    npx tsx scripts/setup-supabase-complete.ts your_password');
  process.exit(1);
}

// Extract project ref from URL
const projectRef = new URL(supabaseUrl).hostname.split('.')[0];

async function setupComplete() {
  console.log('🚀 Starting complete Supabase setup...\n');
  console.log('This will:');
  console.log('  1. Create database schema (tables, indexes, RLS)');
  console.log('  2. Migrate all JSON data to Supabase\n');

  const client = new Client({
    host: `db.${projectRef}.supabase.co`,
    port: 5432,
    database: 'postgres',
    user: 'postgres',
    password: dbPassword,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    // ============================================
    // STEP 1: CREATE SCHEMA
    // ============================================
    console.log('📡 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected!\n');

    console.log('📄 Creating database schema...');
    const schemaPath = path.join(process.cwd(), 'supabase', 'migrations', '001_initial_schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf-8');

    await client.query(schemaSql);

    console.log('✅ Schema created successfully!\n');
    console.log('📊 Tables created: members, articles, events, leadership');
    console.log('🔐 RLS policies enabled');
    console.log('📈 Indexes and triggers created\n');

    await client.end();

    // ============================================
    // STEP 2: MIGRATE DATA
    // ============================================
    console.log('📦 Migrating JSON data to Supabase...\n');

    if (!supabaseServer) {
      throw new Error('Failed to create Supabase client');
    }

    // Migrate Members
    console.log('📊 Migrating members...');
    const membersToInsert = (membersData as Member[]).map(memberToDbInsert);
    const { data: membersResult, error: membersError } = await supabaseServer
      .from('members')
      .insert(membersToInsert)
      .select();

    if (membersError) throw membersError;
    console.log(`✅ Migrated ${membersResult?.length || 0} members\n`);

    // Migrate Articles
    console.log('📝 Migrating articles...');
    const articlesToInsert = (articlesData as Article[]).map(articleToDbInsert);
    const { data: articlesResult, error: articlesError } = await supabaseServer
      .from('articles')
      .insert(articlesToInsert)
      .select();

    if (articlesError) throw articlesError;
    console.log(`✅ Migrated ${articlesResult?.length || 0} articles\n`);

    // Migrate Events
    console.log('📅 Migrating events...');
    const eventsToInsert = (eventsData as Event[]).map(eventToDbInsert);
    const { data: eventsResult, error: eventsError } = await supabaseServer
      .from('events')
      .insert(eventsToInsert)
      .select();

    if (eventsError) throw eventsError;
    console.log(`✅ Migrated ${eventsResult?.length || 0} events\n`);

    // Migrate Leadership
    console.log('👥 Migrating leadership...');
    const leadershipToInsert = (leadershipData as Leadership[]).map(leadershipToDbInsert);
    const { data: leadershipResult, error: leadershipError } = await supabaseServer
      .from('leadership')
      .insert(leadershipToInsert)
      .select();

    if (leadershipError) throw leadershipError;
    console.log(`✅ Migrated ${leadershipResult?.length || 0} leadership records\n`);

    // ============================================
    // SUMMARY
    // ============================================
    console.log('🎉 Setup completed successfully!\n');
    console.log('📊 Migration Summary:');
    console.log(`   Members:    ${membersResult?.length || 0}`);
    console.log(`   Articles:   ${articlesResult?.length || 0}`);
    console.log(`   Events:     ${eventsResult?.length || 0}`);
    console.log(`   Leadership: ${leadershipResult?.length || 0}`);
    console.log(`   Total:      ${(membersResult?.length || 0) + (articlesResult?.length || 0) + (eventsResult?.length || 0) + (leadershipResult?.length || 0)} records\n`);

    console.log('✨ Next steps:');
    console.log('   1. Verify data in Supabase Dashboard → Table Editor');
    console.log('   2. Test locally: Set NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true in .env.local');
    console.log('   3. Restart dev server: npm run dev');
    console.log('   4. Navigate to http://localhost:3000/members\n');

  } catch (error: any) {
    console.error('\n❌ Setup failed:', error.message);
    
    if (error.message?.includes('password')) {
      console.log('\n💡 Tip: Make sure you\'re using the correct database password');
    } else if (error.message?.includes('already exists')) {
      console.log('\n💡 Note: Some objects may already exist (this is ok)');
      console.log('   Try running just the migration: npx tsx scripts/migrate-data-to-supabase.ts');
    }
    
    await client.end().catch(() => {});
    process.exit(1);
  }
}

setupComplete();
