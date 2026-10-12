import {
  BriefcaseBusiness,
  GraduationCap,
  Lightbulb,
  School,
  Search,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const audiences: { label: string; icon: LucideIcon }[] = [
  { label: 'Estudantes', icon: School },
  { label: 'Universitários', icon: GraduationCap },
  { label: 'Recém-formados', icon: BriefcaseBusiness },
  { label: 'À procura de oportunidade', icon: Search },
  { label: 'Empreendedores', icon: Lightbulb },
];

export function AudienceSection() {
  return (
    <section
      aria-labelledby="audience-title"
      className="bg-muted/30 py-16 sm:py-24"
      id="para-quem-e"
    >
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl" id="audience-title">
            Para quem é a KUMUKA
          </h2>
          <p className="mt-4 leading-7 text-muted-foreground">
            Para jovens com vontade de aprender, fazer e avançar.
          </p>
        </div>
        <ul className="mx-auto mt-10 flex max-w-4xl flex-wrap justify-center gap-3 sm:mt-12">
          {audiences.map(({ label, icon: Icon }) => (
            <li key={label}>
              <Badge
                className="gap-2 rounded-full px-4 py-2 text-sm"
                variant="secondary"
              >
                <Icon aria-hidden="true" className="size-4 text-primary" />
                {label}
              </Badge>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
