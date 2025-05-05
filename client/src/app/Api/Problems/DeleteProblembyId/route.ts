import Problem from "@/app/lib/api/models/Problem/problemModel";
import { fail, success } from "@/app/lib/api/response";
import { NextRequest } from "next/server";
import { middleware } from "../../middleware/route";

export async function DELETE(req: NextRequest) {
    try {
        await middleware(req);
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