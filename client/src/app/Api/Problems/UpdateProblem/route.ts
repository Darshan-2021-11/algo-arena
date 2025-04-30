"use server"
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { fail, success } from "@/app/lib/api/response";
import Problem from "@/app/lib/api/models/Problem/problemModel";
import dbConnect from "@/app/lib/api/databaseConnect";

interface problem {
    title: string
    description: string
    difficulty: string
    tags: string[]
    constraints: string[]
    timeLimit: number
    spaceLimit: number
}

interface body {
    problem:problem
    id:string
}

export async function POST(req: NextRequest) {
    try {

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail("Server is not working")
        }

        const cookieStore = cookies();
        const cookie = cookieStore.get("token")?.value;
        if (!cookie) {
            return fail("unauthorized access.", 403);
        }

        const decodedtoken = jwt.verify(cookie,secret) as {id:string, name:string,admin:boolean};

        if(!decodedtoken.admin){
            return fail("unauthorized access.",403);
        }

        const body = await req.json() as body;

        if(!body.id || !body.problem){
            return fail("invalid body");
        }

        await dbConnect();

        await Problem.findByIdAndUpdate(body.id, body.problem).select("_id");

        return success("Problem updated successfully.",201);

    } catch (error: any) {
        console.log(error)
        return fail(error.message ? error.message : "something went wrong.")
    }
}
