'use server';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import User from "../../../../lib/api/models/User/userModel";
import dbConnect from "../../../../lib/api/databaseConnect";
import { fail } from "@/app/lib/api/response";
import { randomBytes } from "crypto";
import { redisConnect } from "@/app/lib/api/redisConnect";

interface reqbody {
  identifier: string
  password: string
  rememberme?: boolean
}

interface validateoutput {
  query: {
    email?: string
    username?: string
  }
  success: boolean
  message: string
}


const validateInput = (data: reqbody): validateoutput => {
  const op = {
    success: false,
    message: "",
    query: {},
  }
  try {
    const { identifier, password } = data;

    if (!identifier || !password) {
      op.message = "All fields are required"
      return op;
    }

    const isemail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (isemail.test(identifier)) {
      if (identifier.length < 3 || identifier.length > 254) {
        op.message = "Invalid email."
        return op;
      }
      op.query = { email: identifier };
    } else {
      if (identifier.length < 3 || identifier.length > 12) {
        op.message = "username size must be between 3 to 12"
        return op;
      }
      op.query = { username: identifier };
    }

    const ispassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/;

    if (!ispassword.test(password)) {
      op.message = "invalid password"
      return op;
    }

    op.success = true;
    op.message = "";
    return op;
  } catch (error: any) {
    console.log(error);
    op.message = "Invalid input."
    return op;
  }

}

export async function POST(req: NextRequest, res: NextResponse) {
  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return fail("Server is not working")
    }

    const data: reqbody = await req.json();


    if (!data) {
      return fail("body is required.", 400);
    }

    const { query, success, message } = validateInput(data);
    if (!success) {
      return fail(message, 400);
    }

    await dbConnect();

    const existingUser = await User.findOne(query).select("username password verified admin");
    if (!existingUser) {
      return fail("Invalid username or password.", 400);
    }

    if (!existingUser.verified) {
      return fail("Invalid username or password.", 403);
    }

    const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
    if (!isPasswordValid) {
      return fail("Invalid username or password.", 403);
    }


    const expiry = data.rememberme
      ? Number(process.env.NEXT_PUBLIC_EXPIRES_IN_30D) ? Number(process.env.NEXT_PUBLIC_EXPIRES_IN_30D) : 24 * 60 * 60 * 30
      : Number(process.env.NEXT_PUBLIC_EXPIRES_IN_24H) ? Number(process.env.NEXT_PUBLIC_EXPIRES_IN_24H) : 24 * 60 * 60;


    const tokenval: { id: string, name: string, admin?: boolean } = {
      id: existingUser._id, name: existingUser.username
    }

    if (existingUser.admin) {
      tokenval.admin = true;
    }

    const token = jwt.sign(
      tokenval,
      secret,
      { expiresIn: expiry }
    );
    const crefToken = randomBytes(32).toString("hex");

    if (!crefToken) {
      return fail("Server is not working")
    }

    const user: { id: string, name: string, admin?: boolean } = {
      id: existingUser._id,
      name: existingUser.username
    };

    if (existingUser.admin) {
      user.admin = true;
    }

    const response = NextResponse.json({
      success: true,
      message: "User Login successfully",
      user: user,
    }, { status: 200 });

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    response.cookies.set("x-cref-token", crefToken, {
      httpOnly: true,
      maxAge: 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    const redis = await redisConnect();

    if (redis) {
      try {
        redis.set(crefToken, existingUser.name, { EX: 3600 });
      } catch (error) {
        console.log(error);
      }
    }

    return response;

  } catch (error: any) {
    return fail(error.message);
  }
}
