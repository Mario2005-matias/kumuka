import {
  Bell,
  ChevronRight,
  Command,
  Menu,
  Search,
  UserRound,
  X,
  LogOut,
} from 'lucide-react';
import { useEffect, useMemo, useState, type FormEvent, type KeyboardEvent as ReactKeyboardEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ROUTES } from '@/lib/constants/routes';
import { useAuthStore } from '@/stores/authStore';
import { ModeToggle } from '../shared/mode-toggle';
import { LanguageSwitcher } from '@/components/shared/LanguageSwitcher';
import { useTranslation } from 'react-i18next';

interface AppTopbarProps {
  onOpenMobileMenu: () => void;
}

type NavigationTranslationKey =
  | 'navigation.home'
  | 'navigation.learn'
  | 'navigation.journey'
  | 'navigation.profile'
  | 'navigation.experiences'
  | 'navigation.opportunities';
type SearchDescriptionKey =
  | 'search.description.home'
  | 'search.description.learn'
  | 'search.description.journey'
  | 'search.description.experiences'
  | 'search.description.opportunities'
  | 'search.description.profile';

const pageLabelKeys: Record<string, NavigationTranslationKey> = {
  [ROUTES.dashboard]: 'navigation.home',
  [ROUTES.learn.root]: 'navigation.learn',
  [ROUTES.journey]: 'navigation.journey',
  [ROUTES.profile]: 'navigation.profile',
  [ROUTES.experiences.root]: 'navigation.experiences',
  [ROUTES.opportunities.root]: 'navigation.opportunities',
};

const searchLinks: {
  label: NavigationTranslationKey;
  description: SearchDescriptionKey;
  to: string;
}[] = [
  { label: 'navigation.home', description: 'search.description.home', to: ROUTES.dashboard },
  { label: 'navigation.learn', description: 'search.description.learn', to: ROUTES.learn.root },
  { label: 'navigation.journey', description: 'search.description.journey', to: ROUTES.journey },
  { label: 'navigation.experiences', description: 'search.description.experiences', to: ROUTES.experiences.root },
  { label: 'navigation.opportunities', description: 'search.description.opportunities', to: ROUTES.opportunities.root },
  { label: 'navigation.profile', description: 'search.description.profile', to: ROUTES.profile },
];

