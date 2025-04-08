import { NextResponse, NextRequest } from "next/server";
import { fail } from "./app/lib/api/response";
import { requestIds } from "./app/Api/idStore";

function isValidUUID(uuid:string) :boolean {
  const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return regex.test(uuid);
}

export function middleware(req: NextRequest) {
//   const id = req.headers.get("X-Request-Id");

//   if (!id || requestIds.has(id) || !isValidUUID(id) ) {
//     return fail("invalid request", 400);
//   }

//   requestIds.set(id,true);

  return NextResponse.next();
}

export const config = {
  matcher: "/Api/:path*"
};