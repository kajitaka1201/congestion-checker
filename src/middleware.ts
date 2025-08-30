import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/(.*)"]
};

export default function middleware(req: NextRequest) {
  if (process.env.NODE_ENV === "development") {
    return NextResponse.next();
  }
  if (!process.env.USERNAME || !process.env.PASSWORD) {
    console.error(
      "Basic Auth credentials are not set in environment variables."
    );
    return new NextResponse("Internal Server Error", { status: 500 });
  }

  const basicAuth = req.headers.get("authorization");

  if (basicAuth?.startsWith("Basic ")) {
    const authValue = basicAuth.substring(6);
    try {
      const [user, password] = atob(authValue).split(":", 2);

      if (user === process.env.USERNAME && password === process.env.PASSWORD) {
        return NextResponse.next();
      }
    } catch (e) {
      console.error("Failed to decode Basic Auth credentials:", e);
    }
  }

  return new NextResponse("Unauthorized.", {
    status: 401,
    headers: {
      "WWW-authenticate": 'Basic realm="Secure Area"'
    }
  });
}
