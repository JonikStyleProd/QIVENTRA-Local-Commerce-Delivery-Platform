/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/layout/Navbar';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { Footer } from './components/layout/Footer';
import { CartDrawer } from './components/modals/CartDrawer';
import { ChatDrawer } from './components/chat/ChatDrawer';
import { AddressModal } from './components/modals/AddressModal';
import { AuthModal } from './components/modals/AuthModal';
import { OfflineIndicator } from './components/pwa/OfflineIndicator';
import { PwaSplash } from './components/pwa/PwaSplash';
import { ErrorBoundary } from './components/ui/ErrorBoundary';
import { focusPageHeading } from './components/collage/focusHeading';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { SearchPage } from './pages/SearchPage';
import { OrdersPage } from './pages/OrdersPage';
import { CartPage } from './pages/CartPage';
import { DeliveryPage } from './pages/DeliveryPage';
import { ProfilePage } from './pages/ProfilePage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { VendorPortalPage } from './pages/VendorPortalPage';
import { CourierPortalPage } from './pages/CourierPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const AppContent: React.FC = () => {
  const { currentRoute, isChatOpen, setIsChatOpen, chatParticipant } = useApp();
  const { t } = useLanguage();

  // There are no URLs to announce a screen change, so focus moves to the new page's heading.
  const previousRoute = useRef(currentRoute);
  useEffect(() => {
    if (previousRoute.current === currentRoute) return;
    previousRoute.current = currentRoute;
    focusPageHeading();
  }, [currentRoute]);

  const renderRoute = () => {
    switch (currentRoute) {
      case 'home':
        return <HomePage />;
      case 'catalog':
        return <CatalogPage />;
      case 'search':
        return <SearchPage />;
      case 'orders':
        return <OrdersPage />;
      case 'cart':
        return <CartPage />;
      case 'delivery':
        return <DeliveryPage />;
      case 'profile':
        return <ProfilePage />;
      case 'store':
        return <StoreDetailPage />;
      case 'vendor':
        return <VendorPortalPage />;
      case 'courier':
        return <CourierPortalPage />;
      case 'admin':
        return <AdminPortalPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-paper text-ink text-start selection:bg-accent selection:text-ink">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:start-2 focus:z-[60] focus:px-4 focus:py-3 focus:bg-white focus:border-2 focus:border-ink focus:rounded-xl focus:font-extrabold"
      >
        {t.collage.common.skipToContent}
      </a>

      <PwaSplash />

      {/* Desktop & Mobile Header */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-1 w-full" id="main-content">
        {renderRoute()}
      </main>

      {/* Presentation Platform Footer */}
      <Footer />

      {/* Mobile Safe-Area Bottom Navigation */}
      <MobileBottomNav />

      {/* Global Drawers & Modals */}
      <CartDrawer />
      <ChatDrawer
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        initialParticipant={chatParticipant || undefined}
      />
      <AddressModal />
      <AuthModal />
      <OfflineIndicator />
    </div>
  );
};

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <LanguageProvider>
          <ToastProvider>
            <AppProvider>
              <AppContent />
            </AppProvider>
          </ToastProvider>
        </LanguageProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
