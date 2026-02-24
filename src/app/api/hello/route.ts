import { NextResponse } from "next/server";

/**
 * GET /api/hello
 * 예시 API 엔드포인트
 */
export async function GET() {
  return NextResponse.json({
    message: "Hello from Next.js API!",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}
