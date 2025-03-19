'use server'
import { NextRequest, NextResponse } from "next/server";
import { fail } from "@/app/lib/api/response";
import jwt from "jsonwebtoken";
import User from "../../models/User/userModel";

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

    const decodedtoken = await jwt.verify(token, secretKey) as { email: string, username: string }
    if (!decodedtoken || !decodedtoken.email || !decodedtoken.username) {
      return fail("Invalid token", 401);
    }
    const currentTime = Date.now();
    const user = await User.findOneAndUpdate({
      email: decodedtoken.email,
      verificationToken:token,
      tokenExpires: { $gt: currentTime },
    }, { verified: true }).select("verified")

    if (!user) {
      return fail("Invalid request.", 500);
    }

    // if (Date.now() > user.tokenExpires) {

    //   const verificationToken = jwt.sign(
    //     { fullname: user.fullname, email: user.email },
    //     secretKey,
    //     { expiresIn: "24h" }
    //   );
    //   let text = `visit this link to verify your mail link`;
    //   handleEmailVerification(
    //     "verification of email",
    //     text,
    //     decodedtoken.email,
    //     text
    //   );
    //   await User.updateOne(
    //     { email: decodedtoken.email },
    //     { verificationToken, tokenExpires: Date.now() + 24 * 60 * 60 * 1000 }
    //   );
    //   throw new BadRequest("token expired resending link to user");
    // }

    if (!user.verified) {
      await User.updateOne(
        { email: decodedtoken.email },
        { isverified: true, verificationToken: null, tokenExpires: null }
      );
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