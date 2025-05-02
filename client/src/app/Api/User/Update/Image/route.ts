import Dp from "@/app/lib/api/models/User/dpModel";
import { fail, success } from "@/app/lib/api/response";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function POST(req: NextRequest) {
    try {
       const cookiestore = cookies();
        const token = cookiestore.get("decodedtoken")?.value as string;
        if(!token){
            return fail("Unauthorized access",403);
        }
        const decodedtoken = await JSON.parse(token) as { id: string, name: string, admin?: boolean };
        
        
        const formdata = await req.formData();
        const img = formdata.get("image");
        if (!img || !(img instanceof Blob)) {
            return fail("image is required.");
        };

        if (img.size > (500 * 1024)) {
            return fail("image exceeds maximum size allowed.");
        };

        const regex = /^image\//;
        if (!regex.test(img.type)) {
            return fail("Invalid type of file.");
        }

        const arraybuffer = await img.arrayBuffer();
        const buffer = Buffer.from(arraybuffer);

        const update = await Dp.findOneAndUpdate(
            { user: new mongoose.Types.ObjectId(decodedtoken.id) },
            {
                type: img.type,
                size: img.size,
                data: buffer
        });

        console.log(update)

        if(!update){   
            await Dp.create({
            type: img.type,
            size: img.size,
            data: buffer,
            user: decodedtoken.id
            })
        }

        return success("Profile image saved.", 200)
    } catch (error: any) {
        return fail(error.message);
    }
}