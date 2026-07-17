import {
    SidebarProvider,
} from "@workspace/ui/components/sidebar";
import { AppSidebar } from "@/components/dashboard/app-sidebar";

export default function DashboardLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className="flex p-8">{children}</main>
        </SidebarProvider>
    );
}
