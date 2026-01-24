import { NextResponse } from 'next/server';
import { getUpcomingEvents } from '@/lib/api/events';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const events = await getUpcomingEvents(3);

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch upcoming events' },
      { status: 500 }
    );
  }
}
