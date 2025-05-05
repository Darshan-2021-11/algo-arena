import dbConnect from "@/app/lib/api/databaseConnect";
import Contest from "@/app/lib/api/models/Contest/contestModel";
import { fail, success } from "@/app/lib/api/response";
import mongoose from "mongoose";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { middleware } from "../../middleware/route";

export async function DELETE(req: NextRequest) {
    try {
        await middleware(req);
        const cookieStore = cookies();
        const token = cookieStore.get("decodedtoken")?.value;
        if (!token) {
            return fail("Unauthorised access", 403);
        }

        const decodedtoken = await JSON.parse(token) as { id: string, name: string, admin?: boolean };

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