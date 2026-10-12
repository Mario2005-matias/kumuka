import { Button } from '@/components/ui/button';
import { SelectableCard } from '../components/SelectableCard';
import { SITUATION_OPTIONS } from '../types';

interface SituationStepProps {
  value: string;
  onChange: (situation: string) => void;
  onNext: () => void;
}

export function SituationStep({ value, onChange, onNext }: SituationStepProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">O que estás a fazer neste momento?</h1>
        <p className="text-muted-foreground">
          Não há respostas certas ou erradas.
        </p>
      </div>
      <div className="grid gap-3">
        {SITUATION_OPTIONS.map((option) => (
          <SelectableCard
            key={option}
            onSelect={() => onChange(option)}
            selected={value === option}
            title={option}
          />
        ))}
      </div>
      <Button className="w-full" disabled={!value} onClick={onNext} type="button">
        Continuar
      </Button>
    </section>
  );
}