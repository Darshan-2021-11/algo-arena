"use server"
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import User from "@/app/lib/api/models/User/userModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export async function GET(req:NextApiRequest, res:NextApiResponse){
    try {
        await dbConnect();

        const users = await User.aggregate([
            {$sort:{
                totalQuestionSolved:-1
            },
        },{
            $project:{
                _id:0,
                name:1,
                totalQuestionSolved:1
            }
        }
        ])

        
         return NextResponse.json({
            success: true,
            message:"successfully fetched users",
            users,
          }, { status: 200 });
    } catch (error:any) {
        return NextResponse.json({
            success: false,
            message: "Server error occurred",
            error: error.message,
          }, { status: 500 });
    }
}