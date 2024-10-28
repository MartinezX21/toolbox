import { ReactNode } from 'react';

export default function PageWrapper({ children }: { children: ReactNode }) {
  return (
    <main className="flex-grow pt-2 px-4 space-y-2 pb-4">
      {children}
    </main>
  );
}