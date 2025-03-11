'use server'

import { NextRequest, NextResponse } from "next/server";
import { HIDDEN } from "../../../../../public/assets/problems";

export interface Response {
    success: boolean,
    test_cases:Array<{question:string, answer:string}> | undefined,
    length:number | undefined
}


export async function GET(request : NextRequest){
    try{
        const params = new URL(request.url).searchParams;
        const id : number | null = Number(params.get('id'));
        console.log(id);
        if(!id){
            return NextResponse.json({success:false, error:"no id found"},{status:404})
        }
        let result;
        let i = 0, j = HIDDEN.length;
        while(i <=j){
            const m = Math.floor((i+j)/2);
            const test = HIDDEN[m];
            console.log(test.id,id)
            if(test.id === id){
                result = HIDDEN[m];
                break;
            }
            if(test.id > HIDDEN[m].id){
                i=m+1;
            }else{
                j=m-1;
            }
        }
        console.log("result founds",result)
        const response : Response = {
            success: true,
            test_cases:result?.hidden_testcases,
            length:result?.id
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
