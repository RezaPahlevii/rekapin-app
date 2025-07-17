import 'next-auth'; // Ini penting agar deklarasi ini memperluas module NextAuth.js

declare module 'next-auth' {
  interface Session {
    user: {
      id: string; // Tambahkan properti id ke User di Session
      role: string; // Tambahkan properti role ke User di Session
    } & DefaultSession['user']; // Pertahankan properti default lainnya
  }

  interface User {
    role: string; // Tambahkan properti role ke User
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string; // Tambahkan properti id ke JWT token
    role: string; // Tambahkan properti role ke JWT token
  }
}