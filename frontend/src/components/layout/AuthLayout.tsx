import { Link, Outlet } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';
import { ModeToggle } from '@/components/shared/mode-toggle';

export function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link to={ROUTES.home} className="text-xl font-bold tracking-tight">
            KUMUKA
          </Link>
          <ModeToggle />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>
    </div>
  );
}