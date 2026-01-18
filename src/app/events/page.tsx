import { Metadata } from 'next';
import Link from 'next/link';
import { JsonEventRepository } from '@/infrastructure/repositories/JsonEventRepository';
import { EventsGrid } from '@/features/events/components/EventsGrid';

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
    <div className="min-h-screen bg-white">
      {/* Hero Section - Bold & Minimal */}
      <section className="relative bg-gray-900 text-white py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/50 to-gray-900" />
        <div className="container-custom relative z-10">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 leading-tight">
            Event
          </h1>
          <p className="text-2xl text-gray-300 max-w-3xl leading-relaxed">
            Kegiatan dan acara terkini dari HMJF UIN Alauddin Makassar
          </p>
        </div>
      </section>

      {/* Status Filter - Floating Pills */}
      <section className="sticky top-16 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="container-custom py-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <Link
              href="/events"
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                !status
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Event
            </Link>
            <Link
              href="/events?status=upcoming"
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                status === 'upcoming'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Akan Datang
            </Link>
            <Link
              href="/events?status=completed"
              className={`px-6 py-3 rounded-full font-semibold whitespace-nowrap transition-all ${
                status === 'completed'
                  ? 'bg-gray-900 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Selesai
            </Link>
          </div>
        </div>
      </section>

      {/* Events Grid - Animated */}
      <section className="container-custom py-16">
        <EventsGrid events={events} statusColors={statusColors} statusLabels={statusLabels} />
      </section>
    </div>
  );
}
