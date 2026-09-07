/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
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
import { Toast } from './components/ui/Toast';
import { ErrorBoundary } from './components/ui/ErrorBoundary';

// Pages
import { HomePage } from './pages/HomePage';
import { CatalogPage } from './pages/CatalogPage';
import { SearchPage } from './pages/SearchPage';
import { OrdersPage } from './pages/OrdersPage';
import { CartPage } from './pages/CartPage';
import { ProfilePage } from './pages/ProfilePage';
import { StoreDetailPage } from './pages/StoreDetailPage';
import { VendorPortalPage } from './pages/VendorPortalPage';
import { CourierPortalPage } from './pages/CourierPortalPage';
import { AdminPortalPage } from './pages/AdminPortalPage';

const AppContent: React.FC = () => {
  const { currentRoute, isChatOpen, setIsChatOpen, chatParticipant } = useApp();
  const { toasts, removeToast } = useToast();
  const { isRTL } = useLanguage();

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
    <div className={`min-h-screen flex flex-col bg-app text-primary transition-colors duration-200 overflow-x-hidden selection:bg-[#B8D96B] selection:text-[#151817] ${isRTL ? 'text-right' : 'text-left'}`}>
      {/* Desktop & Mobile Header */}
      <Navbar />

      {/* Main Routed Content */}
      <main className="flex-1 w-full pb-24 md:pb-0" id="main-content">
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

      {/* Floating Toast Notification Container */}
      <div
        className="fixed top-20 end-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none"
        aria-live="polite"
      >
        {toasts.map((toast) => (
          <div key={toast.id} className="pointer-events-auto">
            <Toast toast={toast} onClose={() => removeToast(toast.id)} />
          </div>
        ))}
      </div>
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
