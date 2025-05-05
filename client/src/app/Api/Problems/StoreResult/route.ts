import Submission from "@/app/lib/api/models/User/submissionModel";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { middleware } from "../../middleware/route";

export async function GET(req: NextRequest) {
    try {
        await middleware(req)
        const url = new URL(req.url);
        const pid = url.searchParams.get("pid");
        const msg = url.searchParams.get("msg");

        if(!pid || !msg){
            return fail("problem id is required.",400)
        }

        await Submission.updateOne({_id:new mongoose.Types.ObjectId(pid)},{result:msg});

        return NextResponse.json({
            success:true
        },{status:200})
    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.");
    }
}