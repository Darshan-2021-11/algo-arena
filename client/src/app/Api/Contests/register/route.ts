import { fail, success } from "@/app/lib/api/response";
import { NextRequest } from "next/server";
import Participant from "@/app/lib/api/models/Contest/participantModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export async function POST(req: NextRequest) {
    try {
        ;
        const {id,user} = await req.json();

        if(!id || !user){
            return fail("id and user is required.");
        }

        await dbConnect();

        await Participant.create({
            user,
            contest:id,
        })

        return success("registered successfully.");

    } catch (error: any) {
        console.log(error);
        return fail(error.message);
    }
}