import { middleware } from "@/app/Api/middleware/route";
import User from "@/app/lib/api/models/User/userModel";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";

export async function GET(req:NextRequest){
    try {
        await middleware(req);
        const url = new URL(req.url);
        const params = url.searchParams;
        const id = params.get("id");

        if(!id){
            return fail("id is required");
        }

        const userdata = await User.aggregate([
            {$match:{_id:new mongoose.Types.ObjectId(id)}},
            {$lookup:{ from:"dps", localField:"_id", foreignField:"user", as:"photo"}},
            {$project:{ username:1, "photo.data":1,"photo.type":1}}
        ]);

        if(userdata.length === 0){
            return fail("No such user found.");
        }

        const body = {
            username:userdata[0].username,
            photo:userdata[0].photo[0]
        }

        return success("fetched data.",body);
    } catch (error:any) {
        console.log(error);
        if(error.message){
            return fail(error.message);
        }
        return fail("something went wrong.");
    }
} 