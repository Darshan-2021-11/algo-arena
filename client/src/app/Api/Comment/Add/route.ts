import { fail } from "@/app/lib/api/response";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/app/lib/api/models/User/commentModels";
import { middleware } from "../../middleware/route";

interface b{
    problem:string,
    user:string,
    message:string,
    parent?:string
}

export async function POST(req:NextRequest){
    try {
        const {pid, msg, cid, id} = await req.json();

        if(!pid || !msg || !id){
            return fail("Bad request pid, msg and id are required.",400)
        }

        const body : b = {
            problem:pid,
            user:id,
            message:msg,
        };

        if(cid){
            body.parent = cid;
        }

        const comment = await Comment.create(body);
        
        return NextResponse.json({
            success: true,
            id:comment._id
        }, { 
            status: 200 
        })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}
