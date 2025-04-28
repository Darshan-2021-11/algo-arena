import dbConnect from "@/app/lib/api/databaseConnect";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    try {
        const url = new URL(req.url);
        const params = url.searchParams;
        const qid = params.get("id");
        if(!qid){
            return fail("Question id is required.");
        }

        await dbConnect();

        const result = await Contest.findById(new mongoose.Types.ObjectId(qid));

        return success("contest recieved",result);
        
    } catch (error:any) {
        return fail(error?.message ||"something went wrong.");
    }
}