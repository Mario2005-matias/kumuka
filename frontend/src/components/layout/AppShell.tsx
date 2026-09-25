import { Outlet } from 'react-router-dom';
import { Navbar } from './Navbar';
import { BottomNavigation } from './BottomNavigation';

export function AppShell() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 pb-20 md:pb-0">
        <div className="container py-6">
          <Outlet />
        </div>
      </main>
      <BottomNavigation />
    </div>
  );
}