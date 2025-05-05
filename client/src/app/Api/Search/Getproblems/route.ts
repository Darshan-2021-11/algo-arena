import Problem from "@/app/lib/api/models/Problem/problemModel";
import { redisConnect } from "@/app/lib/api/redisConnect";
import { fail, success } from "@/app/lib/api/response";
import { NextRequest } from "next/server";
import { middleware } from "../../middleware/route";

export async function GET(req: NextRequest) {
    ;
    const url = new URL(req.url);
    const params = url.searchParams;
    const text = params.get("t");
    const page: number = Number(params.get('p')) || 1;
    const pagelen = Number(params.get('l')) || 10;
    let i = 0, j = pagelen;
    if (page > 1) {
        i = (pagelen * page) - pagelen;
        j = i + pagelen;
    }

    if (!text) {
        return fail("Text is required.");
    }
    const ntext = ".*" + text + ".*";
    const key = `${ntext}-${i}-${j}`

    try {
        const redis = await redisConnect();
        if (redis) {
            const res = await redis.get(key);
            if (res) {
                const body = await JSON.parse(res);

                return success("search result found", body);
            }
        }
        const res = await Problem.aggregate([
            { $match: { title: { $regex: ntext, $options: "i" }, private: false } },
            { $skip: i },
            { $limit: pagelen },
            {
                $project: {
                    title: 1,
                    difficulty: 1
                }
            }
        ])

        const body = {
            res,
            end:res.length < pagelen ? true :false
        }

        if (redis) {
            try {
                await redis.set(key, JSON.stringify(body), { EX: 3600 * 24 })
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