'use client';

import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Calendar, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';
import { useEffect, useState } from 'react';
import { JsonEventRepository } from '@/infrastructure/repositories/JsonEventRepository';
import type { EventListItem } from '@/core/entities/Event';

export function EventsPreview() {
  const [events, setEvents] = useState<EventListItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const repo = new JsonEventRepository();
        const data = await repo.getUpcoming(3);
        setEvents(data);
      } catch (error) {
        console.error('Failed to fetch events:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) {
    return <div className="text-center py-12">Loading...</div>;
  }

  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">Event Mendatang</h2>
            <p className="text-gray-600">Jangan lewatkan kegiatan seru dari HMJF</p>
          </div>
          <Link
            href="/events"
            className="hidden md:inline-flex items-center gap-2 text-primary-600 font-medium hover:gap-3 transition-all"
          >
            Lihat Semua
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.length === 0 ? (
            <div className="col-span-3 text-center py-12 text-gray-500">
              Belum ada event mendatang
            </div>
          ) : (
            events.map((event) => (
              <Link
                key={event.id}
                href={`/events/${event.slug}`}
                className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  {event.featured && (
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-secondary-600 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-primary-600 font-medium mb-2">
                    <Calendar className="w-4 h-4" />
                    <time>{format(new Date(event.startDate), 'd MMMM yyyy', { locale: id })}</time>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                    {event.title}
                  </h3>
                  <p className="text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <MapPin className="w-4 h-4" />
                    <span className="line-clamp-1">{event.location.name}</span>
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
          >
            Lihat Semua Event
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
