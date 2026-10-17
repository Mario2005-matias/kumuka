import {
  ArrowDown,
  ArrowRight,
  BriefcaseBusiness,
  BookOpen,
  Sparkles,
  Target,
  Wrench,
} from "lucide-react";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useGsapContext } from "../hooks/useGsapContext";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";
import { animateHero } from "../lib/animations/heroAnimations";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";
import Painel from "../../../assets/painel.png"

const journey = [
  { key: "learn", icon: BookOpen, highlight: false },
  { key: "do", icon: Wrench, highlight: false },
  { key: "prove", icon: Target, highlight: false },
  { key: "opportunities", icon: BriefcaseBusiness, highlight: true },
] as const;

export function HeroSection() {
  const { t } = useTranslation("home");
  const heroRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();
  useGsapContext(heroRef, animateHero, !prefersReducedMotion);

  return (
    <section className="relative isolate overflow-hidden bg-background" ref={heroRef}>
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-glow)]" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 opacity-30 [background-image:linear-gradient(to_right,var(--border)_1px,transparent_1px),linear-gradient(to_bottom,var(--border)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent_85%)]" />

      <div className="container flex flex-col mx-auto min-h-[calc(100svh-4rem)] items-center justify-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:grid-cols-1 lg:py-24">
        <div className="flex flex-col items-center justify-center mx-auto w-full max-w-5xl text-center lg:mx-0 lg:text-left">
          <Badge className="mb-6 rounded-full border border-primary/20 px-3 py-1 text-secondary-foreground" data-hero-badge variant="secondary">
            <Sparkles aria-hidden="true" className="mr-1 size-3.5" />
            {t("hero.badge")}
          </Badge>
          <h1
            aria-label={t("hero.titleAccessible")}
            className="text-balance text-center text-5xl font-bold tracking-tight sm:text-6xl lg:text-7xl xl:text-8xl"
          >
            <span aria-hidden="true" className="inline-block">
              <span className="inline-block" data-hero-word>
                {t("hero.title")}
              </span>{" "}
              <span
                className="inline-block bg-[image:var(--gradient-brand)] bg-clip-text text-transparent"
                data-hero-word
              >
                {t("hero.titleHighlight")}
              </span>
            </span>
          </h1>
          <p
            className="mx-auto mt-6 max-w-xl text-pretty text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8 lg:mx-0"
            data-hero-copy
          >
            {t("hero.description")}
          </p>
          <div
            className="mt-8 flex flex-col justify-center gap-3 sm:flex-row lg:justify-start"
            data-hero-actions
          >
            <Button
              className="min-h-11 w-full px-6 py-3 transition-transform hover:scale-[1.02] hover:shadow-xl hover:shadow-primary/25 active:scale-[0.98] sm:w-auto"
              nativeButton={false}
              render={<Link to={ROUTES.onboarding.root} />}
              size="lg"
            >
              {t("hero.primaryAction")}
              <ArrowRight aria-hidden="true" />
            </Button>
            <Button
              className="min-h-11 w-full px-6 py-3 transition-transform hover:scale-[1.02] sm:w-auto"
              nativeButton={false}
              render={<Link to={ROUTES.auth.login} />}
              size="lg"
              variant="outline"
            >
              {t("hero.secondaryAction")}
            </Button>
          </div>
          <a
            className="mt-8 inline-flex min-h-11 items-center gap-2 rounded-md text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            data-hero-scroll
            href="#o-que-e-a-kumuka"
          >
            {t("hero.scroll")}
            <ArrowDown aria-hidden="true" className="size-4" />
          </a>
        </div>

        <div className="hover:scale-[1.02] shadow-2xl shadow-primary/25 rounded-2xl overflow-hidden duration-300 rotate-2">
          <img src={Painel} alt="painel administrativo" />
        </div>

        {/*<div
          aria-label={t("hero.journeyAccessible")}
          className=" relative mx-auto w-full max-w-xl rounded-3xl border border-border/80 bg-card/85 p-4 shadow-2xl shadow-primary/10 backdrop-blur sm:p-7"
          role="img"
        >
          <p className="mb-5 text-sm font-semibold text-muted-foreground sm:mb-7">
            {t("hero.journeyTitle")}
          </p>
          <ol className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-2">
            {journey.map(({ key, icon: Icon, highlight }, index) => (
              <li
                className="relative flex flex-col items-center"
                data-hero-journey-step
                key={key}
              >
                <div
                  className={`flex size-14 items-center justify-center rounded-2xl ${
                    highlight
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  <Icon aria-hidden="true" className="size-6" />
                </div>
                <span
                  className={`mt-3 text-center text-xs font-semibold sm:text-sm ${
                    highlight ? "text-primary" : "text-foreground"
                  }`}
                >
                  {t(`hero.journey.${key}`)}
                </span>
                {index < journey.length - 1 && (
                  <ArrowRight
                    aria-hidden="true"
                    className="absolute -right-3 top-5 hidden size-4 text-muted-foreground sm:block"
                  />
                )}
              </li>
            ))}
          </ol>
          <div className="mt-6 rounded-2xl bg-secondary/70 p-4 sm:mt-8 sm:p-5">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                <Target aria-hidden="true" className="size-5" />
              </div>
              <div>
                <p className="font-semibold">{t("hero.cardTitle")}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("hero.cardDescription")}
                </p>
              </div>
            </div>
          </div>
        </div>*/}
      </div>
    </section>
  );
}
