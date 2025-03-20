'use server';

import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../lib/api/models/User/userModel";
import dbConnect from "../../../../lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import handleEmailVerification from "@/app/lib/api/emailVerification";

interface reqbody {
  email: string; 
}

interface validateoutput {
  query: {
    email: string;
  };
  success: boolean;
  message: string;
}

const validateInput = (data: reqbody): validateoutput => {
  const op = {
    success: false,
    message: "",
    query: {email:""},
  };

  try {
    const { email } = data;

    if (!email) {
      op.message = "email is required.";
      return op;
    }

    const isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isemail.test(email)) {
      if (email.length < 3 || email.length > 254) {
        op.message = "Invalid email.";
        return op;
      }
      op.query = { email };
    } 

    op.success = true;
    op.message = "";
    return op;
  } catch (error: any) {
    console.log(error);
    op.message = "Invalid input.";
    return op;
  }
};

export async function POST(request: NextRequest, res: NextResponse) {
  try {
    const data: reqbody = await request.json();

    if (!data) {
      return fail("Body is required.", 400);
    }

    const { query, success, message } = validateInput(data);
    if (!success) {
      return fail(message, 400);
    }

    await dbConnect();

    const existingUser = await User.findOne(query).select("email username verified verificationToken tokenExpires");
    if (!existingUser) {
      return fail("User not found.", 404);
    }

    if (existingUser.verified) {
      return fail("User is already verified.", 400);
    }

    const currentTime = Date.now();
    if (existingUser.tokenExpires && currentTime < existingUser.tokenExpires) {
      return fail("Verification token is still valid. Please check your email.", 400);
    }

    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET || "fallbackSecret";
    const newVerificationToken = jwt.sign(
      { email: existingUser.email, username: existingUser.username },
      secretKey,
      { expiresIn: "24h" }
    );

    existingUser.verificationToken = newVerificationToken;
    existingUser.tokenExpires = currentTime + 24 * 60 * 60 * 1000; 
    await existingUser.save();

    
        try {
          const url = `${origin}/verify/${newVerificationToken}`;
          const encodeurl = encodeURI(url);
          const text = `Visit this link: ${encodeurl} to verify your email.`;
    
          await handleEmailVerification("Email Verification", text, query.email, text);
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
