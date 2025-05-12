
import { Outlet } from "react-router-dom";
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader } from "@/components/ui/sidebar";
import { SidebarNav } from "./SidebarNav";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./ModeToggle";
import { useNavigate } from "react-router-dom";

const Layout = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex min-h-screen">
      <Sidebar>
        <SidebarHeader className="border-b px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-wallet-purple to-wallet-dark-purple flex items-center justify-center text-white font-bold">
              SW
            </div>
            <span className="font-semibold text-lg">Smart Wallet</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarNav />
        </SidebarContent>
        <SidebarFooter className="border-t p-4 flex items-center justify-between">
          <ModeToggle />
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/login')}
          >
            Sign Out
          </Button>
        </SidebarFooter>
      </Sidebar>
      
      <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
