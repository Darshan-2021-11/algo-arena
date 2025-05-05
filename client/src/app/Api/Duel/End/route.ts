import { fail } from "@/app/lib/api/response";
import { NextRequest, NextResponse } from "next/server";
import mongoose, { ObjectId } from "mongoose";
import Duel from "@/app/lib/api/models/User/duelModel";
import UserDuel from "@/app/lib/api/models/User/userDuelModel";
import dbConnect from "@/app/lib/api/databaseConnect";

interface db {
    status: number,
    winnerCode?: string,
    lang?: string,
    winner?: any
}

interface ub {
    duels: number,
    wins?: number,
    losses?: number,
    draws?: number
}


export async function POST(req: NextRequest) {
    try {
        ;
        const { user1, result, user2, duelid, code, lang } = await req.json();
        if (!user1 || !result || !user2 || !duelid) {
            return fail("all data are required.")
        }
        console.log(user1, result, user2, duelid, code, lang )

        await dbConnect();
        const session = await mongoose.startSession();
        let duel;
        try {
            session.startTransaction();
            const duelbody: db = { status: 2 };
            const user1body: ub = { duels: 1 };
            const user2body: ub = { duels: 1 };
            if (result === "win") {
                duelbody.winner = new mongoose.Types.ObjectId(user1);
                duelbody.lang = lang;
                duelbody.winnerCode = code;
                user1body.wins = 1;
                user2body.losses = 1;
            } else if (result === "lose") {
                duelbody.winner = new mongoose.Types.ObjectId(user2);
                duelbody.lang = lang;
                duelbody.winnerCode = code;
                user2body.wins = 1;
                user1body.losses = 1;
            } else {
                user1body.draws = 1;
                user2body.draws = 1;
            }

            const dueldata = await Duel.findOneAndUpdate({ _id: new mongoose.Types.ObjectId(duelid) }, duelbody
                // {session}
            )
            if (!dueldata) {
                await session.abortTransaction();
            }
            let user1duel = await UserDuel.findOneAndUpdate({ user: new mongoose.Types.ObjectId(user1) }, {
                $inc: user1body
            },
                // {session}
            )
            if (!user1duel) {
                user1duel = await UserDuel.create({ user: new mongoose.Types.ObjectId(user1), ...user1body },
                    // {session}
                )
            }
            console.log(user1duel)

            let user2duel = await UserDuel.findOneAndUpdate({ user:new mongoose.Types.ObjectId(user2) }, {
                $inc: user2body
            },
                // {session}
            )

            if (!user2duel) {
                await UserDuel.create({ user: user2, ...user2body },
                    // {session}
                )
            }
            console.log(user2duel)

            await session.commitTransaction();
        } catch (error) {
            console.log(error);
            await session.abortTransaction();
        } finally {
            await session.endSession();
        }

        return NextResponse.json({
            success: true
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}