import React, { useState } from 'react';
import { Download, Smartphone, Share, PlusSquare } from 'lucide-react';
import { usePWAInstall } from '../../hooks/usePWAInstall';
import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

export const PWAInstallButton: React.FC = () => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();
  const { t } = useLanguage();
  const copy = t.screens.pwa;
  const [showIOSGuide, setShowIOSGuide] = useState(false);

  // Suppress when already installed as standalone
  if (isInstalled) {
    return null;
  }

  // Chromium / Android / Desktop flow
  if (isInstallable) {
    return (
      <Button
        variant="accent"
        size="sm"
        onClick={install}
        aria-label={copy.installLabel}
        leftIcon={<Download aria-hidden="true" className="w-4 h-4" />}
        className="shrink-0"
      >
        {copy.install}
      </Button>
    );
  }

  // iOS Safari flow
  if (isIOS) {
    return (
      <>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowIOSGuide(true)}
          aria-label={copy.iosLabel}
          leftIcon={<Smartphone aria-hidden="true" className="w-4 h-4" />}
          className="shrink-0"
        >
          {copy.ios}
        </Button>

        <Modal isOpen={showIOSGuide} onClose={() => setShowIOSGuide(false)} title={copy.iosTitle} maxWidth="sm">
          <ol className="space-y-2.5 font-bold">
            <li className="flex items-start gap-2.5 p-3 bg-tint-health border-2 border-ink rounded-xl">
              <Share aria-hidden="true" className="w-5 h-5 shrink-0" />
              <span>{copy.iosStep1}</span>
            </li>
            <li className="flex items-start gap-2.5 p-3 bg-tint-gift border-2 border-ink rounded-xl">
              <PlusSquare aria-hidden="true" className="w-5 h-5 shrink-0" />
              <span>{copy.iosStep2}</span>
            </li>
          </ol>
          <Button fullWidth variant="secondary" onClick={() => setShowIOSGuide(false)} className="mt-4">
            {copy.gotIt}
          </Button>
        </Modal>
      </>
    );
  }

  return null;
};
