'use server'
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import User from "../../models/User/userModel";

export const GET =async(req:NextRequest, res:NextResponse)=>{
    try {
        const secretkey = process.env.JWT_SECRET;
        if(!secretkey){
            return fail("Server not working.");
        }
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if(!token){
            return fail("Invalid request.",400);
        }
        const data = jwt.verify(token,secretkey) as {username:string, id:string};
        const user = await User.findOne({username:data.username}).select("isdeleted");

        if(!user || user.isdeleted){
            return fail("User not found.");
        }

        return NextResponse.json({
            user:data.username,
            message:"successffully information fetched.",
            success:true
        },{status:200})
    } catch (error:any) {
        const message = error.message || "Something went wrong.";
        return fail(message);
    }
}