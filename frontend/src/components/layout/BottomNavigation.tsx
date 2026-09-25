import { NavLink } from 'react-router-dom';
import { Home, BookOpen, Map, User } from 'lucide-react';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'Início', href: ROUTES.dashboard, icon: Home },
  { label: 'Aprender', href: ROUTES.learn.root, icon: BookOpen },
  { label: 'Jornada', href: ROUTES.journey, icon: Map },
  { label: 'Perfil', href: ROUTES.profile, icon: User },
] as const;

export function BottomNavigation() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background md:hidden">
      <div className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex flex-col items-center justify-center gap-1 py-2 text-xs transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground',
                )
              }
            >
              <Icon className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}