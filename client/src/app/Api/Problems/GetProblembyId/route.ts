'use server'

import { Problem as problemModel } from "@/app/lib/api/problemModel";
import { NextRequest, NextResponse } from "next/server";
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import Problem from '../../../lib/api/models/Problem/problemModel'

interface Response {
    success: boolean,
    problem: problemModel,
}


export async function GET(request: NextRequest) {
    try {


        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return fail("Unauthorised access", 403);
        }

        const params = new URL(request.url).searchParams;
        const id= params.get('id');
        
        if (!id) {
            return NextResponse.json({
                success: false,
                err: "Please provide valid id"
            },
                { status: 500 })
        }
        const result = await Problem.aggregate([
            {$match:{_id: new mongoose.Types.ObjectId(id)}},
            {$project:{
                title:1,
                description:1,
                difficulty:1,
                tags:1,
                constraints:1,
                testcases:{$slice:["$testcases",3]},
                
            }}
        ])
        if (result.length >0) {
            return NextResponse.json({
                success: false,
                data: result[0],
                message: "successfully retrieved data."
            }, { status: 200 })
        }

        return fail("Question does not exist anymore.", 500);
    } catch (err:any) {
        console.log(err);
        return NextResponse.json({
            success:false,
            err
        },{status:500})
    }
}
