import Activity from "@/app/lib/api/models/User/activityModel";
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';
import mongoose from "mongoose";
import Duel from "@/app/lib/api/models/User/duelModel";
import UserDuel from "@/app/lib/api/models/User/userDuelModel";
import dbConnect from "@/app/lib/api/databaseConnect";

interface db {
    status:number,
    winnerCode?:string,
    lang?:string,
    winner?:string
}

interface ub {
    duels:number, 
    wins?:number, 
    losses?:number, 
    draws?:number
}


export async function POST(req: NextRequest) {
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

        const decodedtoken = jwt.verify(token, secret) as { id: string, name: string };

        const {user1, result, user2, duelid, code, lang } = await req.json();

        await dbConnect();
        const session = await mongoose.startSession();
        let duel;
        try {
            session.startTransaction();
            const duelbody : db = {status:2};
            const user1body : ub = {duels:1};
            const user2body : ub = {duels:1};
            if(result === "win"){
                duelbody.winner = user1;
                duelbody.lang = lang;
                duelbody.winnerCode = code;
                user1body.wins = 1;
                user2body.losses = 1;
            }else if(result === "lose"){
                duelbody.winner = user2;
                duelbody.lang = lang;
                duelbody.winnerCode = code;
                user2body.wins = 1;
                user1body.losses = 1;
            }else{
                user1body.draws = 1;
                user2body.draws = 1;
            }
           
         
            const dueldata = await Duel.findOneAndUpdate({_id: new mongoose.Types.ObjectId(duelid)},{
                status:2
            },{session})
           
            if(!dueldata){
                await session.abortTransaction();
            }
            const user1duel = await UserDuel.findOneAndUpdate({user:user1},{
                $inc:user1body
            },{session})
            if(!user1duel){
                await UserDuel.create({user:user1, ...user1body},{session})
            }

            const user2duel = await UserDuel.findOneAndUpdate({user:user2},{
                $inc:user2body
            },{session})

            if(!user2duel){
                await UserDuel.create({user:user2, ...user2body},{session})
            }
            
            await session.commitTransaction();
        } catch (error) {
            await session.abortTransaction();
        }finally{
            await session.endSession();
        }
        
        return NextResponse.json({
            success: true
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}