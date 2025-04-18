import { Outlet } from "react-router-dom";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { AppSidebar } from "../components/SideBarGroup/SideBarContent";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";

export default function RootLayout() {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset>
        <header className="p-3 flex justify-between h-16 items-center gap-4 border-b bg-background ">
          <div className="flex text-primary">
            <SidebarTrigger />
            <h1 className="text-xl font-semibold text-accent-foreground">
              CV Manager
            </h1>
          </div>
          <div>
            <Button className="p-0 ">
              <ModeToggle />
            </Button>
          </div>
        </header>
        <main className="flex-1">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
