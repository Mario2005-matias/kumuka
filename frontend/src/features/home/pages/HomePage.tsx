import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';

export default function HomePage() {
  return (
    <div className="container py-16">
      <h1 className="text-4xl font-bold bg-green-600">KUMUKA — em construção</h1>
      Lorem, ipsum dolor sit amet consectetur adipisicing elit. Reiciendis aliquam velit suscipit. Harum temporibus quaerat veritatis commodi, ipsum placeat dicta! Atque libero ducimus nisi reprehenderit veniam odio ipsum at iure?
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