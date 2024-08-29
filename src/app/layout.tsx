import TopNavigation from '@/components/navigations/TopNavigation';
import './globals.css';
import { poppins } from '@/lib/fonts/poppins';
import Footer from '@/components/footer/Footer';
import { Providers } from './providers';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <Providers>
          <TopNavigation />
          {children}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
