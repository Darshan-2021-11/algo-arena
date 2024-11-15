'use server'

import { NextRequest, NextResponse } from "next/server";
import { Problem } from '../../models/problemModel';
import { PROBLEMS } from "../../../../../public/assets/problems";

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
        const params = new URL(request.url).searchParams;
        const page : number = Number(params.get('page')) || 1;
        const pagelen = 10;
        let i = 0, j = pagelen;
        if(page > 1){
            i = (pagelen * page) - pagelen;
            j = i + pagelen;
        }
        const maxindex = Math.round(PROBLEMS.length / pagelen);
        const result : Array<Problem> = PROBLEMS.slice(i,j);
        const response : Response = {
            success: true,
            problems:result,
            length:result.length,
            page,
            maxpage:maxindex,
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
