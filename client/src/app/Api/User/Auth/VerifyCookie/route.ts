'use server'
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import User from "@/app/lib/api/models/User/userModel";
import dbConnect from "@/app/lib/api/databaseConnect";
import { randomBytes } from "crypto";
import { redisConnect } from "@/app/lib/api/redisConnect";
import mongoose from "mongoose";


export const GET = async (req:NextRequest) => {
    try {
        ;
        const secretkey = process.env.JWT_SECRET;
        if (!secretkey) return fail("Server not working.");

        const cookieStore = cookies();
        const refreshtoken = cookieStore.get("refresh-token")?.value;
        if (!refreshtoken) {
            return fail("unauthorised access.", 401);
        }

        const redis = await redisConnect();

        if (!redis) {
            return fail("Server not working.");
        }

        const redisdata = await redis.get(refreshtoken) as string | null;

        if (!redisdata) {
            return fail("unauthorised access.", 401);
        }


        const storedtokens = await JSON.parse(redisdata) as { crefToken: string, token: string, id: string };

        await dbConnect();
        const userdata = await User.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(storedtokens.id) } },
            { $lookup: { from: "dps", localField: "_id", foreignField: "user", as: "photo" } },
            { $project: { username: 1, password: 1, verified: 1, admin: 1, email: 1, "photo.type": 1, "photo.size": 1, "photo.data": 1 } }
        ])

        if (userdata.length === 0) return fail("User not found.");

        const user = userdata[0];
        if (user.isdeleted) return fail("User not found.");


        const response = NextResponse.json({
            user: {
                id: user._id,
                name: user.username,
                email: user.email,
                admin: user.admin,
                photo: user.photo.length > 0 && user.photo[0]
            },
            message: "successffully information fetched.",
            success: true
        }, { status: 200 })

        const tokenval: { id: string, name: string, admin?: boolean } = {
            id: user._id, name: user.username
        }

        if (user.admin) {
            tokenval.admin = true;
        }

        const token = jwt.sign(
            tokenval,
            secretkey,
            { expiresIn: 15 * 60 }
        );

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

        await redis.set(refreshToken, JSON.stringify({ crefToken, token, id:user._id }), { EX: 30 * 24 * 60 * 60 });
        await redis.del(refreshtoken);

        return response

    } catch (error: any) {
        const message = error.message || "Something went wrong.";
        return fail(message);
    }
}