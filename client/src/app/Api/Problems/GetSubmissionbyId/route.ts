'use server'

import { NextRequest, NextResponse } from "next/server";
import { Problem as problemModel } from '../../../lib/api/problemModel';
import { cookies } from "next/headers";
import { fail } from "@/app/lib/api/response";
import dbConnect from "@/app/lib/api/databaseConnect";
import Submission from "@/app/lib/api/models/User/submissionModel";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';

export interface Response {
    success: boolean,
    problems:Array<problemModel>,
    length:number,
    page:number,
    maxpage:number,
    lastelement:number
}


export async function GET(request : NextRequest){
    try{
        const secret = process.env.JWT_SECRET;
        if(!secret){
            return fail("Server configuration failed.");
        }
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if(!token){
            return fail("Unauthorised access",403);
        }

        const decodedtoken = jwt.verify(token,secret) as {id:string, name:string};
        const url = new URL(request.url);
        
        const params = url.searchParams;
        const problem = url.searchParams.get("pb");
        if(!problem){
            return fail("problem is required.")
        }
        const page : number = Number(params.get('p')) || 1;
        const pagelen = Number(params.get('l')) || 10;
        let i = 0, j = pagelen;
        if(page > 1){
            i = (pagelen * page) - pagelen;
            j = i + pagelen;
        }

        await dbConnect();

       

        const result = await Submission.aggregate([
            {$match:{user:new mongoose.Types.ObjectId(decodedtoken.id), problem:new mongoose.Types.ObjectId(problem) }},
            {$skip:(page-1)*pagelen},
            {$limit:pagelen},
            {$project:{
                result:1,
                language:1,
                createdAt:1,
                updatedAt:1,
                code:1
            }}
        ])

        
        return NextResponse.json({
            success:true,
            message:"successfully fetched data",
            submissions:result,
            end:result?.length < pagelen
        },{status:200})
    }catch(err){
        console.log(err);
        return NextResponse.json({
            success:false,
            err
        },{status:500})
    }
}
