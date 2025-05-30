'use server'

import { NextRequest, NextResponse } from "next/server";
import { Problem as problemModel } from '../../../lib/api/problemModel';
import { cookies } from "next/headers";
import { fail } from "@/app/lib/api/response";
import Problem from "../../../lib/api/models/Problem/problemModel"
import dbConnect from "@/app/lib/api/databaseConnect";
import { redisConnect } from "@/app/lib/api/redisConnect";
import jwt from 'jsonwebtoken';

export interface Response {
    success: boolean,
    problems: Array<problemModel>,
    length: number,
    page: number,
    maxpage: number,
    lastelement: number
}


export async function GET(req: NextRequest) {
    try {
        ;
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
        const url = new URL(req.url);
        const params = url.searchParams;
        const pr = params.get("pr");


        let result;
        let key;
        let m: { isdeleted: boolean, private?: boolean } = { isdeleted: false }
        if (decodedtoken.admin) {
            if (pr) {
                key = `privateproblemCount`;
                m.private = true;
            } else {
                key = "problemCount";
            }
        } else {
            key = "publicproblemCount";
            m.private = false;
        }

        const redis = await redisConnect();
        if (redis) {
            try {
                const data = await redis.get(key);
                if (data) {
                    result = await JSON.parse(data);
                }
            } catch (error) {
                console.log(error);
                !Array.isArray(result) && (result = null);
            }

        }

        if (!result) {
            await dbConnect();

            const totalProblems = await Problem.aggregate([
                { $match: m },
                { $count: "totalProblems" }
            ]);

            totalProblems.length > 0 && (result = totalProblems[0].totalProblems);
            try {
                redis && redis.set(key, JSON.stringify(result), { EX: 86400 })
            } catch (error) {
                console.log(error);
            }

        }

        return NextResponse.json({
            success: true,
            message: "successfully fetched data",
            total: result
        }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            err
        }, { status: 500 })
    }
}
