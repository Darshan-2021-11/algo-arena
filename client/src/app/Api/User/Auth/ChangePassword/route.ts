'use server';

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../lib/api/models/User/userModel";
import dbConnect from "../../../../lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return fail("Server configuration failed", 500);
    }

    const body = await req.json();
    const newPassword = body.newPassword;
    const token = body.token;
    if (!newPassword || !token) {
      return fail("newPassword and token are required.", 400);
    }
    // const {payload} = jwt.verify(token, secret) as {payload:{ id: string, email: string }};
    console.log(token, secret)
    const payload = jwt.verify(token, secret) as unknown as { id: string; email: string };
    console.log(token)

    await dbConnect();


    const currtime = new Date()
    console.log(currtime)

    const user = await User.findOne({
      _id: new mongoose.Types.ObjectId(payload.id),
      resetToken: token,
      resetTokenExpires: { $gt: currtime },
    }).select("password");

    if (!user) {
      return fail("Invalid or expired reset token.", 400);
    }

    const result = await bcrypt.compare(user.password, newPassword);
    if (result) {
      return fail("please give a new password.")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(payload.id),
    }, { password: hashedPassword, resetToken: null, resetTokenExpires: null })

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
