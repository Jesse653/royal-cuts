"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    // Mock Login sets a cookie
    const handleLogin = (role: string) => {
        setLoading(true);
        // In a real app this would go to an API route
        document.cookie = `user_role=${role}; path=/`;

        setTimeout(() => {
            if (role === "CUSTOMER") router.push("/customer");
            if (role === "BARBER") router.push("/barber");
        }, 500);
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>Welcome Back</CardTitle>
                    <CardDescription>Choose a role to simulate login (Development Only)</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 gap-4">
                        <Button variant="outline" onClick={() => handleLogin("CUSTOMER")} disabled={loading}>
                            Customer
                        </Button>
                        <Button variant="outline" onClick={() => handleLogin("BARBER")} disabled={loading}>
                            Barber
                        </Button>
                    </div>
                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <span className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                            <span className="bg-white dark:bg-zinc-950 px-2 text-zinc-500">Or continue with</span>
                        </div>
                    </div>
                    <Input type="email" placeholder="Email" disabled />
                    <Input type="password" placeholder="Password" disabled />
                    <Button disabled>Sign In</Button>
                </CardContent>
            </Card>
        </div>
    );
}
