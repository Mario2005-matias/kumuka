import { Button } from '@/components/ui/button';
import { ChipMultiSelect } from '../components/ChipMultiSelect';
import { INTEREST_OPTIONS } from '../types';

interface InterestsStepProps {
  value: string[];
  onChange: (interests: string[]) => void;
  onNext: () => void;
}

export function InterestsStep({ value, onChange, onNext }: InterestsStepProps) {
  return (
    <section className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold">O que gostavas de explorar?</h1>
        <p className="text-muted-foreground">
          Escolhe um ou mais temas que te interessam.
        </p>
      </div>
      <ChipMultiSelect
        label="Os teus interesses"
        onChange={onChange}
        options={INTEREST_OPTIONS}
        selected={value}
      />
      <Button
        className="w-full"
        disabled={value.length === 0}
        onClick={onNext}
        type="button"
      >
        Continuar
      </Button>
    </section>
  );
}