import { fail, success } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import Participant from "@/app/lib/api/models/Contest/participantModel";
import dbConnect from "@/app/lib/api/databaseConnect";

export async function POST(req: NextRequest) {
    try {

      const cookiestore = cookies();
        const token = cookiestore.get("decodedtoken")?.value as string;
        if(!token){
            return fail("Unauthorized access",403);
        }
        const decodedtoken = await JSON.parse(token) as { id: string, name: string, admin?: boolean };

        const {id} = await req.json();

        if(!id){
            return fail("id is required.");
        }

        await dbConnect();

        await Participant.create({
            user:decodedtoken.id,
            contest:id,
        })

        return success("registered successfully.");

    } catch (error: any) {
        console.log(error);
        return fail(error.message);
    }
}