'use server'
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import User from "@/app/lib/api/models/User/userModel";
import dbConnect from "@/app/lib/api/databaseConnect";


export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const secretkey = process.env.JWT_SECRET;
        if (!secretkey) return fail("Server not working.");

        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) return fail("Invalid request.", 400);
        const data = jwt.verify(token, secretkey) as { name: string, id: string };
        await dbConnect();
        const user = await User.findOne({ username: data.name }).select("isdeleted admin");
        if (!user || user.isdeleted) return fail("User not found.");

        // const crefToken = await generateCustomToken(req.headers.get('userAgent'));

        // if (!crefToken) return fail("Server is not working")


        const response = NextResponse.json({
            user: {
                id:user._id,
                name:data.name,
                admin:user.admin
            },
            message: "successffully information fetched.",
            success: true
        }, { status: 200 })

        // response.cookies.set("x-cref-token", crefToken, {
        //     httpOnly: true,
        //     maxAge: 24 * 60 * 60,
        //     path: "/",
        //     secure: process.env.NODE_ENV === "production",
        //     sameSite: "strict",
        // });

        return response

    } catch (error: any) {
        const message = error.message || "Something went wrong.";
        return fail(message);
    }
}