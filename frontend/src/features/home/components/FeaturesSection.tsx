import {
  BookOpen,
  Compass,
  FileText,
  Folder,
  GraduationCap,
  Zap,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
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
  return (
    <section
      aria-labelledby="features-title"
      className="container py-16 sm:py-24"
      id="o-que-encontrar"
    >
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" id="features-title">
          O que vais encontrar
        </h2>
        <p className="mt-4 leading-7 text-muted-foreground">
          Ferramentas para aprender, praticar e mostrar o teu progresso.
        </p>
      </div>
      <div className="mt-10 grid gap-4 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3">
        {features.map(({ title, description, icon: Icon }) => (
          <Card
            className="group h-full transition-shadow hover:shadow-md"
            key={title}
          >
            <CardHeader>
              <div className="mb-3 flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                <Icon aria-hidden="true" className="size-6" />
              </div>
              <CardTitle className="text-lg">{title}</CardTitle>
            </CardHeader>
            <CardContent className="leading-6 text-muted-foreground">
              {description}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
