import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/lib/constants/routes';

export function FinalCTASection() {
  return (
    <section
      aria-labelledby="final-cta-title"
      className="bg-primary text-primary-foreground"
      id="comecar"
    >
      <div className="container py-16 text-center sm:py-20">
        <h2
          className="mx-auto max-w-3xl text-balance text-3xl font-bold tracking-tight sm:text-4xl"
          id="final-cta-title"
        >
          Estás pronto para construir o teu futuro?
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-pretty leading-7 text-primary-foreground/80">
          Começa agora. Leva menos de 2 minutos a criar o teu perfil.
        </p>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <Button
            className="min-h-11 w-full sm:w-auto"
            nativeButton={false}
            render={<Link to={ROUTES.onboarding.root} />}
            size="lg"
            variant="secondary"
          >
            Começar agora
            <ArrowRight aria-hidden="true" />
          </Button>
          <Button
            className="min-h-11 w-full border-primary-foreground/50 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
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
