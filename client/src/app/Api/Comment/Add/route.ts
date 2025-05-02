import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/app/lib/api/models/User/commentModels";

interface b{
    problem:string,
    user:string,
    message:string,
    parent?:string
}

export async function POST(req:NextRequest){
    try {
      const cookiestore = cookies();
        const token = cookiestore.get("decodedtoken")?.value as string;
        if(!token){
            return fail("Unauthorized access",403);
        }
        const decodedtoken = await JSON.parse(token) as { id: string, name: string, admin?: boolean };

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
