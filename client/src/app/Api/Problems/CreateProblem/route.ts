"use server"
import { NextRequest } from "next/server";
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
        ;
        const body = await req.json() as typebody;

        await dbConnect();

        await Problem.create(body);

        return success("Problem created successfully.",201);

    } catch (error: any) {
        console.log(error)
        return fail(error.message ? error.message : "something went wrong.")
    }
}
