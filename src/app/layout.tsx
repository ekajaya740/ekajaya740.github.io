import TopNavigation from '@/components/navigations/TopNavigation';
import './globals.css';
import { poppins } from '@/lib/fonts/poppins';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className={poppins.className}>
        <TopNavigation items={[]} />
        {children}
      </body>
    </html>
  );
}
