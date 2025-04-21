'use server';

import { NextRequest } from "next/server";
import { fail, success } from "@/app/lib/api/response";
import { getBloom } from "@/app/lib/api/generateHash";

export const validateUserInput = (username: string) => {
  const errors: string[] = [];
  
  if (username.length < 3 || username.length > 12) {
    errors.push("Username must be between 3 and 12 characters");
  }

  return errors;
};


export async function POST(request: NextRequest) {
  try {
    const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY;
    const origin = process.env.NEXT_PUBLIC_ORIGIN;
    if (!secretKey || !origin ) {
      return fail("Missing server configuration", 500);
    }

    const { username } = await request.json();
    if (!username) {
      return fail("All fields are required", 400);
    }

    const errs = validateUserInput(username);

    if(errs.length > 0){
      return fail(errs[0],400);
    }

    const bloom = await getBloom();
    if(bloom){
      const isexists = await bloom.exists(username);
      if(isexists){
        return fail("username is already taken",400);
      }
    }

   return success("Username is free");
  } catch (error: unknown) {
    console.error("Registration Error:", error);
    return fail("Server error occurred. Please try again.", 500);
  }
}
