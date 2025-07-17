// app/page.tsx
'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';

export default function HomePage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <div className="text-center py-10">Loading session...</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Selamat Datang di RekapinApp!</h1>

      {session ? (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-700 mb-2">Logged in as:</p>
          <p className="text-2xl font-semibold text-blue-600 mb-4">{session.user?.name || session.user?.email}</p>
          <p className="text-lg text-gray-600 mb-6">Role: <span className="font-medium text-purple-600">{session.user?.role}</span></p>

          {/* Navigasi Tambahan */}
          <div className="mt-4 flex flex-col space-y-3">
            {session.user?.role === "SUPER_ADMIN" && (
              <Link href="/dashboard/users" className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Go to User Management
              </Link>
            )}
            <Link href="/dashboard" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
              Go to Dashboard
            </Link>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-6"
          >
            Logout
          </button>
        </div>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <p className="text-xl text-gray-700 mb-6">Anda belum login.</p>
          <Link href="/login" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
            Pergi ke Halaman Login
          </Link>
        </div>
      )}
    </div>
  );
}