# RekapinApp: Sistem Rekapitulasi Gaji dan Absensi Karyawan Berbasis Web

![Banner RekapinApp (contoh placeholder, bisa diganti dengan screenshot aplikasi nanti)](https://via.placeholder.com/1200x400?text=RekapinApp+-+Sistem+Gaji+%26+Absensi)

Sebuah solusi modern untuk mengotomatisasi rekapitulasi gaji dan absensi karyawan, menghilangkan metode manual berbasis Excel yang rentan kesalahan dan tidak efisien. Dibangun dengan Next.js App Router dan dilengkapi dengan sistem manajemen peran (role-based access control) yang kuat.

---

## 🚀 Gambaran Proyek

RekapinApp dirancang untuk mengatasi tantangan rekapitulasi gaji dan absensi karyawan secara manual yang memakan waktu dan berisiko tinggi. Dengan sistem ini, admin dapat melakukan input data harian secara real-time, supervisor dapat memverifikasi, dan super admin dapat memantau serta mengekspor laporan gaji dengan mudah.

**Manfaat Utama:**
* **Efisiensi Waktu**: Mengurangi beban kerja admin secara signifikan.
* **Akurasi Data**: Meminimalkan kesalahan input dan perhitungan.
* **Transparansi & Monitoring**: Visibilitas real-time untuk admin, super admin, dan owner.
* **Scalable**: Dibangun dengan teknologi modern yang mendukung pengembangan lebih lanjut menjadi sistem HR yang lebih besar.

---

## ✨ Fitur Utama

* **Autentikasi Pengguna & Manajemen Peran (Role-Based Access Control)**:
    * Sistem login aman menggunakan NextAuth.js.
    * Dukungan peran pengguna: `SUPER_ADMIN`, `OWNER`, `ADMIN`.
    * Perlindungan rute berbasis peran menggunakan Next.js Middleware.
    * Manajemen daftar pengguna (`SUPER_ADMIN` dapat melihat daftar semua pengguna).
* **(Segera Hadir)** Modul Absensi Harian: Input jam masuk, istirahat, dan pulang.
* **(Segera Hadir)** Perhitungan Gaji Otomatis: Jam kerja, lembur, potongan, dan pinjaman.
* **(Segera Hadir)** Dashboard Monitoring Interaktif.
* **(Segera Hadir)** Ekspor Laporan: Slip Gaji (PDF) dan Rekap Bulanan (Excel).
* **(Segera Hadir)** Notifikasi dan Pengingat Sistem.

---

## 🛠️ Teknologi yang Digunakan

* **Frontend & Backend**: [Next.js 15.4.1](https://nextjs.org/) (App Router) dengan [Turbopack](https://nextjs.org/docs/advanced-features/using-turbopack) untuk pengembangan yang lebih cepat.
* **Styling**: [Tailwind CSS](https://tailwindcss.com/)
* **Autentikasi**: [NextAuth.js 4.x](https://next-auth.js.org/)
* **ORM**: [Prisma 6.x](https://www.prisma.io/)
* **Database**: [PostgreSQL](https://www.postgresql.org/download/)
* **Hashing Password**: [bcrypt-ts](https://github.com/dcodeIO/bcrypt.js)
* [cite_start]**(Akan Datang)** PDF Generation: `@react-pdf/renderer` [cite: 469]
* [cite_start]**(Akan Datang)** Excel Export: `sheetjs/xlsx` [cite: 470]
* [cite_start]**(Akan Datang)** Testing: Jest, React Testing Library, Cypress [cite: 471]
* [cite_start]**Hosting Target**: Docker Home Server [cite: 471]

---

## 🚀 Instalasi & Setup Proyek (Lokal)

Ikuti langkah-langkah di bawah ini untuk menjalankan RekapinApp di lingkungan pengembangan lokal Anda.

### Prasyarat

Pastikan Anda telah menginstal:
* [Node.js](https://nodejs.org/en/download/) (disarankan versi LTS seperti 18.x atau 20.x)
* [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) (biasanya terinstal bersama Node.js)
* [PostgreSQL Server](https://www.postgresql.org/download/) terinstal dan berjalan. Anda bisa menggunakan [pgAdmin](https://www.pgadmin.org/download/) untuk pengelolaan database GUI.

### 1. Kloning Repositori

```bash
git clone https://github.com/RezaPahlevii/rekapin-app.git
cd rekapin-app