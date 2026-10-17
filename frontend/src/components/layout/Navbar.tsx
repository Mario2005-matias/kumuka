import { Link, NavLink, useNavigate } from "react-router-dom";
import { LogOut, User as UserIcon } from "lucide-react";
import { useLogout } from "@/features/auth/hooks";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants/routes";
import { DESKTOP_NAV } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/shared/mode-toggle";

export function Navbar() {
  const { user, isAuthenticated, clearAuth } = useAuthStore();
  const navigate = useNavigate();
  const logout = useLogout();

  const handleLogout = () => {
    clearAuth();
    navigate(ROUTES.home);
  };

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-8">
          <Link
            className="inline-flex min-h-11 items-center text-xl font-bold tracking-tight"
            to={ROUTES.home}
          >
            KUMUKA
          </Link>

          {isAuthenticated && (
            <nav className="hidden items-center gap-1 md:flex">
              {DESKTOP_NAV.map((item) => (
                <NavLink
                  key={item.href}
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-secondary text-secondary-foreground"
                        : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground",
                    )
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ModeToggle />
          {!isAuthenticated ? (
            <>
              <Button
                className="min-h-11 px-3"
                nativeButton={false}
                render={<Link to={ROUTES.auth.login} />}
                size="sm"
                variant="ghost"
              >
                Entrar
              </Button>
              <Button
                className="min-h-11 px-4"
                nativeButton={false}
                render={<Link to={ROUTES.auth.register} />}
                size="sm"
              >
                Começar agora
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{initials}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="truncate">
                  {user?.email}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => navigate(ROUTES.profile)}>
                  <UserIcon className="mr-2 h-4 w-4" />
                  Perfil
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
                <DropdownMenuItem onSelect={() => logout.mutate()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Sair
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
