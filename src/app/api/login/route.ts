import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const { username, password } = await request.json();

  const validUser = process.env.AUTH_USERNAME || "admin";
  const validPass = process.env.AUTH_PASSWORD || "admin";

  if (username === validUser && password === validPass) {
    const response = NextResponse.json({ success: true });
    response.cookies.set("auth_token", "authenticated", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
    return response;
  }

  return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
}
