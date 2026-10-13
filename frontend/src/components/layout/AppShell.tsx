import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { AppTopbar } from './AppTopbar';
import { BottomNavigation } from './BottomNavigation';

export function AppShell() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background md:flex">
      <AppSidebar
        collapsed={sidebarCollapsed}
        mobileOpen={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
      />
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <AppTopbar onOpenMobileMenu={() => setMobileMenuOpen(true)} />
        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          <div className="mx-auto w-full max-w-[1440px] px-4 py-6 sm:px-6 sm:py-8 lg:px-10">
            <Outlet />
          </div>
        </main>
        <BottomNavigation />
      </div>
    </div>
  );
}
