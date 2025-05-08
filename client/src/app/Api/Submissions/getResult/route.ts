import { fail } from "@/app/lib/api/response";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req:NextRequest) {
    try {
        const id = new URL(req.url).searchParams.get("id");
        if(!id){
            return fail("id is required");
        }

        const url = `http://localhost:2358/submissions/${id}?base64_encoded=false&wait=false`;

        const data = await axios.get(url);

        return NextResponse.json(data.data,{status:data.status})
    } catch (error:any) {
        if(error.message){
            return fail(error.message);
        }
    }
}