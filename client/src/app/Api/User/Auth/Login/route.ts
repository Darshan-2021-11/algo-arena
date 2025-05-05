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
  username: string
  password: string
  rememberme?: boolean
  email: string
}

interface validateoutput {
  query: {
    username?: string
    email?: string
  }
  success: boolean
  message: string
}


const validateInput = (data: reqbody): validateoutput => {
  const op: validateoutput = {
    success: false,
    message: "",
    query: {},
  }
  try {
    const { username, email, password } = data;

    if ((!username && !email) || !password) {
      op.message = "All fields are required"
      return op;
    }


    if (email) {
      const isemail = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
      if (isemail.test(email)) {
        op.query = { email };
      }
    }

    if (username) {
      if (username.length < 3 || username.length > 12) {
        op.message = "username size must be between 3 to 12"
        return op;
      }
      op.query = { username };
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

export async function POST(req: NextRequest) {
  try {
    ;
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

    const userdata = await User.aggregate([
      { $match: query },
      { $lookup: { from: "dps", localField: "_id", foreignField: "user", as: "photo" } },
      { $project: { username: 1, password: 1, verified: 1, admin: 1, email: 1, "photo.type": 1, "photo.size": 1, "photo.data": 1 } }
    ])


    if (userdata.length == 0) {
      return fail("Invalid username or password.", 400);
    }
    const existingUser = userdata[0];

    if (!existingUser.verified) {
      return fail("Invalid username or password.", 403);
    }

    const isPasswordValid = await bcrypt.compare(data.password, existingUser.password);
    if (!isPasswordValid) {
      return fail("Invalid username or password.", 403);
    }

    const tokenval: { id: string, name: string, admin?: boolean } = {
      id: existingUser._id, name: existingUser.username
    }

    if (existingUser.admin) {
      tokenval.admin = true;
    }

    const token = jwt.sign(
      tokenval,
      secret,
      { expiresIn: 15 * 60 }
    );

    const user: { id: string, name: string, admin?: boolean, email: string, photo: { type: string, size: number, data: string } } = {
      id: existingUser._id,
      name: existingUser.username,
      email: existingUser.email,
      photo: existingUser.photo[0]
    };


    if (existingUser.admin) {
      user.admin = true;
    }

    const response = NextResponse.json({
      success: true,
      message: "User Login successfully",
      user: user,
    }, { status: 200 });

    const crefToken = randomBytes(32).toString("hex");
    const refreshToken = randomBytes(64).toString("hex");

    response.cookies.set("token", token, {
      httpOnly: true,
      maxAge: 15 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
    });

    response.cookies.set("refresh-token", refreshToken, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    })

    response.cookies.set("x-cref-token", crefToken, {
      httpOnly: true,
      maxAge: 15 * 60,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict"
    });

    const redis = await redisConnect();

    if (redis) {
      try {
        await redis.set(refreshToken, JSON.stringify({ crefToken, token, id:existingUser._id }), { EX: 30 * 24 * 60 * 60 });
      } catch (error) {
        console.log(error);
      }
    }

    return response;

  } catch (error: any) {
    return fail(error.message);
  }
}
