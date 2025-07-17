// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  async function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Logika Otorisasi untuk Rute Dashboard
    if (pathname.startsWith("/dashboard")) {
        if (token && pathname.startsWith("/dashboard/users")) {
            if (token.role !== "SUPER_ADMIN") {
                return NextResponse.redirect(new URL("/dashboard", req.url)); // Redirect jika role tidak sesuai
            }
        }
    }

    // Redirect user yang sudah login dari halaman /login
    if (pathname === "/login" && token) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next(); // Lanjutkan request jika tidak ada masalah
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Izinkan akses ke halaman /login TANPA autentikasi agar form bisa ditampilkan.
        if (req.nextUrl.pathname === "/login") {
          return true;
        }
        // Untuk rute lain yang di-match, user harus terautentikasi.
        return !!token;
      },
    },
  }
);

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};