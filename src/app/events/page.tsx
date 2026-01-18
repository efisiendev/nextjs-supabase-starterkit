import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { JsonEventRepository } from '@/infrastructure/repositories/JsonEventRepository';
import { EVENT_CATEGORIES } from '@/lib/constants';
import { Calendar, MapPin, Users, ArrowRight, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { id } from 'date-fns/locale';

export const metadata: Metadata = {
  title: 'Event - HMJF UIN Alauddin',
  description: 'Daftar event dan kegiatan dari Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-700',
  ongoing: 'bg-green-100 text-green-700',
  completed: 'bg-gray-100 text-gray-700',
  cancelled: 'bg-red-100 text-red-700',
};

const statusLabels = {
  upcoming: 'Akan Datang',
  ongoing: 'Berlangsung',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
};

export default async function EventsPage({
  searchParams,
}: {
  searchParams: { status?: string };
}) {
  const eventRepo = new JsonEventRepository();
  const status = searchParams.status;

  const events = status
    ? await eventRepo.getByStatus(status as any)
    : await eventRepo.getAll();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Event & Kegiatan</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Ikuti berbagai kegiatan dan event menarik dari HMJF UIN Alauddin
          </p>
        </div>
      </section>

      {/* Status Filter */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/events"
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                !status
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Event
            </Link>
            <Link
              href="/events?status=upcoming"
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                status === 'upcoming'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Akan Datang
            </Link>
            <Link
              href="/events?status=completed"
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                status === 'completed'
                  ? 'bg-primary-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Selesai
            </Link>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="container-custom py-12">
        {events.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Belum ada event tersedia</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {events.map((event) => (
              <article
                key={event.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group flex flex-col md:flex-row"
              >
                {/* Cover Image */}
                <Link
                  href={`/events/${event.slug}`}
                  className="block relative w-full md:w-64 h-64 md:h-auto flex-shrink-0 overflow-hidden"
                >
                  <Image
                    src={event.coverImage}
                    alt={event.title}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4 flex flex-col gap-2">
                    <span className={`px-3 py-1 ${statusColors[event.status]} text-xs font-medium rounded-full`}>
                      {statusLabels[event.status]}
                    </span>
                    {event.featured && (
                      <span className="px-3 py-1 bg-secondary-600 text-white text-xs font-medium rounded-full">
                        Featured
                      </span>
                    )}
                  </div>
                </Link>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  {/* Category */}
                  <div className="text-xs text-primary-600 font-medium mb-2">
                    {EVENT_CATEGORIES[event.category]}
                  </div>

                  {/* Title */}
                  <Link href={`/events/${event.slug}`}>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {event.title}
                    </h2>
                  </Link>

                  {/* Description */}
                  <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                    {event.description}
                  </p>

                  {/* Event Info */}
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-start gap-2">
                      <Calendar className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium">
                          {format(new Date(event.startDate), 'd MMMM yyyy', { locale: id })}
                        </p>
                        {event.startDate !== event.endDate && (
                          <p className="text-xs text-gray-500">
                            s/d {format(new Date(event.endDate), 'd MMMM yyyy', { locale: id })}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{event.location.name}</span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <Link
                    href={`/events/${event.slug}`}
                    className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    Lihat Detail
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
