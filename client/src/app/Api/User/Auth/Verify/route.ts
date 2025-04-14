'use server'
import { NextRequest, NextResponse } from "next/server";
import { fail } from "@/app/lib/api/response";
import jwt from "jsonwebtoken";
import User from "../../../../lib/api/models/User/userModel";

export async function GET(req: NextRequest, res: NextResponse) {
  try {
    const url = new URL(req.url);
    const token = url.searchParams.get("token");

    if (!token) {
      return fail("Invalid token", 401);
    }

    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    if (!secretKey) {
      return fail("Missing server configuration", 500);
    }

    let decodedtoken;

    try {
      decodedtoken = jwt.verify(token, secretKey) as { email: string, username: string }
    } catch (error) {
      return fail("Invalid or expired token",401);
    }
    
    const currentTime = Date.now();
    const user = await User.findOneAndUpdate({
      email: decodedtoken.email,
      verificationToken:token,
      tokenExpires: { $gt: currentTime },
    }, 
    { verified: true, verificationToken: null, tokenExpires: null },
    {new:true,fields:"_id verified"}
  ).select("")

    if (!user) {
      return fail("Invalid request.", 500);
    }
    return NextResponse.json(
      {
        success: true,
        message: "successfully verified"
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.log(error)
    return fail(error.message ? error.message : "verification failed")
  }
} 