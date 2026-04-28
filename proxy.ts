import { NextRequest, NextResponse } from "next/server";

const REALM = "HELiiX Work";

function unauthorized() {
  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": `Basic realm="${REALM}"` },
  });
}

export function proxy(req: NextRequest) {
  const expected = process.env.WORK_PASSWORD;
  if (!expected) {
    return new NextResponse(
      "WORK_PASSWORD not configured. Set it in environment.",
      { status: 503 },
    );
  }

  const auth = req.headers.get("authorization");
  if (!auth?.startsWith("Basic ")) return unauthorized();

  let decoded: string;
  try {
    decoded = atob(auth.slice("Basic ".length).trim());
  } catch {
    return unauthorized();
  }

  const [, password = ""] = decoded.split(":", 2);
  if (password !== expected) return unauthorized();

  return NextResponse.next();
}

export const config = {
  matcher: ["/prototypes/:path*"],
};
