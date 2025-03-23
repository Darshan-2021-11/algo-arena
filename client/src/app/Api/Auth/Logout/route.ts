import { success } from "@/app/lib/api/response";
import { fail } from "assert";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, res:NextResponse) {
    try {
        const cookieStore = cookies();
        const response = NextResponse.json({
            success:true,
            message:"Logged out successfully."
        },{status:200})

        response.cookies.delete("token");
        return response;
    } catch (error:any) {
        return fail(error.message ? error.message : null);
    }    
}