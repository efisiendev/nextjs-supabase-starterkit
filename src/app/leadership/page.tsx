import { Metadata } from 'next';
import Image from 'next/image';
import { JsonLeadershipRepository } from '@/infrastructure/repositories/JsonLeadershipRepository';
import { DIVISIONS } from '@/lib/constants';
import { Mail, Phone, Instagram, Linkedin } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Kepengurusan - HMJF UIN Alauddin',
  description: 'Struktur kepengurusan Himpunan Mahasiswa Jurusan Farmasi UIN Alauddin Makassar',
};

const positionLabels = {
  'ketua': 'Ketua',
  'wakil-ketua': 'Wakil Ketua',
  'sekretaris': 'Sekretaris',
  'bendahara': 'Bendahara',
  'coordinator': 'Koordinator',
  'member': 'Anggota',
};

export default async function LeadershipPage() {
  const leadershipRepo = new JsonLeadershipRepository();
  const coreLeadership = await leadershipRepo.getCore();
  const allLeadership = await leadershipRepo.getAll();

  // Group by division
  const divisionLeadership = allLeadership.filter((member) => member.division);
  const groupedByDivision = divisionLeadership.reduce((acc, member) => {
    const div = member.division!;
    if (!acc[div]) acc[div] = [];
    acc[div].push(member);
    return acc;
  }, {} as Record<string, typeof divisionLeadership>);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero */}
      <section className="relative bg-gradient-to-r from-primary-600 to-primary-700 text-white py-16">
        <div className="container-custom">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Kepengurusan</h1>
          <p className="text-xl text-primary-100 max-w-2xl">
            Struktur kepengurusan HMJF UIN Alauddin periode 2025-2026
          </p>
        </div>
      </section>

      {/* Core Leadership */}
      <section className="container-custom py-16">
        <h2 className="text-3xl font-bold text-center mb-12">Pengurus Inti</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {coreLeadership.map((member) => (
            <div key={member.id} className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group">
              <div className="relative h-64 overflow-hidden bg-gradient-to-br from-primary-100 to-primary-50">
                <Image
                  src={member.photo}
                  alt={member.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              </div>
              <div className="p-6 text-center">
                <h3 className="font-bold text-xl text-gray-900 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{positionLabels[member.position]}</p>
                {member.email && (
                  <a href={`mailto:${member.email}`} className="text-sm text-gray-600 hover:text-primary-600 flex items-center justify-center gap-1">
                    <Mail className="w-4 h-4" />
                    {member.email}
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Division Leadership */}
      <section className="bg-white py-16">
        <div className="container-custom">
          <h2 className="text-3xl font-bold text-center mb-12">Koordinator Divisi</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Object.entries(groupedByDivision).map(([division, members]) => (
              <div key={division}>
                <h3 className="font-bold text-lg text-primary-700 mb-4">{DIVISIONS[division as keyof typeof DIVISIONS]}</h3>
                <div className="space-y-4">
                  {members.map((member) => (
                    <div key={member.id} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors">
                      <div className="flex items-center gap-3">
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={56}
                          height={56}
                          className="rounded-full object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate">{member.name}</p>
                          <p className="text-sm text-gray-600">{positionLabels[member.position]}</p>
                          {member.email && (
                            <a href={`mailto:${member.email}`} className="text-xs text-primary-600 hover:underline truncate block">
                              {member.email}
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
