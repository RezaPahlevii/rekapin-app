// app/components/UserActions.tsx
'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function UserActions({ userId }: { userId: string }) {
  const router = useRouter();

  const deleteUser = async () => {
    if (!confirm('Apakah Anda yakin ingin menghapus pengguna ini?')) {
      return;
    }

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Gagal menghapus pengguna.');
      }

      alert('Pengguna berhasil dihapus!');
      router.refresh(); // Client-side revalidation untuk refresh data di tabel
    } catch (error) { // Perbaikan: error: any menjadi error
      const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan tidak diketahui saat menghapus pengguna.';
      console.error('Error deleting user:', error);
      alert(errorMessage);
    }
  };

  return (
    <>
      <Link href={`/dashboard/users/${userId}/edit`} className="text-indigo-600 hover:text-indigo-900 mr-3">
        Edit
      </Link>
      <button onClick={deleteUser} className="text-red-600 hover:text-red-900">
        Hapus
      </button>
    </>
  );
}