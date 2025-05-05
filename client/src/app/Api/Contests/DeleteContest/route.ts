import dbConnect from "@/app/lib/api/databaseConnect";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { middleware } from "../../middleware/route";
import jwt from 'jsonwebtoken'

export async function DELETE(req: NextRequest) {
    try {
        ;
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail("Server is not working")
        }

        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return fail("unauthorized access.", 403);
        }

        const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin?: boolean };

        if (!decodedtoken.admin) {
            return fail("Unauthorized access.", 403);
        }
        const url = new URL(req.url);
        const params = url.searchParams;
        const qid = params.get("id");
        if (!qid) {
            return fail("Question id is required.");
        }

        await dbConnect();

        await Contest.deleteOne({ _id: new mongoose.Types.ObjectId(qid) });

        return success("contest deleted.");

    } catch (error: any) {
        return fail(error?.message || "something went wrong.");
    }
}