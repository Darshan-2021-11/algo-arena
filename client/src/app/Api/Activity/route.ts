import Activity from "@/app/lib/api/models/User/activityModel";
import { fail } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest) {
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

        const decodedtoken = jwt.verify(token, secret) as { id: string, name: string, admin: boolean };

        const url = new URL(req.url);
        const year = Number(url.searchParams.get("y"));
        const sd = new Date(`${year - 1}-12-31`);
        sd.setHours(0, 0, 0, 0);
        const ed = new Date(`${year + 1}-01-01`);
        ed.setHours(0, 0, 0, 0);
        const activity = await Activity.findOne({ user: decodedtoken.id, "activity.date": { $gte: sd, $lt: ed } }, { activity: 1 });
        console.log(activity,decodedtoken)
        return NextResponse.json({
            success: true,
            activity:activity.activity
        }, { status: 200 })

    } catch (err: any) {
        return fail(err.message ? err.message : "something went wrong.")
    }
}