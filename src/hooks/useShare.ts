import { useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

/** What to do with a link: the system share sheet, the clipboard, or say that neither worked. */
export const shareLink = async (
  data: { title: string; text: string; url: string },
  nav: Pick<Navigator, 'share' | 'clipboard'> = navigator
): Promise<'shared' | 'cancelled' | 'copied' | 'failed'> => {
  if (typeof nav.share === 'function') {
    try {
      await nav.share(data);
      return 'shared';
    } catch (error) {
      // The user closed the sheet: that is a choice, not a failure.
      if ((error as Error)?.name === 'AbortError') return 'cancelled';
    }
  }
  try {
    await nav.clipboard.writeText(data.url);
    return 'copied';
  } catch {
    return 'failed';
  }
};

/** Shares the real address of a shop or product and reports what actually happened. */
export const useShare = () => {
  const { t } = useLanguage();
  const { showToast } = useToast();

  return useCallback(
    async ({ title, path }: { title: string; path: string }) => {
      const url = new URL(path, window.location.origin).href;
      const result = await shareLink({ title, text: t.demo.share.sharedText.replace('{name}', title), url });
      if (result === 'copied') showToast({ type: 'success', title: t.demo.share.copiedTitle, message: url });
      if (result === 'failed') showToast({ type: 'error', title: t.demo.share.failedTitle, message: t.demo.share.failedMsg });
    },
    [showToast, t]
  );
};
