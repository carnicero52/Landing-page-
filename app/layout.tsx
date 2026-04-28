import type {Metadata} from 'next';
import './globals.css'; // Global styles
import { FirebaseProvider } from '@/components/FirebaseProvider';
import PageLoader from '@/components/PageLoader';

export const metadata: Metadata = {
  title: 'NexusCore Tech',
  description: 'Landing page para el crecimiento de Pymes mediante automatización, sitios web y neuromarketing.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <PageLoader />
        <FirebaseProvider>{children}</FirebaseProvider>
      </body>
    </html>
  );
}
