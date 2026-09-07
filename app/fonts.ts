import localFont from 'next/font/local';

export const antonia = localFont({
  src: [
    {
      path: '../public/fonts/antonia/AntoniaH1-Light.woff2',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/antonia/AntoniaH1-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/antonia/AntoniaH1-RegularItalic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/fonts/antonia/AntoniaH1-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/antonia/AntoniaH1-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/antonia/AntoniaH1-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/antonia/AntoniaH1-BoldItalic.woff2',
      weight: '700',
      style: 'italic',
    },
    {
      path: '../public/fonts/antonia/AntoniaH1-Heavy.woff2',
      weight: '800',
      style: 'normal',
    },
    {
      path: '../public/fonts/antonia/AntoniaH1-Black.woff2',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-antonia',
  display: 'swap',
});

export const elza = localFont({
  src: [
    {
      path: '../public/fonts/elza/ElzaTextTrial-Light.otf',
      weight: '300',
      style: 'normal',
    },
    {
      path: '../public/fonts/elza/ElzaTextTrial-Regular.otf',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/elza/ElzaTextTrial-Medium.otf',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/elza/ElzaTextTrial-Semibold.otf',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/elza/ElzaTextTrial-Bold.otf',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/fonts/elza/ElzaTrial-Black.otf',
      weight: '900',
      style: 'normal',
    },
  ],
  variable: '--font-elza',
  display: 'swap',
});
