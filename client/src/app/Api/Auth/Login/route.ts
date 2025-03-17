'use server';

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "../../models/User/userModel";
import dbConnect from "../../../lib/api/databaseConnect";

export async function POST(request: NextRequest, res: NextResponse) {

  try {
    
    const {  email, password } = await request.json();
    
    
    if (!email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    await dbConnect();
    console.log(email)
  
    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return NextResponse.json({ success: false, message: "Email not in use" }, { status: 400 });
    }


      // Verify the password
      const isPasswordValid = await bcrypt.compare(password, existingUser.password);
      if (!isPasswordValid) {
        return NextResponse.json({ success: false, message: "Invalid Password" }, { status: 401 });
      }

    // Generate JWT
    const token = jwt.sign(
      { id: existingUser._id, email: existingUser.email }, // Payload
      "secret",             // Secret key
      { expiresIn: process.env.JWT_EXPIRES_IN || "24h" } // Expiration time
    
    );
    // Return success response with token
    return NextResponse.json({
      success: true,
      message: "User Login successfully",
      token,
      user: {
        id: existingUser._id,
        name: existingUser.name,
      },
    }, { status: 200 });

  } catch (error) {
    console.error("Login Error:", error);

    // Handle server error
    return NextResponse.json({
      success: false,
      message: "Server error occurred",
      error: error.message,
    }, { status: 500 });
  }
}
