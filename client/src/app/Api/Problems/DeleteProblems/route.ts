'use server'
import Problem from "@/app/lib/api/models/Problem/problemModel";
import { redisConnect } from "@/app/lib/api/redisConnect";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
    try {
        ;
        const { ids } = await req.json() as { ids: string[] };


        const newids = ids.map((id) => {
            return new mongoose.Types.ObjectId(id);
        })


        const session = await mongoose.startSession();

        try {
            session.startTransaction();
            await Problem.updateMany({ _id: { $in: newids } }, {
                isdeleted: true,
                $unset: {
                    tags: "",
                    constraints: "",
                    testcases: "",
                    timeLimit: "",
                    spaceLimit: "",
                }
            });

            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
            throw error;
        } finally {
            await session.endSession();
        }

        const redis = await redisConnect();

        if (redis) {
            const proms = ids.map(async(id) => {
                const key = `problem${id}`;
                await redis.del(key);
            })

            await Promise.all(proms);
        }


        return success("successfully deleted.")
    } catch (error: any) {
        return fail(error.message || "something went wrong.");
    }
}