"use server"
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/app/lib/api/databaseConnect";
import Leaderboard from "@/app/lib/api/models/User/leaderboardModel";
import { middleware } from "../middleware/route";

export async function GET(req:NextRequest) {
    try {
        ;
        await dbConnect();

        const users = await Leaderboard.aggregate([
            {
                $sort: {
                    score: -1
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
                    userid:'$users._id'
                }
            },
            {
                $project: {
                    _id: 0,
                    name: {
                        $arrayElemAt: ["$user", 0]
                    },
                    id:{
                        $arrayElemAt:["$userid",0]
                    },
                    score: 1,
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