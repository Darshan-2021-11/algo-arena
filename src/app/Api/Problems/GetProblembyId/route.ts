'use server'

import { Problem } from "@/app/Api/models/problemModel";
import { NextRequest, NextResponse } from "next/server";
import { PROBLEM } from "../../../../../public/assets/problems";

interface Response {
    success: boolean,
    problem:Problem,
}


export async function GET(request : NextRequest){
    const params = new URL(request.url).searchParams;
    const id : string | null = params.get('id');
    if(!id){
        return NextResponse.json({
            success:false,
            err:"Please provide valid id"
        },
    {status:500})
    }
    let result : Problem;
    for(let i=0;i<PROBLEM.length;i++){
        if(PROBLEM[i].id === id){
            result = PROBLEM[i];
            const response : Response = {
                success: true,
                problem:result,
            }
            return NextResponse.json({response},{status:200})
        }
    }

    return NextResponse.json({
        success:false,
        err:"Question does not exist anymore."
    },
    {status:500})
}
