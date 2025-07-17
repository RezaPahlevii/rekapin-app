// app/login/page.tsx
'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Dapatkan callbackUrl dari URL
    const callbackUrl = searchParams.get('callbackUrl') || '/dashboard/users';

    // Perubahan KRUSIAL di sini:
    // next-auth/react/signIn kadang menerima callbackUrl sebagai properti terpisah,
    // atau sebagai bagian dari object options. Kita akan coba cara yang paling eksplisit.
    const result = await signIn('credentials', {
      redirect: false,
      email,
      password,
      // Hapus callbackUrl di sini jika sebelumnya ada:
      // callbackUrl, // <<< HAPUS BARIS INI JIKA ADA

      // Dan pastikan ini adalah cara kita mengarahkan setelah login berhasil:
    });

    if (result?.error) {
      setError(result.error);
      console.error("Login Error:", result.error);
    } else if (result?.ok) {
      // Pastikan router.push adalah redirect UTAMA kita
      // Coba lakukan console log untuk memastikan callbackUrl benar
      console.log('Login successful. Redirecting to:', callbackUrl);
      router.push(callbackUrl);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg w-full max-w-md">
        <h3 className="text-2xl font-bold text-center text-gray-800">Login RekapinApp</h3>
        <form onSubmit={handleSubmit} className="mt-6">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              placeholder="Masukkan email Anda"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              placeholder="Masukkan password Anda"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-xs italic mb-4 text-center">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
            >
              Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}