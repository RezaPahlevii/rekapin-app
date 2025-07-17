// app/layout.tsx
import './globals.css';
import { Inter } from 'next/font/google';
import AuthProvider from '../providers/AuthProvider'; // Import AuthProvider yang akan kita buat

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'RekapinApp - Sistem Rekap Gaji & Absensi',
  description: 'Sistem otomatisasi rekapitulasi gaji dan absensi karyawan.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider> {/* Bungkus children dengan AuthProvider */}
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}