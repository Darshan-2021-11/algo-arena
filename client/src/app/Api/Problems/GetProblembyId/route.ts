'use server'

import { Problem } from "@/app/lib/api/problemModel";
import { NextRequest, NextResponse } from "next/server";
import { PROBLEMS } from "../../../../../public/assets/problems";

interface Response {
    success: boolean,
    problem:Problem,
}


export async function GET(request : NextRequest){
    const params = new URL(request.url).searchParams;
    const id : number | null = Number(params.get('id'));
    if(!id){
        return NextResponse.json({
            success:false,
            err:"Please provide valid id"
        },
    {status:500})
    }
    let result : Problem;
    for(let i=0;i<PROBLEMS.length;i++){
        if(PROBLEMS[i].id === id){
            result = PROBLEMS[i];
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
