"use client";

import { useTransition } from "react";
import { logout } from "@/lib/actions/logout";

import { Button } from "@workspace/ui/components/button";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    // SidebarTrigger,
} from "@workspace/ui/components/sidebar";
import { Home, KeyRound, LogOutIcon } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const [isPending, startTransition] = useTransition();

    return (
        <Sidebar collapsible="offcanvas" {...props}>
            <SidebarHeader className="flex flex-row items-center justify-between py-4">
                <Image
                    src="https://assets.veblex.com/logos/v1/wordmark/full-large-v.svg"
                    width={80}
                    height={30}
                    alt="Veblex"
                />
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={"Dashboard"}
                                    asChild
                                >
                                    <Link href={"/dashboard"}>
                                        <Home />
                                        <span>Dashboard</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <SidebarGroup>
                    <SidebarGroupLabel>Account</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton
                                    tooltip={"Change password"}
                                    asChild
                                >
                                    <Link href={"/change-password"}>
                                        <KeyRound />
                                        <span>Change password</span>
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <Button
                    className="justify-between px-4 py-5"
                    variant={"secondary"}
                    disabled={isPending}
                    onClick={() => startTransition(() => logout())}
                >
                    {isPending ? "Signing out..." : "Sign out"}
                    <LogOutIcon />
                </Button>
            </SidebarFooter>
        </Sidebar>
    );
}
