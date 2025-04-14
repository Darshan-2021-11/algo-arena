import Problem from "@/app/lib/api/models/Problem/problemModel";
import { fail, success } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from 'jsonwebtoken';

export async function DELETE(req: NextRequest) {
    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) {
            return fail("server configuration failed.")
        }
        const cookieStore = cookies();
        const token = cookieStore.get("token")?.value;
        if (!token) {
            return fail("Unauthorised access", 403);
        }

        jwt.verify(token, secret) as { id: string, name: string, admin?: boolean };

        const url = new URL(req.url);
        const id = url.searchParams.get("p");
        if (!id) {
            return fail("problem id is required.", 400);
        }

        await Problem.findByIdAndUpdate(
            id, 
            { 
                isdeleted: true, 
                $unset: { 
                    tags: "", 
                    constraints: "", 
                    testcases: "", 
                    timeLimit: "", 
                    spaceLimit: "", 
                } 
            });

        return success("successfully deleted.")
    } catch (error: any) {
        return fail(error.message || "something went wrong.");
    }
}