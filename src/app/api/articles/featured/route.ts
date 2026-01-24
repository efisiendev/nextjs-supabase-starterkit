import { NextResponse } from 'next/server';
import { getFeaturedArticles } from '@/lib/api/articles';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const articles = await getFeaturedArticles(3);

    return NextResponse.json(articles);
  } catch (error) {
    console.error('Error fetching featured articles:', error);
    return NextResponse.json(
      { error: 'Failed to fetch featured articles' },
      { status: 500 }
    );
  }
}
