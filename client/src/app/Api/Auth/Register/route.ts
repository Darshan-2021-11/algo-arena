'use server';

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "../../models/userModel";
import handleEmailVerification from "../../models/emailVerification";
import dbConnect from "../../models/databaseConnect";

export async function POST(request: NextRequest, res: NextResponse) {

  try {
    const secretKey = process.env.SECRET_KEY;
    if (!secretKey) {
      throw new Error(
        "Secret key not found."
      );
    }
    
    const { name, email, password } = await request.json();
console.log(email)
    
    if (!name || !email || !password) {
      return NextResponse.json({ success: false, message: "All fields are required" }, { status: 400 });
    }

    await dbConnect();

  
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ success: false, message: "Email already in use" }, { status: 400 });
    }
    console.log(existingUser)

    const hashedPassword = await bcrypt.hash(password, 10);

    const verificationToken = jwt.sign({ name, email }, secretKey, {
      expiresIn: "24h",
    });

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
    });

    await newUser.save();

    const url = process.env.ORIGIN+"/verify/"+verificationToken;
    const encodeurl = encodeURI(url);
    let text = `visit this link:${encodeurl} to verify your mail link`;
    handleEmailVerification("verification of email", text, email, text);

    // Return success response with token
    return NextResponse.json({
      success: true,
      message: "User registered successfully, Please verify your account",
      user: {
        id: newUser._id,
        name: newUser.name,
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Registration Error:", error);

    // Handle server error
    return NextResponse.json({
      success: false,
      message: "Server error occurred",
      error: error.message,
    }, { status: 500 });
  }
}
