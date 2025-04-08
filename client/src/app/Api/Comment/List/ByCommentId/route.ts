import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Comment from "@/app/lib/api/models/User/commentModels";

export async function GET(req:NextRequest){
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail("Server is not working")
        }
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return fail("Unauthorised access", 403);
        }

        const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin: boolean };

        const url = new URL(req.url);
        const cid = url.searchParams.get("cid");
        const limit = Number(url.searchParams.get("l") || "10");

        if(!cid){
            return fail("cid is required.",400);
        }

        const comments = await Comment.find({parent:cid}).select("message").limit(limit);
        
        return NextResponse.json({
            success: true,
            comments
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}
