import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Grupo Exportador del Campo',
  description: 'Holding agroindustrial | Más de 50 años llevando lo mejor del campo al mundo.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
      </body>
    </html>
  );
}
