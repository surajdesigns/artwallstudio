import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import type { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import StyledComponentsRegistry from '@/lib/registry';
import { GlobalStyle } from '@/styles/theme';
import { AuthProvider } from '@/hooks/useAuth';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500'],
  style: ['normal', 'italic'],
  variable: '--font-dm-sans',
});

export const metadata: Metadata = {
  title: { default: 'ArtWall Studio', template: '%s | ArtWall Studio' },
  description: 'Collection de tableaux et papiers peints de luxe.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${cormorant.variable} ${dmSans.variable}`}>
      <body>
        <StyledComponentsRegistry>
          <AuthProvider>
            <GlobalStyle />
            {children}
            <Toaster position="bottom-right" toastOptions={{ style: { fontFamily: 'var(--font-body)', background: 'var(--off-black)', color: 'var(--off-white)', borderRadius: '4px', fontSize: '14px' } }} />
          </AuthProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}
