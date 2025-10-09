import { FC, ReactNode } from 'react';
import Header from './header';
import Footer from './footer';
import Chatbot from '@/components/ui/chatbot';

interface LayoutProps {
  children: ReactNode;
  hideFooter?: boolean;
}

const Layout: FC<LayoutProps> = ({ children, hideFooter = false }) => {
  return (
    <div className="flex flex-col min-h-screen bg-[#121212] text-white">
      <Header />
      <main className="flex-1 pt-16 sm:pt-24 md:pt-28">
        {children}
      </main>
      {!hideFooter && <Footer />}
      <Chatbot />
    </div>
  );
};

export default Layout;
