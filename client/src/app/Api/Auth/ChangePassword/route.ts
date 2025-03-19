'use server';

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "../../models/User/userModel";
import dbConnect from "../../../lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";

export async function POST(request: NextRequest) {
  try {
    const { token, newPassword } = await request.json();


    if (!token || !newPassword) {
      return fail("Token and newPassword are required.", 400);
    }

    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET || "fallbackSecret";
    let decodedToken;
    try {
      decodedToken = jwt.verify(token, secretKey) as { email: string, id: string };
    } catch (err) {
      return fail("Invalid or expired token.", 400);
    }

    await dbConnect();

    const user = await User.findOne({
      _id: decodedToken.id,
      token: token,
      tokenExpires: { $gt: Date.now() },
    });

    if (!user) {
      return fail("Invalid or expired reset token.", 400);
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    user.token = null; // Clear reset token
    user.tokenExpires = null;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password successfully reset.",
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
