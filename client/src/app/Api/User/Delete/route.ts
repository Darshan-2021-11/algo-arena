import { cookies } from "next/headers";
import { fail, success } from "@/app/lib/api/response";
import { NextRequest } from "next/server";
import dbConnect from "@/app/lib/api/databaseConnect";
import User from "@/app/lib/api/models/User/userModel";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import Submission from "@/app/lib/api/models/User/submissionModel";

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

        const decodedToken = jwt.verify(token, secret) as { id: string, name: string, admin?:boolean };

        const user = new URL(req.url).searchParams.get("u");
        if (!user) {
            return fail("user is required");
        }

        await dbConnect();

        const session = await mongoose.startSession();

        try {
            session.startTransaction();

            const existingUser = await User.findByIdAndUpdate(decodedToken.id, { $unset: { email: "", password: "", verificationToken: "", resetToken: "", tokenExpires: "", resetTokenExpires: "", verified: "" }, isdeleted: true })

            if (existingUser) {
                const _id = new mongoose.Types.ObjectId(user);
                await User.deleteOne({ _id });
                await Submission.deleteMany({ _id })
            }

            await session.commitTransaction();
            await session.endSession();
        } catch (error) {
            await session.abortTransaction();
            await session.endSession();
            return fail("failed to delete user account.");
        }

        // await User.deleteOne({_id:new mongoose.Types.ObjectId(decodedToken.id)});

        return success("user successfully deleted.");

    } catch (error: any) {
        return fail(error.message);
    }
}