import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/auth", `${process.env.NEXTAUTH_URL}`));
}
