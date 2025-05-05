import Dp from "@/app/lib/api/models/User/dpModel";
import { fail, success } from "@/app/lib/api/response";
import { NextRequest } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/api/databaseConnect";
import { middleware } from "@/app/Api/middleware/route";

export async function DELETE(req: NextRequest) {
    try {
        ;
        const id = new URL(req.url).searchParams.get("id");
        if(!id){
            return fail("id is required.");
        }
        await dbConnect();


        await Dp.deleteOne({user:new mongoose.Types.ObjectId(id)});

        return success("Profile image saved.", 200)
    } catch (error: any) {
        return fail(error.message);
    }
}