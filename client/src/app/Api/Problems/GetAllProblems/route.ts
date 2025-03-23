'use server'

import { NextRequest, NextResponse } from "next/server";
import { Problem } from '../../../lib/api/problemModel';
import { PROBLEMS } from "../../../../../public/assets/problems";
import { cookies } from "next/headers";
import { fail } from "@/app/lib/api/response";

export interface Response {
    success: boolean,
    problems:Array<Problem>,
    length:number,
    page:number,
    maxpage:number,
    lastelement:number
}


export async function GET(request : NextRequest){
    try{
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if(!token){
            return fail("Unauthorised access",403);
        }
        
        const params = new URL(request.url).searchParams;
        const page : number = Number(params.get('page')) || 1;
        const pagelen = 10;
        let i = 0, j = pagelen;
        if(page > 1){
            i = (pagelen * page) - pagelen;
            j = i + pagelen;
        }
        const maxindex = Math.ceil(PROBLEMS.length / pagelen);
        const result : Array<Problem> = PROBLEMS.slice(i,j);
        const response : Response = {
            success: true,
            problems:result,
            length:result.length,
            page,
            maxpage:Math.max(1,maxindex),
            lastelement:i
        }
        return NextResponse.json({...response},{status:200})
    }catch(err){
        console.log(err);
        return NextResponse.json({
            success:false,
            err
        },{status:500})
    }
}
