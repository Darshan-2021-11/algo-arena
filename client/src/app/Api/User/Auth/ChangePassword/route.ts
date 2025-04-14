'use server';

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../lib/api/models/User/userModel";
import dbConnect from "../../../../lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.JWT_SECRET;
    if(!secretKey){
      return fail("Server configuration failed");
    }
    const body = await request.json();
    const newPassword = body.newPassword;
    if ( !newPassword) {
      return fail("newPassword is required.", 400);
    }
    const cookiestore = cookies();
    let token;
    if(!body.token){
      token = cookiestore.get("token")?.value;
    }else token = body.token;

    let decodedToken;
    try {
      decodedToken = jwt.verify(token, secretKey) as { email: string, id: string };
    } catch (err) {
      console.log(err)
      return fail("Invalid or expired token.", 400);
    }

    await dbConnect();

    
    const currtime =  Date.now()

    const user = await User.findOne({
      email: decodedToken.email,
      resetToken: token,
      resetTokenExpires: { $gt: currtime},
    }).select("password");

    if (!user) {
      return fail("Invalid or expired reset token.", 400);
    }

    const result = await bcrypt.compare(user.password,newPassword);
    if(result){
      return fail("please give a new password.")
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.findOneAndUpdate({
      email:decodedToken.email
    },{password:hashedPassword,resetToken:null,resetTokenExpires:null})
    
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
