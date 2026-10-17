import { Check, Languages } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const languages = [
  { code: 'pt', label: 'Português', flag: '🇦🇴' },
  { code: 'en', label: 'English', flag: '🇬🇧' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
] as const;

export function LanguageSwitcher() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.resolvedLanguage ?? 'pt';

  async function changeLanguage(language: string) {
    try {
      await i18n.loadLanguages(language);
      await i18n.changeLanguage(language);
    } catch (error: unknown) {
      console.error(`Não foi possível mudar o idioma para "${language}".`, error);
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            aria-label={t('language.change')}
            className="gap-2 px-2 sm:px-3"
            size="sm"
            variant="outline"
          />
        }
      >
        <Languages aria-hidden="true" className="size-4 shrink-0" />
        <span className="hidden sm:inline">
          {languages.find((language) => language.code === currentLanguage)?.flag}
        </span>
        <span className="sr-only">{t('language.label')}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel>{t('language.label')}</DropdownMenuLabel>
          {languages.map((language) => (
            <DropdownMenuItem
              aria-checked={currentLanguage === language.code}
              key={language.code}
              onClick={() => void changeLanguage(language.code)}
              role="menuitemradio"
            >
              <span aria-hidden="true">{language.flag}</span>
              {language.label}
              {currentLanguage === language.code && (
                <Check aria-hidden="true" className="ml-auto size-4" />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
