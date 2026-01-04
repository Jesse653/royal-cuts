import { headers } from "next/headers";

export const TENANT_HEADER = "x-tenant-id";

export async function getTenantId(): Promise<string | null> {
    try {
        const headerList = await headers();
        return headerList.get(TENANT_HEADER);
    } catch {
        // Falls back to null if called outside of request context
        return null;
    }
}
