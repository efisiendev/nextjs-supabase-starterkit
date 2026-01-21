# Supabase Migration Setup Guide

This guide will walk you through setting up Supabase and migrating your data from JSON files to a PostgreSQL database.

## Prerequisites

- Node.js and npm installed
- A Supabase account (free tier is sufficient)
- All JSON data files in `public/data/` directory

## Step 1: Create Supabase Project (5 minutes)

1. Go to [https://supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Fill in the following:
   - **Organization**: Your account
   - **Project name**: `hmjf-uin-alauddin`
   - **Database password**: Click "Generate password" and save it securely
   - **Region**: Select **Singapore (Southeast Asia)** (closest to Indonesia)
   - **Pricing plan**: Free tier
4. Click "Create new project"
5. Wait 2-3 minutes for provisioning

## Step 2: Get Your Credentials (2 minutes)

1. Go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://xxxxx.supabase.co`)
   - **anon/public key** (under "Project API keys")
   - **service_role key** (under "Project API keys" - **KEEP THIS SECRET!**)

## Step 3: Configure Environment Variables (2 minutes)

1. Create `.env.local` file in your project root (if it doesn't exist)
2. Add the following:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# Feature Flags - Start with all false for safety
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=false
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=false
NEXT_PUBLIC_USE_SUPABASE_EVENTS=false
NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP=false
```

3. Replace the placeholder values with your actual credentials from Step 2

## Step 4: Create Database Schema (5 minutes)

1. Go to your Supabase Dashboard → **SQL Editor**
2. Click **New query**
3. Open the file `supabase/migrations/001_initial_schema.sql` from this project
4. Copy **all** the SQL code from that file
5. Paste it into the Supabase SQL Editor
6. Click **Run** (bottom right)
7. You should see "Success. No rows returned" - this is correct!

## Step 5: Verify Schema Created (1 minute)

1. Go to **Table Editor** in Supabase Dashboard
2. You should see 4 tables:
   - `members`
   - `articles`
   - `events`
   - `leadership`
3. Click on each table to verify the columns are created

## Step 6: Run Data Migration (2 minutes)

Run the migration script to copy all data from JSON files to Supabase:

```bash
npx tsx scripts/migrate-data-to-supabase.ts
```

Expected output:
```
🚀 Starting data migration to Supabase...

📊 Migrating members...
✅ Migrated 20 members

📝 Migrating articles...
✅ Migrated 8 articles

📅 Migrating events...
✅ Migrated 6 events

👥 Migrating leadership...
✅ Migrated 28 leadership records

🎉 Migration completed successfully!
```

If you see any errors:
- Check that your environment variables are set correctly
- Verify the schema was created successfully in Step 4
- Ensure your Supabase project is running (not paused)

## Step 7: Verify Data in Supabase (2 minutes)

1. Go to **Table Editor** in Supabase Dashboard
2. Click on each table and verify the data:
   - `members` should have ~20 rows
   - `articles` should have ~8 rows
   - `events` should have ~6 rows
   - `leadership` should have ~28 rows

## Step 8: Test Locally with Feature Flags (10 minutes)

Now test the Supabase integration progressively:

### Test 1: Members Only

1. Update `.env.local`:
```bash
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=false
NEXT_PUBLIC_USE_SUPABASE_EVENTS=false
NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP=false
```

2. Restart dev server:
```bash
npm run dev
```

3. Test these pages:
   - Navigate to http://localhost:3000/members
   - Try filtering by batch: http://localhost:3000/members?batch=2020
   - Check browser console for errors (should be none)
   - Check Network tab - you should see requests to Supabase API

4. Compare with JSON version:
   - Set `NEXT_PUBLIC_USE_SUPABASE_MEMBERS=false`
   - Restart server
   - Data should be identical

### Test 2: Members + Articles

```bash
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=true
```

Test:
- http://localhost:3000/articles
- http://localhost:3000/articles?category=blog
- Click on an article to see detail page
- Check home page (`/`) - featured articles should load

### Test 3: Add Events

```bash
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=true
NEXT_PUBLIC_USE_SUPABASE_EVENTS=true
```

Test:
- http://localhost:3000/events
- http://localhost:3000/events?status=upcoming
- Click on an event to see detail page
- Check home page - upcoming events should load

### Test 4: Full Migration

```bash
NEXT_PUBLIC_USE_SUPABASE_MEMBERS=true
NEXT_PUBLIC_USE_SUPABASE_ARTICLES=true
NEXT_PUBLIC_USE_SUPABASE_EVENTS=true
NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP=true
```

Test:
- http://localhost:3000/leadership
- All pages should work without errors
- No console errors

## Step 9: Deploy to Vercel (15 minutes)

### 9.1 Add Environment Variables to Vercel

1. Go to Vercel Dashboard → Your Project → **Settings** → **Environment Variables**
2. Add these variables:

```
NEXT_PUBLIC_SUPABASE_URL = https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY = your_anon_key_here
NEXT_PUBLIC_USE_SUPABASE_MEMBERS = false
NEXT_PUBLIC_USE_SUPABASE_ARTICLES = false
NEXT_PUBLIC_USE_SUPABASE_EVENTS = false
NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP = false
```

3. **Important**: Set for **Production**, **Preview**, and **Development** environments

### 9.2 Deploy Baseline

```bash
git add .
git commit -m "feat: add Supabase database integration with feature flags"
git push origin main
```

Vercel will auto-deploy. Verify:
- Site loads correctly
- Uses JSON data (all flags are false)
- No errors in browser console

### 9.3 Gradual Rollout (Recommended)

Enable one entity per week to monitor for issues:

**Week 1: Enable Members**
1. Vercel Dashboard → Environment Variables → Edit `NEXT_PUBLIC_USE_SUPABASE_MEMBERS`
2. Change to `true` → Save
3. Redeploy (automatic)
4. Test production URL
5. Monitor for 24-48 hours

**Week 2: Enable Articles**
- Repeat process for `NEXT_PUBLIC_USE_SUPABASE_ARTICLES`

**Week 3: Enable Events**
- Repeat process for `NEXT_PUBLIC_USE_SUPABASE_EVENTS`

**Week 4: Enable Leadership**
- Repeat process for `NEXT_PUBLIC_USE_SUPABASE_LEADERSHIP`
- **All entities now on Supabase!**

## Rollback Procedure

If anything goes wrong, instantly rollback:

### In Development:
1. Set flag to `false` in `.env.local`
2. Restart dev server

### In Production (Vercel):
1. Vercel Dashboard → Environment Variables
2. Change flag from `true` to `false`
3. Save (auto-redeploys)
4. Site reverts to JSON data

**Recovery time:** < 5 minutes

## Troubleshooting

### Error: "Missing Supabase environment variables"
- Check `.env.local` exists and has correct values
- Restart dev server after changing env vars

### Error: "Failed to fetch [entity]"
- Check Supabase project is not paused (free tier auto-pauses after inactivity)
- Go to Supabase Dashboard and resume project if needed

### Data not showing up after migration
- Verify data exists in Supabase Table Editor
- Check browser Network tab for API errors
- Ensure feature flags are set to `true` for that entity

### Build fails with TypeScript errors
- Run `npm run build` locally first to catch errors
- Check that all repository methods are implemented correctly

## Next Steps (Phase 2 - Future)

After successfully migrating to Supabase, you can implement:

1. **Admin Dashboard** for content management
2. **Role-based Authentication** (Admin & Kontributor)
3. **Real-time Updates** using Supabase subscriptions
4. **Full-text Search** using PostgreSQL's built-in search
5. **Image Upload** to Supabase Storage

See the full migration plan at: `.claude/plans/serene-scribbling-wilkinson.md`

## Support

If you encounter issues:
1. Check the Supabase Dashboard for errors
2. Review browser console for JavaScript errors
3. Check Vercel deployment logs for build errors
4. Consult the comprehensive plan document in `.claude/plans/`

---

**Migration Complete! 🎉**

Your application now has a scalable database backend with easy rollback capabilities.
