import { fail } from "@/app/lib/api/response";
import { NextRequest, NextResponse } from "next/server";
import Duel from "@/app/lib/api/models/User/duelModel";
import mongoose from "mongoose";
import Activity from "@/app/lib/api/models/User/activityModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export async function POST(req: NextRequest) {
    try {
        const { user, user1, problem, duration } = await req.json();

        if (!user || !problem || !user1) {
            return fail("Bad request.", 400)
        }

        await dbConnect();

        const session = await mongoose.startSession();
        let duel;
        try {
            session.startTransaction()
            duel = await Duel.create({
                user1,
                user2: user,
                problem,
                duration
            })


            const targetDate = new Date();
            targetDate.setHours(0, 0, 0, 0)

            const activity = await Activity.findOneAndUpdate({ user: user1, "activity.date": targetDate }, { $inc: { "activity.$.submissions": 1 } })
            if (!activity) {
                await Activity.updateOne({ user: user1 }, {
                    $push: { activity: { date: targetDate, submission: 1 } }
                },
                    { upsert: true }
                )
            }

            const activity2 = await Activity.findOneAndUpdate({ user, "activity.date": targetDate }, { $inc: { "activity.$.submissions": 1 } })
            if (!activity2) {
                await Activity.updateOne({ user }, {
                    $push: { activity: { date: targetDate, submission: 1 } }
                },
                    { upsert: true }
                )


            }
            await session.commitTransaction();
        } catch (error) {
            console.log(error)
            await session.abortTransaction();
        } finally {
            await session.endSession();
        }


        return NextResponse.json({
            success: true,
            duelid: duel._id
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}