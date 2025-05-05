"use server"
import { NextRequest, NextResponse } from "next/server";
import contestModel from "@/app/lib/api/models/Contest/contestModel";
import { contestmodel as cm } from "@/app/lib/api/contestModel";
import dbConnect from "@/app/lib/api/databaseConnect";
import { middleware } from "../../middleware/route";

export interface Response {
    success: boolean,
    problems: Array<cm>,
    length: number,
    page: number,
    maxpage: number,
    lastelement: number
}


export async function GET(req: NextRequest) {
    try {
        await middleware(req);
        const params = new URL(req.url).searchParams;
        const time = params.get("t");
        const page: number = Number(params.get('P')) || 1;
        const pagelen = Number(params.get('l')) || 10;
        let i = 0, j = pagelen;
        if (page > 1) {
            i = (pagelen * page) - pagelen;
            j = i + pagelen;
        }

        await dbConnect();

        const date = new Date();

        let match : {ispublic?:boolean, startTime?:{$gt:Date} | {$lt:Date}, endTime?:{$gt:Date} | {$lt:Date}};

        switch(time){
            case "past":
                {
                match = { ispublic: true, startTime:{$lt:date}, endTime:{$lt:date} }   
                }
            break;

            case "ongoing":
                {
                match = { ispublic: true, startTime:{$lt:date}, endTime:{$gt:date} };
                }
            break;

            default:
                {
                match = { ispublic: true, startTime:{$gt:date} };
                }
        }

        const result = await contestModel.aggregate([
            {
                $match: match
            },
            {
                $skip: i
            },
            {
                $limit: pagelen
            },
            {
                $project: {
                    "name": 1,
                    "startTime": 1,
                }
            },
        ])

        return NextResponse.json({
            success: true,
            message: "Successfully fetched data",
            Contest: result,
            end: result?.length < pagelen
        }, { status: 200 })
    } catch (err) {
        console.log(err);
        return NextResponse.json({
            success: false,
            err
        }, { status: 500 })
    }
}
