import { fail } from "@/app/lib/api/response";
import { NextRequest } from "next/server";

export async function POST(req : NextRequest){
    try {
        const {identifier} = await req.json();

        const query = {verified:true};

        const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if(regex.test(identifier)){

        }
    } catch (error:any) {
        return fail(error.message);
    }
}