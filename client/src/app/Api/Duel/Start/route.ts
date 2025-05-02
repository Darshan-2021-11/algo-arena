import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import Duel from "@/app/lib/api/models/User/duelModel";
import mongoose from "mongoose";
import Activity from "@/app/lib/api/models/User/activityModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export async function POST(req: NextRequest) {
    try {
      const cookiestore = cookies();
        const token = cookiestore.get("decodedtoken")?.value as string;
        if(!token){
            return fail("Unauthorized access",403);
        }
        const decodedtoken = await JSON.parse(token) as { id: string, name: string, admin?: boolean };
        const { user, problem, duration} = await req.json();

        if(!user || !problem){
            return fail("Bad request.",400)
        }

        await dbConnect();

        const session = await mongoose.startSession();
        let duel;
        try {
            session.startTransaction()
            duel = await Duel.create({
                user1:decodedtoken.id,
                user2:user,
                problem,
                duration
            })


            const targetDate = new Date(); 
            targetDate.setHours(0, 0, 0, 0)

            const activity = await Activity.findOneAndUpdate({ user: decodedtoken.id, "activity.date": targetDate }, { $inc: { "activity.$.submissions": 1 } })
            if(!activity){
                await Activity.updateOne({user:decodedtoken.id},{
                    $push:{activity:{date:targetDate, submission:1}}
                },
                {upsert:true}
            )
        }

            const activity2 = await Activity.findOneAndUpdate({ user, "activity.date": targetDate }, { $inc: { "activity.$.submissions": 1 } })
            if(!activity2){
                await Activity.updateOne({user},{
                    $push:{activity:{date:targetDate, submission:1}}
                },
                {upsert:true}
            )

            
            }
            await session.commitTransaction();
        } catch (error) {
            console.log(error)
            await session.abortTransaction();
        }finally{
            await session.endSession();
        }


        return NextResponse.json({
            success: true,
            duelid:duel._id
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}