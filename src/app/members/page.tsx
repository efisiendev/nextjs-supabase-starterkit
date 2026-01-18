import { Metadata } from 'next';
import Image from 'next/image';
import { JsonMemberRepository } from '@/infrastructure/repositories/JsonMemberRepository';
import { User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Anggota - HMJF UIN Alauddin',
  description: 'Daftar anggota Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

export default async function MembersPage({
  searchParams,
}: {
  searchParams: { batch?: string; division?: string };
}) {
  const memberRepo = new JsonMemberRepository();
  const { batch, division } = searchParams;

  let members = await memberRepo.getByStatus('active');

  if (batch) {
    members = members.filter((m) => m.batch === batch);
  }
  if (division) {
    members = members.filter((m) => m.division === division);
  }

  // Get unique batches
  const allMembers = await memberRepo.getAll();
  const batches = [...new Set(allMembers.map((m) => m.batch))].sort().reverse();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Anggota</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Daftar anggota aktif HMJF UIN Alauddin Makassar
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="bg-white border-b sticky top-16 z-30">
        <div className="container-custom py-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            <a
              href="/members"
              className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                !batch ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Semua Angkatan
            </a>
            {batches.map((b) => (
              <a
                key={b}
                href={`/members?batch=${b}`}
                className={`px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-colors ${
                  batch === b ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                Angkatan {b}
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Members Grid */}
      <section className="container-custom py-12">
        <div className="mb-6">
          <p className="text-gray-600">
            Menampilkan <span className="font-bold text-gray-900">{members.length}</span> anggota
          </p>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">Tidak ada anggota ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all group"
              >
                <div className="relative h-48 bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center overflow-hidden">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                  ) : (
                    <User className="w-16 h-16 text-primary-300" />
                  )}
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 mb-1 line-clamp-1">{member.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{member.nim}</p>
                  <p className="text-xs text-primary-600 font-medium">Angkatan {member.batch}</p>
                  {member.division && (
                    <p className="text-xs text-gray-500 mt-2 line-clamp-1">{member.division}</p>
                  )}
                  {member.position && (
                    <p className="text-xs text-gray-700 font-medium mt-1">{member.position}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
