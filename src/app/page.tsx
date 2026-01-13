"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export default function Home() {
    const router = useRouter();

    const handleLogin = (role: string) => {
        // Mock Login: Set cookie and redirect
        document.cookie = `user_role=${role}; path=/`;

        if (role === "CUSTOMER") router.push("/customer");
        if (role === "BARBER") router.push("/barber");
    };

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50">
            <main className="flex flex-col items-center gap-8 text-center">
                <h1 className="text-5xl font-bold tracking-tight">RoyalCuts</h1>
                <p className="text-lg text-zinc-600 dark:text-zinc-400 max-w-md">
                    The premium booking experience for barbers and clients. Manage appointments, track revenue, and look
                    your best.
                </p>
                <div className="flex gap-4">
                    <Button onClick={() => handleLogin("CUSTOMER")}>Login as Customer</Button>
                    <Button variant="outline" onClick={() => handleLogin("BARBER")}>
                        Login as Barber
                    </Button>
                </div>
            </main>
        </div>
    );
}
