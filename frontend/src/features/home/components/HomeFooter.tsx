import { Link } from "react-router-dom";
import { revealSection } from "../lib/animations/sectionAnimations";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { ROUTES } from "@/lib/constants/routes";
import { useTranslation } from "react-i18next";

const footerLinks = [
  { key: "learn", to: ROUTES.learn.root },
  { key: "experiences", to: ROUTES.experiences.root },
  { key: "login", to: ROUTES.auth.login },
] as const;

export function HomeFooter() {
  const { t: tCommon } = useTranslation("common");
  const { t } = useTranslation("home");
  const footerRef = useScrollAnimation(revealSection);

  return (
    <footer className="border-t bg-background" ref={footerRef}>
      <div className="container mx-auto flex flex-col gap-6 px-4 py-8 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
        <div data-reveal>
          <Link
            className="rounded-sm text-lg font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            to={ROUTES.home}
          >
            KUMUKA
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            {t("footer.tagline")}
          </p>
        </div>
        <nav aria-label={tCommon("navigation.bottom")} data-reveal>
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map(({ key, to }) => (
              <li key={key}>
                <Link
                  className="inline-flex min-h-11 items-center rounded-sm text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  to={to}
                >
                  {key === "login"
                    ? tCommon("actions.login")
                    : tCommon(`navigation.${key}`)}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-muted-foreground sm:text-right" data-reveal>
          © {new Date().getFullYear()} KUMUKA. {t("footer.tagline")}
        </p>
      </div>
      
    </footer>
  );
}
