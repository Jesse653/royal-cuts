"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, User, Home, Calendar, Scissors, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { cn } from "@/lib/utils";

export function AppShell({ children }: { children: React.ReactNode }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const pathname = usePathname();

    const isCustomer = pathname?.startsWith("/customer");
    const isBarber = pathname?.startsWith("/barber");
    const isDashboard = isCustomer || isBarber;

    // Use a simple check: if not dashboard, render children directly (public pages)
    if (!isDashboard) {
        return <>{children}</>;
    }

    // Dynamic Navigation items based on role
    const getNavItems = () => {
        if (isCustomer) {
            return [
                { label: "Home", href: "/customer", icon: Home },
                { label: "Book", href: "/customer/book", icon: Scissors }
            ];
        }
        if (isBarber) {
            return [
                { label: "Dashboard", href: "/barber", icon: Home },
                { label: "Schedule", href: "/barber/schedule", icon: Calendar }
            ];
        }
        return [];
    };

    const navItems = getNavItems();

    // Helper for Bottom Nav
    const BottomNav = () => (
        <div className="fixed bottom-0 left-0 right-0 z-50 flex h-16 items-center justify-around border-t border-border bg-background md:hidden">
            <Link
                href={isBarber ? "/barber" : "/customer"}
                className="flex flex-col items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
                <Home className="h-6 w-6" />
                <span>Home</span>
            </Link>
            <Link
                href={isBarber ? "/barber/schedule" : "/customer/book"}
                className="flex flex-col items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
                {isBarber ? <Calendar className="h-6 w-6" /> : <Scissors className="h-6 w-6" />}
                <span>{isBarber ? "Schedule" : "Book"}</span>
            </Link>
            <Link
                href="/profile" // Placeholder
                className="flex flex-col items-center gap-1 text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-50"
            >
                <User className="h-6 w-6" />
                <span>Profile</span>
            </Link>
        </div>
    );

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground font-sans">
            {/* Top Navigation Bar */}
            <header className="fixed top-0 left-0 right-0 z-40 flex h-16 items-center px-4 border-b border-border bg-background">
                {/* Left Side: Hamburger (Desktop Only) */}
                <div className="flex flex-1 justify-start">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="hidden md:flex"
                        onClick={() => setIsSidebarOpen(true)}
                    >
                        <Menu className="h-6 w-6" />
                    </Button>
                </div>

                {/* Center: Logo */}
                <div className="absolute left-1/2 -translate-x-1/2 text-xl font-bold tracking-tight">RoyalCuts</div>

                {/* Right Side: Profile & Theme (Desktop Only) */}
                <div className="flex flex-1 justify-end gap-2">
                    <div className="hidden md:flex items-center gap-2">
                        <ModeToggle />
                        <Button variant="ghost" size="icon">
                            <User className="h-6 w-6" />
                        </Button>
                    </div>
                </div>
            </header>

            {/* Sidebar Overlay */}
            <div
                className={cn(
                    "fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300",
                    isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
                )}
                onClick={() => setIsSidebarOpen(false)}
            />

            {/* Slide-out Sidebar */}
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-[101] w-64 transform bg-background p-6 shadow-xl transition-transform duration-300 ease-in-out",
                    isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                )}
            >
                <div className="flex items-center justify-between mb-8">
                    <div className="text-xl font-bold">Menu</div>
                    <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(false)}>
                        <X className="h-5 w-5" />
                    </Button>
                </div>
                <nav className="flex flex-col gap-2">
                    {navItems.map(item => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-muted/50"
                            onClick={() => setIsSidebarOpen(false)}
                        >
                            <item.icon className="h-5 w-5" />
                            <span>{item.label}</span>
                        </Link>
                    ))}
                    <div className="my-2 border-t border-border" />
                    <Link
                        href="/"
                        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-destructive hover:bg-muted/50"
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <LogOut className="h-5 w-5" />
                        <span>Logout</span>
                    </Link>
                </nav>
            </aside>

            {/* Main Content Area */}
            {/* Add padding-top for fixed header, padding-bottom for mobile footer */}
            <main className="flex-1 pt-16 pb-16 md:pb-0">
                <div className="p-4 md:p-8">{children}</div>
            </main>

            {/* Bottom Navigation (Mobile Only) */}
            <BottomNav />
        </div>
    );
}
