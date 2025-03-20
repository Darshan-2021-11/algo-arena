'use server';

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../lib/api/models/User/userModel";
import dbConnect from "../../../lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import handleEmailVerification from "@/app/lib/api/emailVerification";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return fail("email is required.", 400);
    }

    await dbConnect();

    const existingUser = await User.findOne({ email }).select("email username");
    if (!existingUser) {
      return fail("User with this email does not exist.", 404);
    }

    const secretKey = process.env.NEXT_PUBLIC_NEXT_PUBLIC_JWT_SECRET || "fallbackSecret";
    const resetToken = jwt.sign(
      { email: existingUser.email, id: existingUser._id },
      secretKey,
      { expiresIn: "1h" }
    );

    existingUser.resetToken = resetToken;
    existingUser.resetTokenExpires = Date.now() + 60 * 60 * 1000; 
    await existingUser.save();

    const resetLink = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/reset-password?token=${resetToken}`;



    try {
      const text = `Visit this link: ${resetLink} to verify your email. Link will be expired in 1 hour.`;

      await handleEmailVerification("Reset password", text, email, text);
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
    }

    return NextResponse.json({
      success: true,
      message: "Password reset email has been sent.",
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
