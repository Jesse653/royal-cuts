import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";

export async function GET() {
    try {
        const db = await getPrismaClient();

        // Simple query to verify connection
        // Using $queryRaw for a lightweight check that works on any table or just "SELECT 1"
        // Note: Prisma's $queryRaw`SELECT 1` is a standard health check pattern.
        await db.$queryRaw`SELECT 1`;

        return NextResponse.json(
            { status: "ok", timestamp: new Date().toISOString() },
            { status: 200 }
        );
    } catch (error: unknown) {
        console.error("Health check failed:", error);
        return NextResponse.json(
            {
                status: "error",
                message: "Database connection failed",
                error: (error as Error).message,
            },
            { status: 500 }
        );
    }
}
