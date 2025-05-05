import { fail } from "@/app/lib/api/response";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/app/lib/api/models/User/commentModels";

export async function GET(req:NextRequest){
    try {
      
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
        }, { 
            status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}
