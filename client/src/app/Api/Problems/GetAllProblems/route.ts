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


export async function GET(request : NextRequest){
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
        
        const params = new URL(request.url).searchParams;
        const page : number = Number(params.get('page')) || 1;
        const pagelen = Number(params.get('len')) || 10;
        let i = 0, j = pagelen;
        if(page > 1){
            i = (pagelen * page) - pagelen;
            j = i + pagelen;
        }

        let result;
        const key = `problem${page}-${pagelen}`;

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

            const project : {"title":number, "difficulty"?:number} ={
                "title":1
            }
    
            if(!decodedtoken.admin){
                project["difficulty"] = 1;
            }
    
            result = await Problem.aggregate([
                {$match:{isdeleted:false}},
                {$skip:i},
                {$limit:pagelen},
                {$project:project},
            ])

            try {
                redis && redis.set(key,JSON.stringify(result),{EX:86400})
            } catch (error) {
                console.log(error);
            }
    
        }

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
