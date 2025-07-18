// app/dashboard/page.tsx
'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-center py-10">Loading dashboard...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Dashboard RekapinApp</h1>
      {session && (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-700 mb-2">Selamat datang, {session.user?.name || session.user?.email}!</p>
          <p className="text-lg text-gray-600 mb-6">Role Anda: <span className="font-medium text-purple-600">{session.user?.role}</span></p>

          <div className="mt-4 flex flex-col space-y-3">
            {session.user?.role === "SUPER_ADMIN" && (
              <Link href="/dashboard/users" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Kelola Pengguna
              </Link>
            )}
            {/* Tombol Navigasi Baru untuk Absensi */}
            <Link href="/dashboard/attendance/new" className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Input Absensi Harian
            </Link>
            {/* Link-link dashboard lainnya bisa ditambahkan di sini sesuai role */}
            <Link href="/" className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Kembali ke Beranda
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}