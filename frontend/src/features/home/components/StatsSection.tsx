import { useScrollAnimation, type ScrollAnimation } from '../hooks/useScrollAnimation';
import { Card, CardContent } from '@/components/ui/card';

const catalogStats = [
  { value: 6, label: 'trilhas de aprendizagem' },
  { value: 5, label: 'cursos práticos' },
  { value: 8, label: 'aprendizados curtos' },
  { value: 6, label: 'guias para consulta' },
];

const animateStats: ScrollAnimation = (gsap, scope, options) => {
  scope.querySelectorAll<HTMLElement>('[data-stat-count]').forEach((element) => {
    const value = Number(element.dataset.statCount);
    if (!Number.isFinite(value)) return;

    const counter = { value: 0 };
    gsap.to(counter, {
      value,
      duration: 1.5,
      ease: 'power2.out',
      snap: { value: 1 },
      onUpdate: () => {
        element.textContent = String(Math.round(counter.value));
      },
      scrollTrigger: {
        trigger: element,
        start: options.start,
        once: true,
      },
    });
  });
};

export function StatsSection() {
  const sectionRef = useScrollAnimation(animateStats);

  return (
    <section
      aria-labelledby="catalog-stats-title"
      className="bg-surface-1 py-20 sm:py-28"
      id="catalogo"
      ref={sectionRef}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            className="text-3xl font-bold tracking-tight sm:text-4xl"
            data-reveal
            id="catalog-stats-title"
          >
            Um ponto de partida concreto
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground" data-reveal>
            Explora os conteúdos disponíveis no catálogo de demonstração da
            KUMUKA e escolhe o próximo passo ao teu ritmo.
          </p>
        </div>
        <ul className="mt-10 grid grid-cols-2 gap-4 sm:mt-14 lg:grid-cols-4">
          {catalogStats.map(({ value, label }) => (
            <li data-reveal key={label}>
              <Card className="h-full border-border/70 bg-card/80 text-center transition-[border-color,box-shadow,transform] duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5">
                <CardContent className="p-5 sm:p-6">
                  <span aria-hidden="true">
                    <span className="block text-3xl font-bold tracking-tight text-primary sm:text-4xl">
                      <span data-stat-count={value}>{value}</span>+
                    </span>
                    <span className="mt-2 block text-sm leading-6 text-muted-foreground">
                      {label}
                    </span>
                  </span>
                  <span className="sr-only">
                    {value}+ {label}
                  </span>
                </CardContent>
              </Card>
            </li>
          ))}
        </ul>
        <p className="mt-5 text-center text-xs text-muted-foreground">
          Quantidades do catálogo de demonstração; podem mudar durante a
          validação do produto.
        </p>
      </div>
    </section>
  );
}
