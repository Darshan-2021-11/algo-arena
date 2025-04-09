"use server"
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import { contestmodel as cm } from "@/app/lib/api/contestModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export interface Response {
    success: boolean,
    Problem: any,
    message: string,
}


export async function GET(request : NextRequest){
    try{
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        /*
             if(!token){
             return fail("Unauthorised access",403);
             }
             */
        const params = new URL(request.url).searchParams;
        const _id = params.get('_id');
        const page : number = Number(params.get('page')) || 1;
        const pagelen = Number(params.get('len')) || 10;
        let i = 0, j = pagelen;
        if(page > 1){
            i = (pagelen * page) - pagelen;
            j = i + pagelen;
        }

        await dbConnect();
        const result = await Contest.findById(_id);
        return NextResponse.json({
            success: true,
            message: "Successfully fetched data",
            Problem: result,
        },{status: 200})
    }catch(err){
        console.log(err);
        return NextResponse.json({
            success: false,
            err
        },{status: 500})
    }
}
