import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function HomePage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold bg-red-500">KUMUKA — em construção</h1>
      <Button
        className="mt-4"
        onClick={() =>
          toast.add({
            title: 'Olá!',
            description: 'O toast está a funcionar.',
            type: 'success',
          })
        }
      >
        Testar toast
      </Button>
    </div>
  );
}