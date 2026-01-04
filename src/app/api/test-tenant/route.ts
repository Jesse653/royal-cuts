import { NextResponse } from "next/server";
import { getPrismaClient } from "@/lib/db";
import { getTenantId } from "@/lib/tenant-context";

export async function GET() {
    const tenantId = await getTenantId();
    if (!tenantId) {
        return NextResponse.json(
            { error: "Tenant ID missing" },
            { status: 400 }
        );
    }

    try {
        const db = await getPrismaClient();

        // Create a dummy customer
        const customer = await db.customer.create({
            data: {
                name: `Test Customer for ${tenantId}`,
                email: `test@${tenantId}.com`,
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } as any, // Cast to any because tenantId is injected by the Prisma extension at runtime
        });

        // List all customers for this tenant
        const customers = await db.customer.findMany();

        return NextResponse.json({
            tenantId,
            created: customer,
            allCustomers: customers,
        });
    } catch (error: unknown) {
        return NextResponse.json(
            { error: (error as Error).message },
            { status: 500 }
        );
    }
}
