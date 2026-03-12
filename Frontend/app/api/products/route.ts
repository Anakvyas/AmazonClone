import { NextRequest, NextResponse } from "next/server";

const BACKEND_API_URL =
  process.env.BACKEND_API_URL || "http://localhost:8000/api";

export async function GET(request: NextRequest) {
  const category = request.nextUrl.searchParams.get("category");
  const url = new URL(`${BACKEND_API_URL}/products`);

  if (category && category !== "all") {
    url.searchParams.set("category", category);
  }

  try {
    const response = await fetch(url.toString(), {
      cache: "no-store",
    });

    if (!response.ok) {
      return NextResponse.json(
        { message: "Failed to fetch products from backend" },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error("Products proxy error", error);
    return NextResponse.json(
      { message: "Backend is unreachable" },
      { status: 502 }
    );
  }
}
