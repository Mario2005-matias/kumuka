import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "motion/react";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useProfile } from "@/features/profile/hooks/useProfile";
import { useAuthStore } from "@/stores/authStore";
import { ROUTES } from "@/lib/constants/routes";
import { DESKTOP_NAV } from "@/lib/constants/navigation";
import { cn } from "@/lib/utils";
import { ModeToggle } from "@/components/shared/mode-toggle";
import { LanguageSwitcher } from "@/components/shared/LanguageSwitcher";
import { useTranslation } from "react-i18next";

export function Navbar() {
  const user = useAuthStore((state) => state.user);
  const photo = useProfile(user?.id ?? "").data?.foto;
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const logout = useLogout();
  const { t } = useTranslation("common");

  const initials = user?.email?.slice(0, 2).toUpperCase() ?? "U";

  return (
    <header className="header-enter sticky top-0 z-40 w-full glass-surface border-b">
      <div className="mx-auto grid h-16 w-full max-w-7xl grid-cols-[1fr_auto] items-center gap-4 px-4 sm:px-6 lg:grid-cols-[1fr_auto_1fr] lg:px-8">
        <Link
          className="inline-flex min-h-11 w-fit items-center whitespace-nowrap text-xl font-bold tracking-tight transition-opacity hover:opacity-80"
          to={ROUTES.home}
        >
          KUMUKA
        </Link>

        {isAuthenticated && (
            <nav aria-label={t("navigation.main")} className="hidden items-center gap-1 rounded-full border border-border/60 bg-card/50 p-1 lg:flex">
              {DESKTOP_NAV.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "relative whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                      isActive ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground",
                    )
                  }
                  key={item.href}
                  to={item.href}
                >
                  {({ isActive }) => (
                    <>
                      {isActive && (
                        <motion.span
                          aria-hidden="true"
                          className="absolute inset-0 -z-10 rounded-full bg-primary shadow-sm"
                          layoutId="public-nav-pill"
                          transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        />
                      )}
                      {t(`navigation.${item.translationKey}`)}
                    </>
                  )}
                </NavLink>
              ))}
            </nav>
        )}

        <div className="flex items-center justify-end gap-2 lg:col-start-3">
          <LanguageSwitcher />
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
                {t("actions.login")}
              </Button>
              <Button
                className="min-h-11 px-4"
                nativeButton={false}
                render={<Link to={ROUTES.auth.register} />}
                size="sm"
              >
                {t("actions.start")}
              </Button>
            </>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    {photo && <AvatarImage alt="" className="object-cover" src={photo} />}
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
                  {t("navigation.profile")}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => logout.mutate()}>
                  <LogOut className="mr-2 h-4 w-4" />
                  {t("navigation.logout")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </header>
  );
}
