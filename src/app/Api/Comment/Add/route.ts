import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Comment from "@/app/lib/api/models/User/commentModels";

interface b{
    problem:string,
    user:string,
    message:string,
    parent?:string
}

export async function POST(req:NextRequest){
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

        const {pid, msg, cid} = await req.json();

        if(!pid || !msg){
            return fail("Bad request pid and msg are required.",400)
        }

        const body : b = {
            problem:pid,
            user:decodedtoken.id,
            message:msg,
        };

        if(cid){
            body.parent = cid;
        }

        const comment = await Comment.create(body);
        
        return NextResponse.json({
            success: true,
            id:comment._id
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}
