"use server"
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';
import { fail, success } from "@/app/lib/api/response";
import dbConnect from "@/app/lib/api/databaseConnect";
import mongoose from "mongoose";
import ContestProblem from "@/app/lib/api/models/Contest/problemModel";

export async function POST(req: NextRequest) {
    try {

        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail("Server is not working")
        }

        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return fail("unauthorized access.", 403);
        }

        const { admin } = jwt.verify(token, secret) as { id: string, name: string, admin: boolean };

        if (!admin) {
            return fail("Unauthorized accesss.", 403);
        }

        const { problems, contestid } = await req.json();

        await dbConnect();

        if (!Array.isArray(problems)) {
            return fail("problems is not an array", 400);
        }

        const session = await mongoose.startSession();

        try {
            session.startTransaction();
            const proms = problems.map((problem) =>
                ContestProblem.create({ problem, contest: contestid }, { session })
            );
            await Promise.all(proms)
            await session.commitTransaction();
            await session.endSession();
            return success("Contest created successfully.", 201);

        } catch (error: any) {
            await session.abortTransaction();
            await session.endSession();
            return fail(error.message || "unable to add questions", 400);
        }



    } catch (error: any) {
        console.log(error)
        return fail(error.message ? error.message : "something went wrong.")
    }
}