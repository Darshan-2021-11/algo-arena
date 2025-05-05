import { NextResponse, NextRequest } from "next/server";
import { cookies } from "next/headers";
import { randomBytes } from "crypto";
import jwt from "jsonwebtoken";
import { fail } from "@/app/lib/api/response";
import { redisConnect } from "@/app/lib/api/redisConnect";

const NotProtected = [
  "/Api/User/Auth/Register",
  "/Api/User/Auth/Login",
  "/Api/User/Auth/ForgotPassword",
  "/Api/User/Auth/MagicLink",
  "/Api/User/Auth/Verify",
  "/Api/User/Auth/RetryVerification",
  "/Api/User/Auth/rotateTokens",
  "/Api/User/Auth/ChangePassword",
  "/Api/User/Auth/Exists/Username"
];

const admin = [
  "/Api/Contest/addProblems",
  "/Api/Contest/removeProblems",
  "/Api/Problems/CreateProblem",
  "/Api/Problems/CreateProblems",
  "/Api/Problems/UpdateProblem",
]

export async function middleware(req: NextRequest) {
  
  const { url } = req;
  const u = new URL(url);
  const { pathname } = u;
  if (!NotProtected.includes(pathname)) {
    try {
      const cookieStore = cookies();
      const contest_secret = process.env.contest_secret;
      const contestserverkey = cookieStore.get("contest_secret");
      if(contest_secret === contestserverkey){
        NextResponse.next();
      }
      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return fail("Server configuration failed", 500);
      }

      const refreshtoken = cookieStore.get("refresh-token")?.value;
      if(!refreshtoken){
        return fail("Unauthorised access", 401);
      }
      const token = cookieStore.get("token")?.value;
      const creftoken = cookieStore.get("x-cref-token")?.value;

      if (!token || !creftoken) {
        return fail("Unauthorised access", 403);
      }


      const redis = await redisConnect();
      if(!redis){
        return fail("Server configuration failed.",500);
      }

   
      const data = await redis.get(refreshtoken) as string | null;
      if(!data){
        return fail("Unauthorised access", 401);
      }

      const storedtokens = await JSON.parse(data) as  {crefToken : string, token:string, id: string};

      if(storedtokens.crefToken !== creftoken || storedtokens.token !== token){
        return fail("unauthorized access.",403);
      }

      const payload  =  jwt.verify(token, secret) as  { id: string, name: string, admin?: boolean };

      if (admin.includes(pathname) && !payload.admin) {
        return fail("Unauthorised access", 401);
      }

      const crefToken= randomBytes(32).toString("hex");
      storedtokens.token = crefToken;

      // await redis.del(refreshtoken);

      await redis.set(refreshtoken,JSON.stringify(storedtokens),{EX:30 * 24 * 60 * 60});
      const response = NextResponse.next();

      response.cookies.set("x-cref-token", crefToken, {
        httpOnly: true,
        maxAge: 15 * 60,
        path: "/",
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict"
      });


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
  runtime: "nodejs"
};