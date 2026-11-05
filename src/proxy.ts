import { getToken } from "next-auth/jwt";
import { NextResponse, type NextRequest } from "next/server";

// First line of defence only. Server Actions can be POSTed to any path, so every
// action and admin data read checks the session again (see src/lib/auth.ts).
export async function proxy(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
  if (token) return NextResponse.next();

  const { pathname, search } = request.nextUrl;
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Необходим е вход." }, { status: 401 });
  }

  // NEXTAUTH_URL rather than request.url: behind the host's reverse proxy,
  // request.url can carry the internal address.
  const loginUrl = new URL("/login", process.env.NEXTAUTH_URL ?? request.url);
  loginUrl.searchParams.set("callbackUrl", `${pathname}${search}`);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/upload-signature"],
};