export function AppTopbar({ onOpenMobileMenu }: AppTopbarProps) {
  const { t } = useTranslation('common');
  const location = useLocation();
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeResult, setActiveResult] = useState(0);

  const currentPageKey: NavigationTranslationKey | undefined =
    pageLabelKeys[location.pathname] ??
    (location.pathname.startsWith(ROUTES.learn.root)
      ? 'navigation.learn'
      : location.pathname.startsWith(ROUTES.experiences.root)
        ? 'navigation.experiences'
        : location.pathname.startsWith(ROUTES.opportunities.root)
          ? 'navigation.opportunities'
          : undefined);
  const currentPage = currentPageKey ? t(currentPageKey) : 'KUMUKA';
  const results = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase();
    return normalized
      ? searchLinks.filter((item) =>
          `${t(item.label)} ${t(item.description)}`
            .toLocaleLowerCase()
            .includes(normalized),
        )
      : searchLinks;
  }, [query, t]);

  useEffect(() => {
    function handleWindowKeyDown(event: globalThis.KeyboardEvent) {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSearchOpen((open) => !open);
      } else if (event.key === 'Escape') {
        setSearchOpen(false);
      }
    }

    window.addEventListener('keydown', handleWindowKeyDown);
    return () => window.removeEventListener('keydown', handleWindowKeyDown);
  }, []);

  function submitSearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = results[activeResult];
    if (result) {
      navigate(result.to);
      setSearchOpen(false);
      setQuery('');
    }
  }

  function handleSearchKeyDown(event: ReactKeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setActiveResult((index) =>
        results.length ? (index + 1) % results.length : 0,
      );
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveResult((index) =>
        results.length ? (index - 1 + results.length) % results.length : 0,
      );
    }
  }

  function logout() {
    clearAuth();
    navigate(ROUTES.home);
  }

  const initials = user?.email.slice(0, 2).toUpperCase() ?? 'K';

  return (
    <>
      <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6">
        <Button
          aria-label={t('navigation.open')}
          className="md:hidden"
          onClick={onOpenMobileMenu}
          size="icon"
          type="button"
          variant="ghost"
        >
          <Menu aria-hidden="true" />
        </Button>

        <nav aria-label="Breadcrumb" className="flex min-w-0 items-center gap-2 text-sm">
          <Link
            className="hidden text-muted-foreground transition-colors hover:text-foreground sm:inline"
            to={ROUTES.dashboard}
          >
            {t('breadcrumb.home')}
          </Link>
          <ChevronRight aria-hidden="true" className="hidden size-4 text-subtle-foreground sm:inline" />
          <span aria-current="page" className="truncate font-medium">
            {currentPage}
          </span>
        </nav>

        <div className="flex-1" />
        <Button
          aria-label={t('search.open')}
          className="h-9 w-9 sm:w-auto sm:justify-start sm:gap-3 sm:border sm:border-border sm:bg-surface-1 sm:px-3"
          onClick={() => setSearchOpen(true)}
          type="button"
          variant="ghost"
        >
          <Search aria-hidden="true" className="size-4" />
          <span className="hidden text-sm text-muted-foreground sm:inline">
            {t('actions.search')}
          </span>
          <kbd className="hidden items-center gap-1 rounded border bg-surface-2 px-1.5 py-0.5 text-[10px] text-muted-foreground lg:inline-flex">
            <Command aria-hidden="true" className="size-3" /> K
          </kbd>
        </Button>
        <Button
          aria-label={t('notifications.soon')}
          className="hidden sm:inline-flex"
          disabled
          size="icon"
          type="button"
          variant="ghost"
        >
          <Bell aria-hidden="true" className="size-[18px]" />
        </Button>
        <LanguageSwitcher />
        <ModeToggle />
        <DropdownMenu>
          <DropdownMenuTrigger
            aria-label={t('account.open')}
            className="flex size-9 items-center justify-center rounded-full transition-colors hover:bg-surface-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Avatar>
              <AvatarFallback className="bg-primary/15 font-semibold text-primary">
                {initials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="min-w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="truncate">
                {user?.email ?? t('account.yourAccount')}
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => navigate(ROUTES.profile)}>
              <UserRound aria-hidden="true" />
              {t('navigation.profile')}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={logout}>
              <LogOut aria-hidden="true" />
              {t('navigation.logout')}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </header>

      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-background/75 px-4 pt-[12vh] backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setSearchOpen(false);
          }}
        >
          <section
            aria-label={t('search.dialog')}
            aria-modal="true"
            className="w-full max-w-xl overflow-hidden rounded-2xl border bg-popover shadow-2xl shadow-primary/10"
            role="dialog"
          >
            <form
              className="flex items-center gap-3 border-b px-4"
              onSubmit={submitSearch}
            >
              <Search aria-hidden="true" className="size-5 shrink-0 text-muted-foreground" />
              <input
                aria-label={t('search.pages')}
                aria-activedescendant={
                  results[activeResult] ? `global-search-${activeResult}` : undefined
                }
                aria-controls="global-search-results"
                aria-expanded="true"
                aria-haspopup="listbox"
                autoFocus
                className="h-14 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                onKeyDown={handleSearchKeyDown}
                onChange={(event) => {
                  setActiveResult(0);
                  setQuery(event.target.value);
                }}
                placeholder={t('search.placeholder')}
                role="combobox"
                value={query}
              />
              <Button
                aria-label={t('actions.cancel')}
                onClick={() => setSearchOpen(false)}
                size="icon"
                type="button"
                variant="ghost"
              >
                <X aria-hidden="true" />
              </Button>
            </form>
            <ul
              className="max-h-[55vh] overflow-y-auto p-2  "
              id="global-search-results"
              role="listbox"
            >
              {results.length > 0 ? (
                results.map((item, index) => (
                  <li key={item.to} role="none">
                    <button
                      aria-selected={index === activeResult}
                      id={`global-search-${index}`}
                      className={`w-full text-start flex items-center justify-between rounded px-3 py-3 transition-colors hover:bg-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${
                        index === activeResult ? 'bg-accent' : ''
                      }`}
                      onClick={() => {
                        navigate(item.to);
                        setSearchOpen(false);
                        setQuery('');
                      }}
                      role="option"
                      type="button"
                    >
                      <span>
                        <span className="block text-sm font-medium">{t(item.label)}</span>
                        <span className="mt-0.5 block text-xs text-muted-foreground">
                          {t(item.description)}
                        </span>
                      </span>
                      <ChevronRight aria-hidden="true" className="size-4 text-muted-foreground" />
                    </button>
                  </li>
                ))
              ) : (
                <li className="px-4 py-8 text-center text-sm text-muted-foreground">
                  {t('search.empty')}
                </li>
              )}
            </ul>
            <p className="border-t px-4 py-3 text-xs text-muted-foreground">
              {t('search.keyboardHelp')}
            </p>
          </section>
        </div>
      )}
    </>
  );
}
