import User from "@/app/lib/api/models/User/userModel";
import { fail, success } from "@/app/lib/api/response";
import { NextRequest } from "next/server";
import { randomBytes } from 'crypto';
import { redisConnect } from "@/app/lib/api/redisConnect";
import handleEmailVerification from "@/app/lib/api/emailVerification";
import { middleware } from "@/app/Api/middleware/route";

const sendemail = async(email:string, token:string) => {
    try {
        const origin = process.env.NEXT_PUBLIC_ORIGIN;
        const url = `${origin}/Forgotpassword/Magiclink/login/${email}%${token}`;
        const encodeurl = encodeURI(url);
        const text = `Visit this link: ${encodeurl} to verify your email. Link will expire in 1 hour.`;

        await handleEmailVerification("Email Verification", text, email, text);
    } catch (emailError) {
        console.error("Email sending failed:", emailError);
    }
}

export async function POST(req: NextRequest) {
    try {
        await middleware(req);
        const { email } = await req.json();

        const regex = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
        if (!regex.test(email)) {
            return fail("invalid email.");
        }

        const redis = await redisConnect();

        if (redis) {
            const data = await redis.get(email);
            if (data) {
                if (data === "No") {
                    return fail("No such user found.", 404);
                } else {
                    await sendemail(email,data);
                    return success("Check you email for login link.");
                }
            }
        }

        const query = { verified: true, email };

        const user = await User.findOne(query).select("_id");

        if (!user) {
            if (redis) {
                redis.set(email, "No");
            }
            return fail("No such user found.", 404)
        }
        const token = randomBytes(32).toString("hex");
        if (redis) {
            await redis.set(email, token, { EX: 3600 });
        }

        await sendemail(email,token);
        return success("Check you email for login link.");

    } catch (error: any) {
        return fail(error.message);
    }
}