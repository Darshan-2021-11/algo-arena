"use server"
import { NextApiRequest, NextApiResponse } from "next";
import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/api/databaseConnect";
import UserProblem from "@/app/lib/api/models/User/userProblemModel";
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken"

export async function GET() {
    try {

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail("Server is not working")
        }
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return fail("Unauthorised access", 403);
        }

         jwt.verify(token, secret) as { id: string, name: string };

        await dbConnect();

        const users = await UserProblem.aggregate([
            {
                $sort: {
                    totalQuestionSolved: -1
                },
            },
            {
                $limit: 10
            },
            {
                $lookup: {
                    from: "users",
                    localField: "user",
                    foreignField: "_id",
                    as: "users"
                }
            },
            {
                $addFields: {
                    user: '$users.username',
                }
            },
            {
                $project: {
                    _id: 0,
                    name: {
                        $arrayElemAt: ["$user", 0]
                    },
                    submission: 1,
                }
            }
        ])


        return NextResponse.json({
            success: true,
            message: "successfully fetched users",
            users,
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            success: false,
            message: "Server error occurred",
            error: error.message,
        }, { status: 500 });
    }
}