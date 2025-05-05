import dbConnect from "@/app/lib/api/databaseConnect";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function POST(req:NextRequest){
    try {
        ;
        const url = new URL(req.url);
        const params = url.searchParams;
        const qid = params.get("id");
        if(!qid){
            return fail("Question id is required.");
        }

        await dbConnect();

        const body = await req.json();

        const {name, description, startTime, endTime, ispublic} = body;

        if(!name || !description || !startTime || !endTime || typeof(ispublic) !== "boolean" ){
            return fail("all data are required.");
        }

        // const result = await Contest.findById(new mongoose.Types.ObjectId(qid));
        await Contest.updateOne({_id:new mongoose.Types.ObjectId(qid)},body);

        return success("contest recieved");
        
    } catch (error:any) {
        return fail(error?.message ||"something went wrong.");
    }
}