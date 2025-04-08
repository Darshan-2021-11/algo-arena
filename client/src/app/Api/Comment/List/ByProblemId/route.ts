import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Comment from "@/app/lib/api/models/User/commentModels";
import mongoose from "mongoose";


export async function GET(req:NextRequest){
    try {
        // const secret = process.env.JWT_SECRET;
        // if (!secret) {
        //     return fail("Server is not working")
        // }
        // const cookieStore = cookies();
        // const token = cookieStore.get("token")?.value;
        // if (!token) {
        //     return fail("Unauthorised access", 403);
        // }

        // const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin: boolean };

        const url = new URL(req.url);
        const id = url.searchParams.get("pid");
        const limit = Number(url.searchParams.get("l") || "10");

        if(!id){
            return fail("cid is required.",400);
        }

        const comments = await Comment.aggregate([
            {
                $match:{problem:new mongoose.Types.ObjectId(id)}
            },
            {
                $limit:10
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
        
        console.log(comments)
        
        return NextResponse.json({
            success: true,
            comments
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}
