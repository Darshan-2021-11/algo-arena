"use server"
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { fail, success } from "@/app/lib/api/response";
import Problem from "@/app/lib/api/models/Problem/problemModel";
import dbConnect from "@/app/lib/api/databaseConnect";

interface typebody {
    title: string
    description: string
    difficulty: string
    tags: string[]
    constraints: string[]
    testcases: { input: string, output: string }[]
    timeLimit: number
    spaceLimit: number
    author: string
}

export async function POST(req: NextRequest) {
    try {

      const cookiestore = cookies();
        const token = cookiestore.get("decodedtoken")?.value as string;
        if(!token){
            return fail("Unauthorized access",403);
        }
        const decodedtoken = await JSON.parse(token) as { id: string, name: string, admin?: boolean };

        if(!decodedtoken.admin){
            return fail("Unauthorised access.",403);
        }

        const body = await req.json() as typebody;

        body.author = decodedtoken.id;

        await dbConnect();

        await Problem.create(body);

        return success("Problem created successfully.",201);

    } catch (error: any) {
        console.log(error)
        return fail(error.message ? error.message : "something went wrong.")
    }
}
