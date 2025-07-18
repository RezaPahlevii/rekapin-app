// types/next-auth.d.ts
import 'next-auth';
import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      role: string;
    } & DefaultSession['user'];
  }

  interface User {
    id: string; // Tambahkan id di sini
    name: string; // Tambahkan name
    email: string; // Tambahkan email
    role: string; // role sudah ada
    image?: string; // image opsional
    emailVerified?: Date | null; // emailVerified opsional
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: string;
  }
}