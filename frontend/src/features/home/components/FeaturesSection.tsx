import {
  BookOpen,
  Compass,
  FileText,
  Folder,
  GraduationCap,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { revealSection } from '../lib/animations/sectionAnimations';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const features: {
  title: string;
  description: string;
  icon: LucideIcon;
}[] = [
  {
    title: 'Trilhas',
    description: 'Jornadas completas de aprendizagem.',
    icon: BookOpen,
  },
  {
    title: 'Cursos',
    description: 'Aprendizagem estruturada e ao teu ritmo.',
    icon: GraduationCap,
  },
  {
    title: 'Aprendizados',
    description: 'Conteúdos curtos e práticos.',
    icon: Zap,
  },
  {
    title: 'Guias',
    description: 'Materiais práticos para consulta.',
    icon: FileText,
  },
  {
    title: 'Experiências',
    description: 'Programas, workshops e eventos.',
    icon: Compass,
  },
  {
    title: 'Portefólio',
    description: 'Mostra o que sabes fazer.',
    icon: Folder,
  },
];

export function FeaturesSection() {
  const sectionRef = useScrollAnimation(revealSection);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <section
      aria-labelledby="features-title"
      className="container mx-auto px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
      id="o-que-encontrar"
      ref={sectionRef}
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2
          className="text-3xl font-bold tracking-tight sm:text-4xl"
          data-reveal
          id="features-title"
        >
          O que vais encontrar
        </h2>
        <p className="mt-4 leading-7 text-muted-foreground" data-reveal>
          Ferramentas para aprender, praticar e mostrar o teu progresso.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <motion.div
            className="h-full"
            key={title}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            whileHover={prefersReducedMotion ? undefined : { scale: 1.02 }}
          >
            <Card
              className="group h-full border border-border/70 bg-card/80 transition-[border-color,box-shadow] duration-300 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/5"
              data-reveal
            >
              <CardHeader>
                <motion.div
                  className="mb-3 flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground"
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  whileHover={prefersReducedMotion ? undefined : { rotate: 5 }}
                >
                  <Icon aria-hidden="true" className="size-7" />
                </motion.div>
                <CardTitle className="text-lg">{title}</CardTitle>
              </CardHeader>
              <CardContent className="leading-6 text-muted-foreground">
                {description}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
