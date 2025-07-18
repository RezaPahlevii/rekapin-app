// app/dashboard/users/[id]/edit/page.tsx
'use client';

import { useEffect, useState } from 'react'; // <<< Pastikan 'use' TIDAK ADA di sini
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Definisikan tipe UserData yang akan kita gunakan
interface UserData {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function EditUserPage({ params }: { params: { id: string } }) {
  // PERBAIKAN KRITIS DI SINI: Kembali ke akses langsung params.id
  // Ini adalah metode yang tidak menyebabkan error suspensi.
  const { id } = params; // <<< Akses ID dari params secara langsung

  const router = useRouter();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // State untuk form input
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`/api/users/${id}`);
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil data pengguna.');
        }
        const userData: UserData = await response.json();
        setUser(userData);
        setName(userData.name);
        setEmail(userData.email);
        setRole(userData.role);
      } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan tidak diketahui saat mengambil data pengguna.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const payload: { name: string; email: string; password?: string; role: string } = {
        name,
        email,
        role,
      };
      if (password) {
        payload.password = password;
      }

      const response = await fetch(`/api/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal mengupdate pengguna.');
      }

      setSuccess('Pengguna berhasil diupdate!');
      setPassword('');
      router.push('/dashboard/users');
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan tidak diketahui saat mengupdate pengguna.';
      setError(errorMessage);
    }
  };


  if (loading) {
    return <div className="text-center py-10">Loading user data...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  if (!user) {
    return <div className="text-center py-10 text-gray-600">Pengguna tidak ditemukan.</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Pengguna: {user.name}</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Nama:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password (kosongkan jika tidak diubah):</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Kosongkan jika tidak diubah"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
          <select
            id="role"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          >
            <option value="ADMIN">ADMIN</option>
            <option value="OWNER">OWNER</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Update Pengguna
          </button>
          <Link href="/dashboard/users" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Kembali ke Daftar Pengguna
          </Link>
        </div>
      </form>
    </div>
  );
}