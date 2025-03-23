'use server';

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { fail } from "@/app/lib/api/response";
import handleEmailVerification from "@/app/lib/api/emailVerification";
import User from "@/app/lib/api/models/User/userModel";
import dbConnect from "@/app/lib/api/databaseConnect";



export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    if (!secretKey) {
      return fail("Missing server configuration", 500);
    }

    const { email }: { email: string } = await req.json();
    const isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!isemail.test(email)) {
      return fail("This is not a valid email.");
    }

    await dbConnect();

    const user = await User.findOne({ email }).select("verified tokenExpires username");

    if (!user) {
      return fail("No such user exists.", 404);
    }

    if (user.verified) {
      return fail("user is already verified.");
    }

    const date = Date.now();
    if (date < user.tokenExpires) {
      return fail("verification request is already generated please wait.");
    }

    const tokenExpiry = Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRY);
    const verificationToken = jwt.sign({ username:user.username, email }, secretKey, { expiresIn: tokenExpiry ? tokenExpiry : "24h" });
    const tokenExpires = Date.now() + (24*60*60*1000)

    await User.updateOne({email},{verificationToken,tokenExpires});

     try {
          const url = `${origin}/Verify/${verificationToken}`;
          const encodeurl = encodeURI(url);
          const text = `Visit this link: ${encodeurl} to verify your email. 
          If link expires please visit this link - ${origin}/Reverify/
          `;
    
          await handleEmailVerification("Email Verification", text, email, text);
        } catch (emailError) {
          console.error("Email sending failed:", emailError);
        }

    return NextResponse.json({
      success: true,
      message: "A new verification email has been sent.",
    }, { status: 200 });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json({
      success: false,
      message: "Server error occurred.",
      error: error.message,
    }, { status: 500 });
  }
}
