import React, { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Outlet, ScrollRestoration, useLocation, useNavigation } from 'react-router';
import { focusPageHeading } from '../components/collage/focusHeading';
import { Footer } from '../components/layout/Footer';
import { MobileBottomNav } from '../components/layout/MobileBottomNav';
import { Navbar } from '../components/layout/Navbar';
import { AddressModal } from '../components/modals/AddressModal';
import { AuthModal } from '../components/modals/AuthModal';
import { OfflineIndicator } from '../components/pwa/OfflineIndicator';
import { PwaSplash } from '../components/pwa/PwaSplash';
import { AppProvider, useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { usePageTitle } from './usePageTitle';

// The chat and its photo tools load when it is first opened.
const ChatDrawer = lazy(() => import('../components/chat/ChatDrawer').then((m) => ({ default: m.ChatDrawer })));

const Layout: React.FC = () => {
  const { isChatOpen, setIsChatOpen, chatParticipant } = useApp();
  const { t } = useLanguage();
  const { pathname } = useLocation();
  const navigation = useNavigation();
  usePageTitle();

  const [wasChatOpened, setWasChatOpened] = useState(false);
  useEffect(() => {
    if (isChatOpen) setWasChatOpened(true);
  }, [isChatOpen]);

  // A new screen moves focus to its heading, so keyboard and screen-reader users continue from there.
  const previousPath = useRef(pathname);
  useEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    focusPageHeading();
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink text-start selection:bg-accent selection:text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[60] focus:px-4 focus:py-3 focus:bg-card focus:border-2 focus:border-ink focus:rounded-xl focus:font-extrabold"
      >
        {t.collage.common.skipToContent}
      </a>

      {navigation.state === 'loading' && (
        <div role="status" aria-label={t.demo.loading} className="fixed top-0 inset-x-0 z-[70] h-1 bg-action" />
      )}

      <PwaSplash />
      <Navbar />

      <main className="flex-1 w-full" id="main-content">
        <Outlet />
      </main>

      <Footer />
      <MobileBottomNav />

      {wasChatOpened && (
        <Suspense fallback={null}>
          <ChatDrawer
            isOpen={isChatOpen}
            onClose={() => setIsChatOpen(false)}
            initialParticipant={chatParticipant || undefined}
          />
        </Suspense>
      )}
      <AddressModal />
      <AuthModal />
      <OfflineIndicator />
      <ScrollRestoration />
    </div>
  );
};

export const AppShell: React.FC = () => (
  <AppProvider>
    <Layout />
  </AppProvider>
);
