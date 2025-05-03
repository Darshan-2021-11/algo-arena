'use server';

import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../lib/api/models/User/userModel";
import dbConnect from "../../../../lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import mongoose from "mongoose";

export async function POST(request: NextRequest) {
  try {
    const cookiestore = cookies();
    const token = cookiestore.get("decodedtoken")?.value as string;
    if (!token) {
      return fail("Unauthorized access", 403);
    }
    const decodedtoken = await  JSON.parse(token) as { id: string, name: string, admin?: boolean };

    const body = await request.json();
    const email = body.email;
    if (!email) {
      return fail("newPassword is required.", 400);
    }

    await dbConnect();

    const i = await User.findOneAndUpdate({
      _id: new mongoose.Types.ObjectId(decodedtoken.id)
    }, { email })

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
