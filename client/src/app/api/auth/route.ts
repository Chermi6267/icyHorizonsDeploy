import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.redirect(new URL("/auth", "https://chermi6267.ru"));
}
