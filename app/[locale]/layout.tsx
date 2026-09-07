import { antonia, elza } from '@/app/fonts';
import '@/app/globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getTranslations, getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { Topbar } from '@/components/layout/Topbar';
import { CustomCursor } from '@/components/ui/CustomCursor';
import { FloatingButtons } from '@/components/ui/FloatingButtons';
import { ClientSessionProvider } from '@/components/admin/ClientSessionProvider';
import { getContenidoCached } from '@/lib/queries/cache';

export async function generateMetadata({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations({ locale, namespace: 'metadata' });
  return {
    title: t('title'),
    description: t('description'),
  };
}

const locales = ['es', 'en', 'de'];

export default async function LocaleLayout({
  children,
  params: { locale },
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  if (!locales.includes(locale as any)) notFound();

  const messages = await getMessages();

  const footerContenido = await getContenidoCached([
    'footer.quote',
    'footer.direccion.stiva',
    'footer.direccion.loreto',
    'footer.direccion.tijuana',
    'footer.telefono',
    'footer.correo',
    'footer.copyright',
    'footer.privacidad',
    'footer.terminos'
  ], locale);

  return (
    <html lang={locale} className={`${antonia.variable} ${elza.variable}`}>
      <body className="public-site font-body bg-brand-white text-brand-navy antialiased min-h-screen flex flex-col">
        <CustomCursor />
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientSessionProvider>
            <Topbar
              correo={footerContenido['footer.correo']}
              telefono={footerContenido['footer.telefono']}
            />
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <Footer locale={locale} contenido={footerContenido} />
            <FloatingButtons />
          </ClientSessionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
