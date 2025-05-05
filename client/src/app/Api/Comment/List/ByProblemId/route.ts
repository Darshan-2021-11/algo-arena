import { fail } from "@/app/lib/api/response";
import { NextRequest, NextResponse } from "next/server";
import Comment from "@/app/lib/api/models/User/commentModels";
import mongoose from "mongoose";
import { middleware } from "@/app/Api/middleware/route";


export async function GET(req:NextRequest){
    try {
        const url = new URL(req.url);
        const id = url.searchParams.get("pid");
        const limit = Number(url.searchParams.get("l") ) || 10;

        if(!id){
            return fail("cid is required.",400);
        }

        const comments = await Comment.aggregate([
            {
                $match:{problem:new mongoose.Types.ObjectId(id)}
            },
            {
                $limit:limit
            },
            {
                $lookup:{
                    from:"users",
                    localField:"user",
                    foreignField:"_id",
                    as:"users"
                }
            },
            {
                $addFields:{
                    name:"$users.username"
                }
            },
            {
                $project:{
                    message:1,
                    user:{
                        $arrayElemAt:["$name",0]
                    }
                }
            }
        ])
        
        return NextResponse.json({
            success: true,
            comments
        }, { 
            status: 200
         })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}
