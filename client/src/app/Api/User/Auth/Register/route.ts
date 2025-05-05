'use server';

import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import handleEmailVerification from "../../../../lib/api/emailVerification";
import dbConnect from "../../../../lib/api/databaseConnect";
import { fail, success } from "@/app/lib/api/response";
import User from "@/app/lib/api/models/User/userModel";
import { getBloom } from "@/app/lib/api/generateHash";
import mongoose from "mongoose";
import { middleware } from "@/app/Api/middleware/route";

export const validateUserInput = (username: string, email: string, password: string) => {
  const errors: string[] = [];
  
  if (username.length < 3 || username.length > 12) {
    errors.push("Username must be between 3 and 12 characters");
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email) || email.length > 254) {
    errors.push("Invalid email format");
  }

  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,20}$/;
  if (!passwordRegex.test(password)) {
    errors.push("Password must be 6-20 characters, include uppercase, lowercase, and a number");
  }

  return errors;
};


export async function POST(req: NextRequest) {
  try {
    await middleware(req)
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const origin = process.env.NEXT_PUBLIC_ORIGIN;
    if (!secretKey || !origin ) {
      return fail("Missing server configuration", 500);
    }

    const { username, email, password } = await req.json();
    if (!username || !email || !password) {
      return fail("All fields are required", 400);
    }

    const errors = validateUserInput(username, email, password);
    if (errors.length > 0) {
      return fail(errors.join(", "), 400);
    }

    await dbConnect();

    const existingUser = await User.findOne({ email }).select("_id");
    if (existingUser) {
      return fail("Email already in use", 400);
    }

    const tokenExpiry = Number(process.env.NEXT_PUBLIC_TOKEN_EXPIRY) ;
    const verificationToken = jwt.sign({ username, email }, secretKey, { expiresIn: tokenExpiry ? tokenExpiry : "24h" });

    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      await User.create({
        username,
        email,
        password,
        verificationToken
      });
  

      const bloom = await getBloom();
      if(bloom){
        bloom.add(username);
      }
  
      try {
        const url = `${origin}/verify/${verificationToken}`;
        const encodeurl = encodeURI(url);
        const text = `Visit this link: ${encodeurl} to verify your email. 
        If link expires please visit this link - ${origin}/Reverify/
        `;
  
        await handleEmailVerification("Email Verification", text, email, text);
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
  
     await session.commitTransaction();
     await session.endSession();
    } catch (error) {
     await session.abortTransaction();
     await session.endSession();
     console.log(error)
      return fail("failed to create account.");
    }
   

    return success("User registered successfully. Please check your mail to verify account.", {
    }, 201);
  } catch (error: unknown) {
    console.error("Registration Error:", error);
    return fail("Server error occurred. Please try again.", 500);
  }
}
