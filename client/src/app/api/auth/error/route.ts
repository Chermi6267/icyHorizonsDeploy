import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const errorParam = searchParams.get("error");

  return NextResponse.redirect(
    new URL(
      `/auth?error=${
        errorParam ||
        "Ошибка при регистрации пользователя через сторонний сервис."
      }`,
      `${process.env.NEXTAUTH_URL}`
    )
  );
}
