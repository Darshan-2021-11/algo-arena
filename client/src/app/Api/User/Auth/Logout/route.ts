import { fail } from "assert";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest, res:NextResponse) {
    try {
        ;
        const response = NextResponse.json({
            success:true,
            message:"Logged out successfully."
        },{status:200})

        response.cookies.delete("token");
        response.cookies.delete("refresh-token");
        response.cookies.delete("x-cref-token")
        return response;
    } catch (error:any) {
        return fail(error.message ? error.message : null);
    }    
}