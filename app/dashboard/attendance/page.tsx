// app/dashboard/attendance/page.tsx
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';

interface AttendanceRecord {
  id: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
  date: string;
  timeInMorning?: string;
  timeOutNoon?: string;
  timeInAfternoon?: string;
  timeOutEvening?: string;
}

interface RawAttendanceRecord {
  id: string;
  userId: string;
  date: string;
  timeInMorning?: string;
  timeOutNoon?: string;
  timeInAfternoon?: string;
  timeOutEvening?: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

export default function AttendanceListPage() {
  const [attendanceList, setAttendanceList] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch('/api/attendance');
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Gagal mengambil data absensi.');
        }
        const data: RawAttendanceRecord[] = await response.json();

        const formattedData = data.map((record: RawAttendanceRecord) => ({
          id: record.id,
          user: record.user,
          date: new Date(record.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' }),
          timeInMorning: record.timeInMorning ? new Date(record.timeInMorning).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
          timeOutNoon: record.timeOutNoon ? new Date(record.timeOutNoon).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
          timeInAfternoon: record.timeInAfternoon ? new Date(record.timeInAfternoon).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
          timeOutEvening: record.timeOutEvening ? new Date(record.timeOutEvening).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) : '-',
        }));
        setAttendanceList(formattedData);
      } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan tidak diketahui saat mengambil daftar absensi.';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendance();
  }, []);

  if (loading) {
    return <div className="text-center py-10">Loading daftar absensi...</div>;
  }

  if (error) {
    return <div className="text-center py-10 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Daftar Absensi Harian</h1>
        <Link href="/dashboard/attendance/new" className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md">
          Input Absensi
        </Link>
      </div>
      <div className="overflow-x-auto bg-white shadow-md rounded-lg">
        {attendanceList.length === 0 ? (
          <p className="p-5 text-gray-600 text-center">Belum ada data absensi.</p>
        ) : (
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Karyawan
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jam Masuk
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jam Istirahat
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Masuk Kembali
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Jam Pulang
                </th>
                <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody>
              {attendanceList.map((record) => (
                <tr key={record.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{record.user.name}</p>
                    <p className="text-gray-600 whitespace-no-wrap text-xs">{record.user.email}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{record.date}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{record.timeInMorning}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{record.timeOutNoon}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{record.timeInAfternoon}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <p className="text-gray-900 whitespace-no-wrap">{record.timeOutEvening}</p>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {/* Tombol aksi absensi akan ditambahkan di sini */}
                    <button className="text-indigo-600 hover:text-indigo-900 mr-3">Edit</button>
                    <button className="text-red-600 hover:text-red-900">Hapus</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div className="mt-6 flex justify-center">
        <Link href="/dashboard" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  );
}