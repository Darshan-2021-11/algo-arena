import Activity from "@/app/lib/api/models/User/activityModel";
import { fail } from "@/app/lib/api/response";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    try {
        const url = new URL(req.url);
        const params = url.searchParams;
        const year = Number(params.get("y"));
        const id = params.get("id");
        if(!id){
            return fail("id is required");
        }
        const sd = new Date(`${year - 1}-12-31`);
        sd.setHours(0, 0, 0, 0);
        const ed = new Date(`${year + 1}-01-01`);
        ed.setHours(0, 0, 0, 0);
        const activity = await Activity.findOne({ user: id, "activity.date": { $gte: sd, $lt: ed } }, { activity: 1 });
        // console.log(activity,decodedtoken)
        return NextResponse.json({
            success: true,
            activity:activity.activity
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}