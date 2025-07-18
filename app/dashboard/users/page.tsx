// app/dashboard/users/page.tsx
import { PrismaClient } from '@prisma/client';
import Link from 'next/link';
// Hapus import useRouter dan revalidatePath di sini
// import { useRouter } from 'next/navigation'; // <<< HAPUS BARIS INI
// import { revalidatePath } from 'next/cache'; // <<< HAPUS BARIS INI

import UserActions from '@/app/components/UserActions'; // Import Client Component UserActions

const prisma = new PrismaClient();

export default async function UserManagementPage() {
  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
    },
  });

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manajemen Pengguna</h1>
        <Link href="/dashboard/users/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
          Tambah Pengguna
        </Link>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Nama
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Role
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.name}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <p className="text-gray-900 whitespace-no-wrap">{user.email}</p>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <span className={`relative inline-block px-3 py-1 font-semibold leading-tight ${user.role === 'SUPER_ADMIN' ? 'text-green-900' : user.role === 'OWNER' ? 'text-blue-900' : 'text-gray-900'}`}>
                    <span aria-hidden className={`absolute inset-0 opacity-50 rounded-full ${user.role === 'SUPER_ADMIN' ? 'bg-green-200' : user.role === 'OWNER' ? 'bg-blue-200' : 'bg-gray-200'}`}></span>
                    <span className="relative">{user.role}</span>
                  </span>
                </td>
                <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                  <UserActions userId={user.id} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}