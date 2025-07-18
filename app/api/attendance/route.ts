// app/api/attendance/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// FUNGSI INI HARUS DIEKSPOR SEBAGAI NAMED EXPORT
export async function GET(req: Request) { // <<< PASTIKAN 'export' DI SINI
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const attendanceList = await prisma.attendance.findMany({
      orderBy: {
        date: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(attendanceList, { status: 200 });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan server saat mengambil daftar absensi.';
    console.error('Error fetching attendance list:', error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// FUNGSI INI JUGA HARUS DIEKSPOR SEBAGAI NAMED EXPORT
export async function POST(req: Request) { // <<< PASTIKAN 'export' DI SINI
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const {
      userId,
      date,
      timeInMorning,
      timeOutNoon,
      timeInAfternoon,
      timeOutEvening,
    } = await req.json();

    if (!userId || !date || !timeInMorning || !timeOutNoon || !timeInAfternoon || !timeOutEvening) {
      return NextResponse.json({ message: 'Semua field jam dan data karyawan wajib diisi.' }, { status: 400 });
    }

    const fullDate = new Date(date + 'T00:00:00Z');

    const parseTime = (dateStr: string, timeStr: string) => {
        return new Date(`${dateStr}T${timeStr}:00`);
    };

    const timeInMorningDate = parseTime(date, timeInMorning);
    const timeOutNoonDate = parseTime(date, timeOutNoon);
    const timeInAfternoonDate = parseTime(date, timeInAfternoon);
    const timeOutEveningDate = parseTime(date, timeOutEvening);

    const existingAttendance = await prisma.attendance.findUnique({
      where: {
        userId_date: {
          userId: userId,
          date: fullDate,
        },
      },
    });

    if (existingAttendance) {
      return NextResponse.json({ message: 'Absensi untuk karyawan dan tanggal ini sudah ada.' }, { status: 409 });
    }

    const newAttendance = await prisma.attendance.create({
      data: {
        userId,
        date: fullDate,
        timeInMorning: timeInMorningDate,
        timeOutNoon: timeOutNoonDate,
        timeInAfternoon: timeInAfternoonDate,
        timeOutEvening: timeOutEveningDate,
      },
    });

    return NextResponse.json(newAttendance, { status: 201 });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan server.';
    console.error('Error adding attendance:', error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}