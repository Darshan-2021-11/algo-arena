import Problem from "@/app/lib/api/models/Problem/problemModel";
import { redisConnect } from "@/app/lib/api/redisConnect";
import { fail, success } from "@/app/lib/api/response";
import { NextRequest } from "next/server";

export async function GET(req: NextRequest) {
    const url = new URL(req.url);
    const text = url.searchParams.get("t");
    if (!text) {
        return fail("Text is required.");
    }
    const ntext = ".*" + text + ".*";

    try {
        const redis = await redisConnect();
        if (redis) {
            const res = await redis.get(ntext);
            if (res) {
                const body = await JSON.parse(res);
               
                return success("search result found", body);
            }
        }
        const res = await Problem.find({ title: { $regex: ntext, $options: "i" } })
            .select("title")
            .limit(5);

        const body = {
            res
        }

        if (redis) {
            try {
                await redis.set(ntext, JSON.stringify(body), {EX: 3600 * 24})
            } catch (error) {
                console.log(error);
            }
        }


        return success("search result found", body);
    } catch (error: any) {
        if (error.message) {
            return fail(error.message);
        }
        return fail("unable to search");
    }



}