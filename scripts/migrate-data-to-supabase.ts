#!/usr/bin/env tsx

/**
 * Data Migration Script - JSON to Supabase
 *
 * This script migrates all JSON data files to Supabase PostgreSQL database.
 * Run once after setting up your Supabase project and executing the schema.
 *
 * Usage:
 *   npx tsx scripts/migrate-data-to-supabase.ts
 *
 * Prerequisites:
 *   1. Supabase project created
 *   2. Schema SQL executed in Supabase
 *   3. Environment variables set in .env.local:
 *      - NEXT_PUBLIC_SUPABASE_URL
 *      - SUPABASE_SERVICE_ROLE_KEY
 */

import dotenv from 'dotenv';

// Load environment variables from .env or .env.local
dotenv.config({ path: '.env.local' });
dotenv.config({ path: '.env' });

import { createClient } from '@supabase/supabase-js';
import type { Database } from '../src/lib/supabase/database.types';
import {
  memberToDbInsert,
  articleToDbInsert,
  eventToDbInsert,
  leadershipToDbInsert,
} from '../src/lib/supabase/type-mappers';

// Create Supabase client directly in script
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Error: Missing Supabase environment variables');
  console.error('   Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabaseServer = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Import JSON data
import membersData from '../public/data/members.json';
import articlesData from '../public/data/articles.json';
import eventsData from '../public/data/events.json';
import leadershipData from '../public/data/leadership.json';

import type { Member } from '../src/core/entities/Member';
import type { Article } from '../src/core/entities/Article';
import type { Event } from '../src/core/entities/Event';
import type { Leadership } from '../src/core/entities/Leadership';

// =============================================
// MAIN MIGRATION FUNCTION
// =============================================

async function migrateData() {
  console.log('🚀 Starting data migration to Supabase...\n');

  try {
    // Migrate Members
    console.log('📊 Migrating members...');
    const membersToInsert = (membersData as Member[]).map(memberToDbInsert);
    const { data: membersResult, error: membersError } = await supabaseServer
      .from('members')
      .insert(membersToInsert)
      .select();

    if (membersError) {
      console.error('❌ Error migrating members:', membersError);
      throw membersError;
    }
    console.log(`✅ Migrated ${membersResult?.length || 0} members\n`);

    // Migrate Articles
    console.log('📝 Migrating articles...');
    const articlesToInsert = (articlesData as Article[]).map(articleToDbInsert);
    const { data: articlesResult, error: articlesError } = await supabaseServer
      .from('articles')
      .insert(articlesToInsert)
      .select();

    if (articlesError) {
      console.error('❌ Error migrating articles:', articlesError);
      throw articlesError;
    }
    console.log(`✅ Migrated ${articlesResult?.length || 0} articles\n`);

    // Migrate Events
    console.log('📅 Migrating events...');
    const eventsToInsert = (eventsData as Event[]).map(eventToDbInsert);
    const { data: eventsResult, error: eventsError } = await supabaseServer
      .from('events')
      .insert(eventsToInsert)
      .select();

    if (eventsError) {
      console.error('❌ Error migrating events:', eventsError);
      throw eventsError;
    }
    console.log(`✅ Migrated ${eventsResult?.length || 0} events\n`);

    // Migrate Leadership
    console.log('👥 Migrating leadership...');
    const leadershipToInsert = (leadershipData as Leadership[]).map(leadershipToDbInsert);
    const { data: leadershipResult, error: leadershipError } = await supabaseServer
      .from('leadership')
      .insert(leadershipToInsert)
      .select();

    if (leadershipError) {
      console.error('❌ Error migrating leadership:', leadershipError);
      throw leadershipError;
    }
    console.log(`✅ Migrated ${leadershipResult?.length || 0} leadership records\n`);

    // Summary
    console.log('🎉 Migration completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`   Members:    ${membersResult?.length || 0}`);
    console.log(`   Articles:   ${articlesResult?.length || 0}`);
    console.log(`   Events:     ${eventsResult?.length || 0}`);
    console.log(`   Leadership: ${leadershipResult?.length || 0}`);
    console.log(`   Total:      ${(membersResult?.length || 0) + (articlesResult?.length || 0) + (eventsResult?.length || 0) + (leadershipResult?.length || 0)} records`);
    console.log('\n✨ Next steps:');
    console.log('   1. Verify data in Supabase Dashboard → Table Editor');
    console.log('   2. Run verification queries from the migration plan');
    console.log('   3. Test Supabase repositories locally');

  } catch (error) {
    console.error('\n💥 Migration failed:', error);
    process.exit(1);
  }
}

// =============================================
// EXECUTE MIGRATION
// =============================================

// Run migration
migrateData()
  .then(() => {
    console.log('\n✅ Script completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Script failed:', error);
    process.exit(1);
  });
