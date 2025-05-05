'use server';

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../lib/api/models/User/userModel";
import dbConnect from "../../../../lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

export async function POST(req: NextRequest) {
  try {
    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return fail("Server is not working")
    }

    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (!token) {
      return fail("unauthorized access.", 403);
    }

    const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin?: boolean };

    const body = await req.json();
    const newPassword = body.newPassword;
    if (!newPassword) {
      return fail("newPassword is required.", 400);
    }

    await dbConnect();

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(decodedtoken)
    const i = await User.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(decodedtoken.id)
    }, { password: hashedPassword })

    console.log(i)
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
