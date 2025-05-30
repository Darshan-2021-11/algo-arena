'use server'
import { NextRequest, NextResponse } from "next/server";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import Problem from "@/app/lib/api/models/Problem/problemModel";
import Leaderboard from "@/app/lib/api/models/User/leaderboardModel";
import Participant from "@/app/lib/api/models/Contest/participantModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export async function POST(req: NextRequest) {
    try {
        ;
        const { id, contestid, user } = await req.json();

        if(!id || !contestid || !user){
            return fail("id, contestid and user are required.");
        }

        const date = new Date();

        const pid = new mongoose.Types.ObjectId(id);
        const cid = new mongoose.Types.ObjectId(contestid);
        const uid = new mongoose.Types.ObjectId(user);

        await dbConnect();

        const registered = await Participant.findOne({ user: uid, contest: cid }).select("solved");

        if (!registered) {
            return fail("You are not registered in the contest, submission will not affect your score.");
        }

        const contest = await Contest.findOne({ _id: cid, startTime: { $lt: date }, endTime: { $gt: date } });

        if (contest) {
            if (!registered.solved.includes(id)) {
                const diff = await Problem.findById(pid).select("difficulty");
                if (!diff) {
                    return fail("Invalid question.", 410);
                }
                let score;
                if (diff === "Easy") {
                    score = 10;
                } else if (diff === "Medium") {
                    score = 20;
                } else {
                    score = 30;
                }
                // if (leaderboard.matchedCount === 0) {
                    const session = await mongoose.startSession();
                    try {
                        session.startTransaction();
                        await Leaderboard.findOneAndUpdate(
                            { user: uid },
                            { $inc: { score: score } },
                            { upsert: true
                                // , session 
                            }
                        );
                        await Participant.findOneAndUpdate({ user: uid, contest: cid }, { $push: { solved: id } }
                            // , { session }
                        );
                        await session.commitTransaction();
                        await session.endSession();
                    } catch (error) {
                        await session.abortTransaction();
                        await session.endSession();
                        console.log(error);
                        return fail("Failed to submit in contest.")
                    // }
                }
            }
            return success("solve successfully.");
        }
        return fail("Contest already expired.", 410);
    } catch (err: any) {
        // console.log(err)
        return NextResponse.json({ success: false, err: err.message ? err.message : "something went wrong" }, { status: 500 });
    }
}
