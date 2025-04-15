'use server'
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import User from "@/app/lib/api/models/User/userModel";
import dbConnect from "@/app/lib/api/databaseConnect";
import arr from "@/app/Api/utils";
import { randomBytes } from "crypto";
import { redisConnect } from "@/app/lib/api/redisConnect";


export const GET = async () => {
    try {
        const secretkey = process.env.JWT_SECRET;
        if (!secretkey) return fail("Server not working.");

        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return fail("Invalid request.", 400);
        arr.push(token);
        const data = jwt.verify(token, secretkey) as { name: string, id: string };
        await dbConnect();
        const user = await User.findOne({ username: data.name }).select("isdeleted admin");
        if (!user || user.isdeleted) return fail("User not found.");

        const crefToken = randomBytes(32).toString();

        const response = NextResponse.json({
            user: {
                id: user._id,
                name: data.name,
                admin: user.admin
            },
            message: "successffully information fetched.",
            success: true
        }, { status: 200 })

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
                redis.set(crefToken, data.name, { EX: 3600 });
            } catch (error) {
                console.log(error);
            }
        }


        return response

    } catch (error: any) {
        const message = error.message || "Something went wrong.";
        return fail(message);
    }
}