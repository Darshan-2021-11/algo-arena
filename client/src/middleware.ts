import { NextResponse, NextRequest } from "next/server";
import { fail } from "./app/lib/api/response";
import { cookies } from "next/headers";
// import jwt from 'jsonwebtoken';
import {jwtVerify} from 'jose';

function isValidUUID(uuid: string): boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
};

const NotProtected = [
  "/Api/User/Auth/Register",
  "/Api/User/Auth/Login",
  "/Api/User/Auth/ForgotPassword",
  "/Api/User/Auth/MagicLink",
  "/Api/User/Auth/Verify",
  "/Api/User/Auth/RetryVerification",
  "/Api/User/Auth/ChangePassword",
  "/Api/User/Auth/Exists/Username"
]

export async function middleware(req: NextRequest) {
  const { url } = req;
  const u = new URL(url);
  const {pathname} = u;
  console.log(NotProtected.includes(pathname),pathname)
  if (!NotProtected.includes(pathname)) {
    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET);
      if (!secret) {
        return fail("Server configuration failed", 500);
      }
      const cookieStore = cookies();
      const token = cookieStore.get("token")?.value;

      if (!token) {
        return fail("Unauthorised access", 403);
      }

      const {payload} = await  jwtVerify(token, secret) as { payload:{ id: string, name: string, admin?: boolean }};
      const response = NextResponse.next();
      console.log(response)
      response.cookies.set("decodedtoken",JSON.stringify(payload));

      return response;
    } catch (error) {
      console.log(error)
      return fail("Unauthorized access.", 403)
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/Api/:path*",
  runtime:"nodejs"
};