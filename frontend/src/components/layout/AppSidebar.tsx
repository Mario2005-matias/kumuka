import {
  BookOpen,
  Compass,
  GraduationCap,
  Home,
  LogOut,
  Map,
  PanelLeftClose,
  PanelLeftOpen,
  UserRound,
  X,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { ROUTES } from '@/lib/constants/routes';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface AppSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onCloseMobile: () => void;
}

const groups: {
  label: string;
  links: { label: string; to: string; icon: LucideIcon; end?: boolean }[];
}[] = [
  {
    label: 'Espaço',
    links: [
      { label: 'Início', to: ROUTES.dashboard, icon: Home, end: true },
      { label: 'Aprender', to: ROUTES.learn.root, icon: BookOpen },
      { label: 'Minha Jornada', to: ROUTES.journey, icon: Map },
    ],
  },
  {
    label: 'Descobrir',
    links: [
      { label: 'Experiências', to: ROUTES.experiences.root, icon: Compass },
    ],
  },
  {
    label: 'Conta',
    links: [{ label: 'Perfil', to: ROUTES.profile, icon: UserRound }],
  },
];

export function AppSidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onCloseMobile,
}: AppSidebarProps) {
  const sidebarRef = useRef<HTMLElement>(null);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  useEffect(() => {
    if (!mobileOpen) return;

    const sidebar = sidebarRef.current;
    const focusable = sidebar?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled])',
    );
    focusable?.[0]?.focus();

    function handleMobileDialogKeys(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        onCloseMobile();
        document.querySelector<HTMLElement>('[aria-label="Abrir navegação"]')?.focus();
        return;
      }

      if (event.key !== 'Tab' || !focusable?.length) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener('keydown', handleMobileDialogKeys);
    return () => document.removeEventListener('keydown', handleMobileDialogKeys);
  }, [mobileOpen, onCloseMobile]);

  function logout() {
    clearAuth();
    navigate(ROUTES.home);
  }

  return (
    <>
      {mobileOpen && (
        <button
          aria-label="Fechar navegação"
          className="fixed inset-0 z-40 bg-background/70 backdrop-blur-sm md:hidden"
          onClick={onCloseMobile}
          type="button"
        />
      )}
      <aside
        aria-modal={mobileOpen ? true : undefined}
        aria-label="Navegação principal"
        data-app-sidebar
        ref={sidebarRef}
        role={mobileOpen ? 'dialog' : undefined}
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col border-r bg-surface-1 transition-[transform,width] duration-200 md:sticky md:top-0 md:z-30 md:h-screen md:translate-x-0',
          collapsed && 'md:w-[76px]',
          mobileOpen
            ? 'visible translate-x-0'
            : 'invisible -translate-x-full md:visible md:translate-x-0',
        )}
      >
        <div className="flex h-16 items-center justify-between border-b px-4">
          <Link
            aria-label="KUMUKA — início"
            className="flex min-w-0 items-center gap-3 rounded-md font-bold tracking-tight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            to={ROUTES.dashboard}
          >
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-[image:var(--gradient-brand)] text-sm text-primary-foreground shadow-lg shadow-primary/20">
              K
            </span>
            <span className={cn('truncate', collapsed && 'md:hidden')}>
              KUMUKA
            </span>
          </Link>
          <Button
            aria-label="Fechar navegação"
            className="md:hidden"
            onClick={onCloseMobile}
            size="icon"
            type="button"
            variant="ghost"
          >
            <X aria-hidden="true" />
          </Button>
          <Button
            aria-label={collapsed ? 'Expandir menu' : 'Recolher menu'}
            className="hidden md:inline-flex"
            onClick={onCollapse}
            size="icon"
            type="button"
            variant="ghost"
          >
            {collapsed ? (
              <PanelLeftOpen aria-hidden="true" />
            ) : (
              <PanelLeftClose aria-hidden="true" />
            )}
          </Button>
        </div>

        <nav className="flex-1 space-y-7 overflow-y-auto px-3 py-6">
          {groups.map((group) => (
            <section aria-label={group.label} key={group.label}>
              <h2
                className={cn(
                  'mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-subtle-foreground',
                  collapsed && 'md:sr-only',
                )}
              >
                {group.label}
              </h2>
              <ul className="space-y-1">
                {group.links.map(({ label, to, icon: Icon, end }) => (
                  <li key={to}>
                    <NavLink
                      aria-label={collapsed ? label : undefined}
                      end={end}
                      onClick={onCloseMobile}
                      title={collapsed ? label : undefined}
                      to={to}
                      className={({ isActive }) =>
                        cn(
                          'group relative flex min-h-10 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                          collapsed && 'md:justify-center md:px-0',
                          isActive
                            ? 'bg-primary/10 text-primary before:absolute before:inset-y-2 before:left-0 before:w-0.5 before:rounded-full before:bg-primary'
                            : 'text-muted-foreground hover:bg-surface-3 hover:text-foreground',
                        )
                      }
                    >
                      <Icon aria-hidden="true" className="size-[18px] shrink-0" />
                      <span className={cn(collapsed && 'md:hidden')}>{label}</span>
                    </NavLink>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </nav>

        <div className="border-t p-3">
          <div className="mb-3 rounded-xl bg-gradient-to-br from-primary/10 to-transparent p-3">
            <div className="flex items-center gap-2 text-primary">
              <GraduationCap aria-hidden="true" className="size-4 shrink-0" />
              <span className={cn('text-xs font-medium', collapsed && 'md:hidden')}>
                Constrói o teu futuro.
              </span>
            </div>
          </div>
          <Button
            className={cn(
              'w-full justify-start gap-3 text-muted-foreground hover:text-foreground',
              collapsed && 'md:justify-center md:px-0',
            )}
            onClick={logout}
            type="button"
            variant="ghost"
          >
            <LogOut aria-hidden="true" className="size-[18px] shrink-0" />
            <span className={cn(collapsed && 'md:hidden')}>Sair</span>
          </Button>
        </div>
      </aside>
    </>
  );
}
