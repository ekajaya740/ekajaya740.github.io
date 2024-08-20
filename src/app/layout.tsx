import TopNavigation from '@/components/navigations/TopNavigation';
import './globals.css';
import { Providers } from './providers';
import { navigationItems } from '@/lib/items/navigationItem';
import Footer from '@/components/footer/Footer';
import { poppins } from '@/lib/fonts/poppins';

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
