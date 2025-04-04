'use server'

import { NextRequest, NextResponse } from "next/server";
import { Problem as problemModel } from '../../../lib/api/problemModel';
import { cookies } from "next/headers";
import { fail } from "@/app/lib/api/response";
import Problem from "../../../lib/api/models/Problem/problemModel"
import dbConnect from "@/app/lib/api/databaseConnect";

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
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if(!token){
            return fail("Unauthorised access",403);
        }
        
        const params = new URL(request.url).searchParams;
        const page : number = Number(params.get('page')) || 1;
        const pagelen = Number(params.get('len')) || 10;
        let i = 0, j = pagelen;
        if(page > 1){
            i = (pagelen * page) - pagelen;
            j = i + pagelen;
        }

        await dbConnect();

        const result = await Problem.aggregate([
            {$match:{}},
            {$skip:i},
            {$limit:pagelen},
            {$project:{"title":1,"difficulty":1,"totalProblems":1}},
        ])

        
        return NextResponse.json({
            success:true,
            message:"successfully fetched data",
            Problems:result,
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



// 'use server'

// import { NextRequest, NextResponse } from "next/server";
// import { Problem } from '../../../lib/api/problemModel';
// import { PROBLEMS } from "../../../../../public/assets/problems";
// import { cookies } from "next/headers";
// import { fail } from "@/app/lib/api/response";

// export interface Response {
//     success: boolean,
//     problems:Array<Problem>,
//     length:number,
//     page:number,
//     maxpage:number,
//     lastelement:number
// }


// export async function GET(request : NextRequest){
//     try{
//         const cookieStore = cookies();
//         const token = cookieStore.get("token")?.value;
//         if(!token){
//             return fail("Unauthorised access",403);
//         }
        
//         const params = new URL(request.url).searchParams;
//         const page : number = Number(params.get('page')) || 1;
//         const pagelen = 10;
//         let i = 0, j = pagelen;
//         if(page > 1){
//             i = (pagelen * page) - pagelen;
//             j = i + pagelen;
//         }
//         const maxindex = Math.ceil(PROBLEMS.length / pagelen);
//         const result : Array<Problem> = PROBLEMS.slice(i,j);
//         const response : Response = {
//             success: true,
//             problems:result,
//             length:result.length,
//             page,
//             maxpage:Math.max(1,maxindex),
//             lastelement:i
//         }
//         return NextResponse.json({...response},{status:200})
//     }catch(err){
//         console.log(err);
//         return NextResponse.json({
//             success:false,
//             err
//         },{status:500})
//     }
// }