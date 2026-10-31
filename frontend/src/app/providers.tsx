import { QueryClientProvider } from '@tanstack/react-query';
import { MotionConfig } from 'motion/react';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from '../components/ui/toast';
import type { ReactNode } from 'react';
import { queryClient } from '@/lib/queryClient';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <MotionConfig reducedMotion="user">
          {children}
          <Toaster />
        </MotionConfig>
      </BrowserRouter>
    </QueryClientProvider>
  );
}