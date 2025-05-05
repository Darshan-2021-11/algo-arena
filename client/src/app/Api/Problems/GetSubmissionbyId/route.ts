'use server'

import { NextRequest, NextResponse } from "next/server";
import { Problem as problemModel } from '../../../lib/api/problemModel';
import { cookies } from "next/headers";
import { fail } from "@/app/lib/api/response";
import dbConnect from "@/app/lib/api/databaseConnect";
import Submission from "@/app/lib/api/models/User/submissionModel";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { middleware } from "../../middleware/route";

export interface Response {
    success: boolean,
    problems:Array<problemModel>,
    length:number,
    page:number,
    maxpage:number,
    lastelement:number
}


export async function GET(req : NextRequest){
    try{
        await middleware(req);
        const url = new URL(req.url);
        
        const params = url.searchParams;
        const problem = params.get("pb");
        const id = params.get("id");
        if(!problem || !id){
            return fail("problem and id are required.")
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
            {$match:{user:new mongoose.Types.ObjectId(id), problem:new mongoose.Types.ObjectId(problem) }},
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
