// app/api/users/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt-ts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Fungsi untuk menangani request GET (Mengambil Daftar Pengguna)
export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    // Hanya user terautentikasi yang bisa melihat daftar pengguna
    // Admin, Owner, Super Admin bisa melihat daftar users
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true, // Sertakan role jika perlu di sisi client
      },
    });

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan server saat mengambil daftar pengguna.';
    console.error('Error fetching users list:', error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}


// Fungsi untuk menangani request POST (Menambahkan Pengguna Baru)
export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json({ message: 'Semua field wajib diisi.' }, { status: 400 });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) {
      return NextResponse.json({ message: 'Email sudah terdaftar.' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });

    const { password: _, ...resultUser } = newUser;

    return NextResponse.json(resultUser, { status: 201 });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan server.';
    console.error('Error adding user:', error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}