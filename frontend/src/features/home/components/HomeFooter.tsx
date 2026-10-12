import { Link } from 'react-router-dom';
import { ROUTES } from '@/lib/constants/routes';

const footerLinks = [
  { label: 'Aprender', to: ROUTES.learn.root },
  { label: 'Experiências', to: ROUTES.experiences.root },
  { label: 'Entrar', to: ROUTES.auth.login },
];

export function HomeFooter() {
  return (
    <footer className="border-t bg-background">
      <div className="container flex flex-col gap-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link
            className="rounded-sm text-lg font-bold tracking-tight text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            to={ROUTES.home}
          >
            KUMUKA
          </Link>
          <p className="mt-1 text-sm text-muted-foreground">
            Constrói o teu futuro.
          </p>
        </div>
        <nav aria-label="Links do rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {footerLinks.map(({ label, to }) => (
              <li key={label}>
                <Link
                  className="rounded-sm text-sm text-muted-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                  to={to}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <p className="text-sm text-muted-foreground sm:text-right">
          © {new Date().getFullYear()} KUMUKA. Todos os direitos reservados.
        </p>
      </div>
    </footer>
  );
}
