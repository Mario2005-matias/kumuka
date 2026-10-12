import { Button } from '@/components/ui/button';
import { SelectableCard } from '../components/SelectableCard';
import { GOAL_OPTIONS } from '../types';

interface GoalStepProps {
  value: string;
  onChange: (goal: string) => void;
  onNext: () => void;
}

export function GoalStep({ value, onChange, onNext }: GoalStepProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">Qual é o teu principal objetivo?</h1>
        <p className="text-muted-foreground">
          A tua resposta ajuda-nos a dar prioridade ao que é importante para ti.
        </p>
      </div>
      <div className="grid gap-3">
        {GOAL_OPTIONS.map((option) => (
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