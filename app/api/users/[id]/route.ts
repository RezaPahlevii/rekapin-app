// app/api/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt-ts';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

const prisma = new PrismaClient();

// Fungsi untuk menangani request GET (Mengambil Detail User Berdasarkan ID)
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // PERUBAHAN KRITIS DI SINI: await params
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, name: true, email: true, role: true },
    });

    if (!user) {
      return NextResponse.json({ message: 'Pengguna tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan server.';
    console.error('Error fetching user:', error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Fungsi untuk menangani request PUT (Mengedit Pengguna)
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // PERUBAHAN KRITIS DI SINI: await params
    const { name, email, password, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ message: 'Nama, email, dan role wajib diisi.' }, { status: 400 });
    }

    let hashedPassword = undefined;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        name,
        email,
        password: hashedPassword || undefined,
        role,
      },
    });

    const { password: _, ...resultUser } = updatedUser;
    return NextResponse.json(resultUser, { status: 200 });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan server.';
    console.error('Error updating user:', error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}

// Fungsi untuk menangani request DELETE (Menghapus Pengguna)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user?.role !== 'SUPER_ADMIN') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params; // PERUBAHAN KRITIS DI SINI: await params
    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ message: 'Pengguna berhasil dihapus.' }, { status: 200 });
  } catch (error) {
    const errorMessage = (error instanceof Error) ? error.message : 'Terjadi kesalahan server.';
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: errorMessage }, { status: 500 });
  }
}