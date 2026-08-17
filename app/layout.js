import 'react-loading-skeleton/dist/skeleton.css';
import AppProvider from './_provider/AppProvider';
import MobileBottomMenu from './_components/MobileBottomMenu';
import './globals.css';

export const metadata = {
  title: 'TechMart - Your Electronics Store',
  description: 'Shop the latest electronics and gadgets at TechMart',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AppProvider>
          <main>{children}</main>
          <MobileBottomMenu />
        </AppProvider>
      </body>
    </html>
  );
}
