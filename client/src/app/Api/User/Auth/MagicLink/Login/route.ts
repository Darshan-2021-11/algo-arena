import User from "@/app/lib/api/models/User/userModel";
import { redisConnect } from "@/app/lib/api/redisConnect";
import { fail } from "@/app/lib/api/response";
import { randomBytes } from "crypto";
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        ;
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail("Server is not working")
        }
        const url = new URL(req.url);
        const mixedtoken = url.searchParams.get("t");
        if (!mixedtoken) {
            return fail("Invalid request");
        }
        const arr = mixedtoken.split("%");
        if (arr.length !== 2) {
            return fail("invalid request.");
        }
        const token = arr[1];
        const email = arr[0];
        const redis = await redisConnect();
        if (redis) {
            const redistoken = await redis.get(email);
            if (redistoken !== token) {
                return fail("invalid request.")
            }
        }

        const user = await User.findOne({ email }).select("username password verified");

        if (!user) {
            return fail("Invalid username or password.", 400);
        }

        if (!user.verified) {
            return fail("Invalid username or password.", 403);
        }


        const tokenval: { id: string, name: string } = {
            id: user._id, name: user.username
        }

        const jwttoken = jwt.sign(
            tokenval,
            secret,
            { expiresIn: 86400 }
        );


        const userdata: { id: string, name: string} = {
            id: user._id,
            name: user.username
        };


        const response = NextResponse.json({
            success: true,
            message: "User Login successfully",
            user: userdata,
        }, { status: 200 });

        const crefToken = randomBytes(32).toString("hex");
        const refreshToken = randomBytes(64).toString("hex");
    
        response.cookies.set("token", token, {
          httpOnly: true,
          maxAge: 15 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
        });
    
        response.cookies.set("refresh-token", refreshToken, {
          httpOnly: true,
          maxAge: 30 * 24 * 60 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax"
        })
    
        response.cookies.set("x-cref-token", crefToken, {
          httpOnly: true,
          maxAge: 15 * 60,
          path: "/",
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax"
        });

        
        if (redis) {
            await redis.del(email);
          await redis.set(refreshToken, JSON.stringify({ crefToken, token, id:user._id }), { EX: 30 * 24 * 60 * 60 });
        }

        return response;

    } catch (error: any) {
        return fail(error?.message);
    }
}