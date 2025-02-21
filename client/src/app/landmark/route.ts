import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { landmarkId } = await request.json();

    revalidateTag("landmarks");
    revalidateTag(`landmark${landmarkId}`);

    return NextResponse.json({ revalidated: true });
  } catch (error: any) {
    return NextResponse.json({ revalidated: false, error: error.message });
  }
}
