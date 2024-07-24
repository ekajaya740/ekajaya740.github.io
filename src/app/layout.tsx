import TopNavigation from '@/components/navigations/TopNavigation';
import './globals.css';
import { Providers } from './providers';
import { navigationItems } from '@/lib/items/navigationItem';
import { Poppins } from 'next/font/google';
import Footer from '@/components/footer/Footer';

const poppins = Poppins({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-poppins',
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <Providers>
          <div className='h-screen'>
            <TopNavigation items={navigationItems} />
            {children}
            <Footer />
          </div>
        </Providers>
      </body>
    </html>
  );
}
