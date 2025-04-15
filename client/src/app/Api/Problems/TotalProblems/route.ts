'use server'

import { NextRequest, NextResponse } from "next/server";
import { Problem as problemModel } from '../../../lib/api/problemModel';
import { cookies } from "next/headers";
import { fail } from "@/app/lib/api/response";
import Problem from "../../../lib/api/models/Problem/problemModel"
import dbConnect from "@/app/lib/api/databaseConnect";
import jwt from "jsonwebtoken";
import { redisConnect } from "@/app/lib/api/redisConnect";

export interface Response {
    success: boolean,
    problems:Array<problemModel>,
    length:number,
    page:number,
    maxpage:number,
    lastelement:number
}


export async function GET(){
    try{
        const secret = process.env.JWT_SECRET;
        if(!secret){
            return fail("server configuration failed.")
        }
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if(!token){
            return fail("Unauthorised access",403);
        }

        const decodedtoken = jwt.verify(token,secret) as {id:string, name:string, admin?:boolean};
        
       

        let result;
        const key = `problemCount`;

        const redis = await redisConnect();
        if(redis){
            try {
                const data = await redis.get(key);
                if(data){
                    result = await JSON.parse(data);
                }
            } catch (error) {
                console.log(error);
                !Array.isArray(result) && (result = null);
            }
           
        }

        if(!result){
            await dbConnect();

            const totalProblems = await Problem.aggregate([
                {$match:{isdeleted:false}},
                {$count:"totalProblems"}
            ]);

            totalProblems.length > 0 && (result = totalProblems[0].totalProblems);
            try {
                redis && redis.set(key,JSON.stringify(result),{EX:86400})
            } catch (error) {
                console.log(error);
            }
    
        }

        return NextResponse.json({
            success:true,
            message:"successfully fetched data",
            total:result
        },{status:200})
    }catch(err){
        console.log(err);
        return NextResponse.json({
            success:false,
            err
        },{status:500})
    }
}
