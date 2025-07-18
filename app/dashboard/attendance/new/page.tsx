// app/dashboard/attendance/new/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface UserSelection {
  id: string;
  name: string;
  email: string;
}

interface ExistingAttendance {
  userId: string;
  date: string;
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


export default function AddAttendancePage() {
  const router = useRouter();

  const [users, setUsers] = useState<UserSelection[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UserSelection[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [date, setDate] = useState<string>('');
  const [timeInMorning, setTimeInMorning] = useState<string>('');
  const [timeOutNoon, setTimeOutNoon] = useState<string>('');
  const [timeInAfternoon, setTimeInAfternoon] = useState<string>('');
  const [timeOutEvening, setTimeOutEvening] = useState<string>('');

  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const [existingAttendances, setExistingAttendances] = useState<ExistingAttendance[]>([]);

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const usersResponse = await fetch('/api/users');
        if (!usersResponse.ok) {
          const errorData = await usersResponse.json();
          throw new Error(errorData.message || 'Gagal mengambil daftar pengguna.');
        }
        const usersData: UserSelection[] = await usersResponse.json();
        setUsers(usersData);

        const attendanceResponse = await fetch('/api/attendance');
        if (!attendanceResponse.ok) {
          const errorData = await attendanceResponse.json();
          throw new Error(errorData.message || 'Gagal mengambil daftar absensi yang sudah ada.');
        }
        const attendanceData: RawAttendanceRecord[] = await attendanceResponse.json();

        const formattedAttendance = attendanceData.map((att: RawAttendanceRecord) => ({
          userId: att.userId,
          date: new Date(att.date).toISOString().split('T')[0],
        }));
        setExistingAttendances(formattedAttendance);

        const today = new Date().toISOString().split('T')[0];
        setDate(today);

        const initialFilteredUsers = usersData.filter(user =>
          !formattedAttendance.some(att => att.userId === user.id && att.date === today)
        );
        setFilteredUsers(initialFilteredUsers);
        if (initialFilteredUsers.length > 0) {
          setSelectedUserId(initialFilteredUsers[0].id);
        } else if (usersData.length > 0) {
          setSelectedUserId(usersData[0].id);
        }

      } catch (error) {
        const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan tidak diketahui saat mengambil data awal.';
        setError(errorMessage);
      } finally {
        setLoadingUsers(false);
      }
    };

    fetchInitialData();
  }, []);


  useEffect(() => {
    if (users.length === 0) return;

    const currentFilteredUsers = users.filter(user =>
      !existingAttendances.some(att => att.userId === user.id && att.date === date)
    );
    setFilteredUsers(currentFilteredUsers);

    if (currentFilteredUsers.length > 0 && !currentFilteredUsers.some(user => user.id === selectedUserId)) {
      setSelectedUserId(currentFilteredUsers[0].id);
    } else if (currentFilteredUsers.length === 0 && users.length > 0) {
      setSelectedUserId('');
    } else if (currentFilteredUsers.length === 0 && users.length === 0) {
      setSelectedUserId('');
    }

  }, [date, users, existingAttendances, selectedUserId]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (filteredUsers.length === 0 && users.length > 0 && existingAttendances.some(att => att.date === date && users.some(u => u.id === att.userId))) {
      setError('Semua karyawan sudah diinput absensinya untuk tanggal ini.');
      return;
    }
    if (!selectedUserId || !date || !timeInMorning || !timeOutNoon || !timeInAfternoon || !timeOutEvening) {
      setError('Semua field wajib diisi.');
      return;
    }

    try {
      const payload = {
        userId: selectedUserId,
        date,
        timeInMorning,
        timeOutNoon,
        timeInAfternoon,
        timeOutEvening,
      };

      const response = await fetch('/api/attendance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 409) {
          throw new Error(errorData.message || 'Absensi untuk karyawan dan tanggal ini sudah ada.');
        }
        throw new Error(errorData.message || 'Gagal menambahkan absensi.');
      }

      setSuccess('Absensi berhasil ditambahkan!');
      setTimeInMorning('');
      setTimeOutNoon('');
      setTimeInAfternoon('');
      setTimeOutEvening('');
      setExistingAttendances(prev => [...prev, { userId: selectedUserId, date: date }]);

      router.push('/dashboard/attendance');
    } catch (error) {
      const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan tidak diketahui saat menambahkan absensi.';
      setError(errorMessage);
    }
  };

  if (loadingUsers) {
    return <div className="container mx-auto p-4 max-w-md text-center">Loading users for attendance...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Input Absensi Harian</h1>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-6 mb-8">
        {success && <p className="text-green-600 mb-4">{success}</p>}
        {error && <p className="text-red-600 mb-4">{error}</p>}

        <div className="mb-4">
          <label htmlFor="user" className="block text-gray-700 text-sm font-bold mb-2">Pilih Karyawan:</label>
          <select
            id="user"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required={filteredUsers.length > 0}
            disabled={filteredUsers.length === 0 && users.length > 0}
          >
            {filteredUsers.length === 0 && users.length > 0 ? (
              <option value="">Semua karyawan sudah diinput absensinya untuk tanggal ini</option>
            ) : (
              filteredUsers.map(user => (
                <option key={user.id} value={user.id}>{user.name} ({user.email})</option>
              ))
            )}
            {filteredUsers.length === 0 && users.length === 0 && (
              <option value="">Tidak ada karyawan tersedia</option>
            )}
          </select>
          {filteredUsers.length === 0 && users.length > 0 && (
             <p className="text-red-500 text-sm mt-2">Penting: Semua karyawan sudah diinput absensinya untuk tanggal ini. Pilih tanggal lain.</p>
          )}
        </div>

        <div className="mb-4">
          <label htmlFor="date" className="block text-gray-700 text-sm font-bold mb-2">Tanggal:</label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        {/* Input Jam Masuk, Istirahat, Pulang */}
        <div className="mb-4">
          <label htmlFor="timeInMorning" className="block text-gray-700 text-sm font-bold mb-2">Jam Masuk Pagi (00:00):</label>
          <input
            type="time"
            id="timeInMorning"
            value={timeInMorning}
            onChange={(e) => setTimeInMorning(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="timeOutNoon" className="block text-gray-700 text-sm font-bold mb-2">Jam Keluar Siang (Istirahat):</label>
          <input
            type="time"
            id="timeOutNoon"
            value={timeOutNoon}
            onChange={(e) => setTimeOutNoon(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="timeInAfternoon" className="block text-gray-700 text-sm font-bold mb-2">Jam Masuk Sore (Setelah Istirahat):</label>
          <input
            type="time"
            id="timeInAfternoon"
            value={timeInAfternoon}
            onChange={(e) => setTimeInAfternoon(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="timeOutEvening" className="block text-gray-700 text-sm font-bold mb-2">Jam Pulang Sore:</label>
          <input
            type="time"
            id="timeOutEvening"
            value={timeOutEvening}
            onChange={(e) => setTimeOutEvening(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            required
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Simpan Absensi
          </button>
          <Link href="/dashboard" className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
            Kembali ke Dashboard
          </Link>
        </div>
      </form>
    </div>
  );
}