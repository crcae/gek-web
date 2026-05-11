import {getRequestConfig} from 'next-intl/server';
import {notFound} from 'next/navigation';

const locales = ['es', 'en', 'de'];

export default getRequestConfig(async ({locale}) => {
  const currentLocale = locale || 'es';
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(currentLocale as any)) notFound();

  return {
    locale: currentLocale,
    messages: (await import(`../messages/${currentLocale}.json`)).default
  };
});
