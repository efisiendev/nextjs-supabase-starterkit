import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Middleware disabled: Supabase v2 uses localStorage for session storage, not cookies
// Auth checks are handled by AdminLayout component instead
export async function middleware(req: NextRequest) {
  return NextResponse.next();
}
