import Dp from "@/app/lib/api/models/User/dpModel";
import { fail, success } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/api/databaseConnect";

export async function DELETE(req: NextRequest) {
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

        await dbConnect();

        const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin: boolean };

        await Dp.deleteOne({user:new mongoose.Types.ObjectId(decodedtoken.id)});

        return success("Profile image saved.", 200)
    } catch (error: any) {
        return fail(error.message);
    }
}