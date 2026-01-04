/* eslint-disable @typescript-eslint/no-explicit-any */
import { PrismaClient } from "@prisma/client";
import { getTenantId } from "./tenant-context";

// Cache for dedicated tenant clients
const prismaClients = new Map<string, PrismaClient>();

// Shared database client
const sharedPrisma = new PrismaClient();

export async function getPrismaClient() {
    const tenantId = await getTenantId();

    if (!tenantId) {
        return sharedPrisma;
    }

    // Fetch tenant details to check for dedicated DB
    // Use sharedPrisma but specifically looking for the tenant config
    const tenant = await sharedPrisma.tenant.findUnique({
        where: { id: tenantId },
        select: { dbConnectionUrl: true },
    });

    // If tenant doesn't exist, we might want to throw or fallback.
    // For safety, throw.
    if (!tenant) {
        throw new Error(`Tenant not found: ${tenantId}`);
    }

    let client: PrismaClient;

    if (tenant.dbConnectionUrl) {
        // Dedicated Database
        if (prismaClients.has(tenant.dbConnectionUrl)) {
            client = prismaClients.get(tenant.dbConnectionUrl)!;
        } else {
            client = new PrismaClient({
                datasources: {
                    db: {
                        url: tenant.dbConnectionUrl,
                    },
                },
            });
            prismaClients.set(tenant.dbConnectionUrl, client);
        }
    } else {
        // Shared Database
        client = sharedPrisma;
    }

    return client.$extends({
        query: {
            $allModels: {
                async $allOperations({
                    model,
                    operation,
                    args,
                    query,
                }: {
                    model: string;
                    operation: string;
                    args: any;
                    query: any;
                }) {
                    // Models that require tenant scoping
                    const tenantScopedModels = [
                        "Barbershop",
                        "Barber",
                        "Service",
                        "AvailabilityRule",
                        "AvailabilityException",
                        "Customer",
                        "Appointment",
                        "Payment",
                        "Expense",
                        // 'Subscription' ? Usually subscription is platform level, but belongs to tenant.
                        // The prompt said: "Core Multi-Tenant Tables: Tenant... users... subscriptions".
                        // "Tenant-Scoped (Enforced): Appointment, Customer, Transaction, Expense".
                        // It seems Subscription is implicit. Let's include it if it has tenantId.
                        "Subscription",
                    ];

                    if (tenantScopedModels.includes(model)) {
                        // Inject tenantId on Create
                        if (["create", "createMany"].includes(operation)) {
                            if (args.data) {
                                if (Array.isArray(args.data)) {
                                    args.data.forEach((item: any) => {
                                        // Only set if not already present (allows system override if needed)
                                        if (
                                            (item as any).tenantId === undefined
                                        )
                                            (item as any).tenantId = tenantId;
                                    });
                                } else {
                                    if (
                                        (args.data as any).tenantId ===
                                        undefined
                                    )
                                        (args.data as any).tenantId = tenantId;
                                }
                            }
                        }

                        // Inject where clause on Read/Update/Delete
                        if (
                            [
                                "findUnique",
                                "findFirst",
                                "findMany",
                                "update",
                                "updateMany",
                                "delete",
                                "deleteMany",
                                "count",
                                "aggregate",
                                "groupBy",
                            ].includes(operation)
                        ) {
                            // Ensure args.where exists
                            args.where = { ...args.where, tenantId };
                        }
                    }

                    return query(args);
                },
            },
        },
    });
}
