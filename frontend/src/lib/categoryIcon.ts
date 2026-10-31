import {
  BarChart3,
  BookOpen,
  Briefcase,
  CalendarDays,
  Code2,
  Lightbulb,
  Megaphone,
  MessageCircle,
  Palette,
  Rocket,
  Search,
  Timer,
  Users,
  Wallet,
  type LucideIcon,
} from 'lucide-react';

const ICONS: [keyword: string, icon: LucideIcon][] = [
  ['dado', BarChart3],
  ['excel', BarChart3],
  ['program', Code2],
  ['web', Code2],
  ['tecnolog', Code2],
  ['seo', Search],
  ['marketing', Megaphone],
  ['carreira', Briefcase],
  ['emprego', Briefcase],
  ['estágio', Briefcase],
  ['lideran', Users],
  ['finan', Wallet],
  ['empreend', Rocket],
  ['comunica', MessageCircle],
  ['produtiv', Timer],
  ['tempo', Timer],
  ['design', Palette],
  ['evento', CalendarDays],
  ['workshop', Lightbulb],
];

/** Icon that represents a category, area or type, matched by keyword. */
export function categoryIcon(label: string): LucideIcon {
  const lower = label.toLocaleLowerCase('pt');
  return ICONS.find(([keyword]) => lower.includes(keyword))?.[1] ?? BookOpen;
}

/** Whether a record was published recently enough to be labelled "Novo". */
export function isRecent(isoDate: string | null | undefined, days = 30): boolean {
  if (!isoDate) return false;
  return Date.now() - new Date(isoDate).getTime() < days * 24 * 60 * 60 * 1000;
}
