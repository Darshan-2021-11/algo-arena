import dbConnect from "@/app/lib/api/databaseConnect";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const cookieStore = cookies();
        const token = cookieStore.get("decodedtoken")?.value;
        if (!token) {
            return fail("Unauthorised access", 403);
        }

        const decodedtoken = await JSON.parse(token) as { id: string, name: string, admin?: boolean };

        const url = new URL(req.url);
        const params = url.searchParams;
        const cid = params.get("id");
        if (!cid) {
            return fail("Question id is required.");
        }

        const date = new Date();

        const result = await Contest.aggregate([
            { $match: { _id: new mongoose.Types.ObjectId(cid), ispublic: true } },
            {
                $lookup: {
                    from: "participants",
                    let: { user: new mongoose.Types.ObjectId(decodedtoken.id), contest:new mongoose.Types.ObjectId(cid)},
                    pipeline:[
                        {$match:{$expr:{
                            $and:[
                                {$eq:["$user","$$user"]}, 
                                {$eq:["$contest","$$contest"]}
                            ]
                            }}}
                    ],
                    as:"participant"
                }
            },
            {
                $project: {
                    name: 1,
                    description: 1,
                    startTime: 1,
                    endTime: 1,
                    problems: {
                        $cond: {
                            if: { $lt: ["startTime", date] },
                            then: "$problems",
                            else: []
                        }
                    },
                    registerd:{
                        $cond: {
                            if: {$gt :[{$size:"$participant"},0]},
                            then:true,
                            else:false
                        }
                    }
                }
            }
        ])

        return success("contest recieved", result[0]);

    } catch (error: any) {
        return fail(error?.message || "something went wrong.");
    }
}