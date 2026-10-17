import { ArrowRight } from "lucide-react";
import { revealSection } from "../lib/animations/sectionAnimations";
import { useScrollAnimation } from "../hooks/useScrollAnimation";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ROUTES } from "@/lib/constants/routes";

export function FinalCTASection() {
  const sectionRef = useScrollAnimation(revealSection);

  return (
    <section
      aria-labelledby="final-cta-title"
      className="relative isolate overflow-hidden bg-[image:var(--gradient-brand)] text-primary-foreground "
      id="comecar"
      ref={sectionRef}
    >
      <div
        aria-hidden="true"
        className="container pointer-events-none absolute inset-0 -z-10 bg-[image:var(--gradient-glow)] opacity-40"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 -top-28 -z-10 size-80 rounded-full border border-primary-foreground/10 sm:size-96"
      />
      <div className="container mx-auto px-4 py-20 text-center sm:px-6 sm:py-24 lg:px-8">
        <h2
          className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          data-reveal
          id="final-cta-title"
        >
          Estás pronto para construir o teu futuro?
        </h2>
        <p
          className="mx-auto mt-4 max-w-xl text-pretty leading-7 text-primary-foreground/85"
          data-reveal
        >
          Cria o teu perfil e escolhe por onde queres começar.
        </p>
        <div
          className="mt-8 flex flex-col justify-center gap-3 sm:flex-row"
          data-reveal
        >
          <Button
            className="min-h-11 w-full px-6 py-3 transition-transform hover:scale-[1.02] active:scale-[0.98] sm:w-auto"
            nativeButton={false}
            render={<Link to={ROUTES.onboarding.root} />}
            size="lg"
            variant="secondary"
          >
            Começar agora
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button
            className="min-h-11 w-full border-primary-foreground/50 bg-transparent px-6 py-3 text-primary-foreground transition-transform hover:scale-[1.02] hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
            nativeButton={false}
            render={<Link to={ROUTES.auth.login} />}
            size="lg"
            variant="outline"
          >
            Já tenho conta
          </Button>
        </div>
      </div>
    </section>
  );
}
