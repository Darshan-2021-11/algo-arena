'use server'

import { NextRequest, NextResponse } from "next/server";
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import Problem from '../../../lib/api/models/Problem/problemModel'
import dbConnect from "@/app/lib/api/databaseConnect";
import jwt from 'jsonwebtoken'
import { redisConnect } from "@/app/lib/api/redisConnect";

export async function GET(req: NextRequest) {
    try {
        
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail("Server configuration failed", 500);
        }
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;

        if (!token) {
            return fail("Unauthorised access", 403);
        }

        const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin?: boolean };

        const params = new URL(req.url).searchParams;
        const id = params.get('id');

        if (!id) {
            return NextResponse.json({
                success: false,
                err: "Please provide valid id"
            },
                { status: 500 })
        }

        let result;
        const key = `problem${id}`;

        const redis = await redisConnect();
        if (redis) {
            try {
                const data = await redis.get(key);
                if (data) {
                    result = await JSON.parse(data);
                }
            } catch (error) {
                console.log(error);
                result = null;
            }
        }

        if (!result) {
            const project: {
                title: number,
                description: number,
                difficulty: number,
                tags: number,
                constraints: number,
                timeLimit?: number,
                spaceLimit?: number,
                testcases: number | object,
                private: number
            } = {
                title: 1,
                description: 1,
                difficulty: 1,
                tags: 1,
                constraints: 1,
                testcases: { $slice: ["$testcases", 3] },
                private: 1
            }

            if (decodedtoken.admin) {
                project.timeLimit = 1;
                project.spaceLimit = 1;
                project.testcases = 1;
            }
            await dbConnect();
            const data = await Problem.aggregate([
                { $match: { _id: new mongoose.Types.ObjectId(id) } },
                { $project: project }
            ])

            result = data[0];

            if (redis) {
                redis.set(key, JSON.stringify(result),{EX:60 * 60 * 12});
            }
        }


        return NextResponse.json({
            success: false,
            data: result,
            message: "successfully retrieved data."
        }, { status: 200 })

        // return fail("Question does not exist anymore.", 500);
    } catch (err: any) {
        console.log(err);
        return fail("Question does not exist anymore.", 500);
    }
}
