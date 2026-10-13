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
    <nav
      aria-label="Navegação inferior"
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-surface-1/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-xl md:hidden"
    >
      <div className="grid grid-cols-4">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.href}
              to={item.href}
              className={({ isActive }) =>
                cn(
                  'flex min-h-14 flex-col items-center justify-center gap-1 py-2 text-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring',
                  isActive
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:bg-surface-3 hover:text-foreground',
                )
              }
            >
              <Icon aria-hidden="true" className="h-5 w-5" />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}