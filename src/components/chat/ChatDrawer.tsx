import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Send,
  Image as ImageIcon,
  ArrowLeft,
  Check,
  CheckCheck,
  Store,
  Bike,
  Smile,
  ShieldCheck,
} from 'lucide-react';
import { chatService } from '../../services/ChatService';
import { ChatMessage, Conversation } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { PhotoUploadModal } from '../media/PhotoUploadModal';

export interface ChatDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialConversationId?: string;
  initialParticipant?: {
    type: 'store' | 'courier';
    id: string;
    name: string;
    avatarUrl?: string;
    orderId?: string;
    storeId?: string;
  };
}

export const ChatDrawer: React.FC<ChatDrawerProps> = ({
  isOpen,
  onClose,
  initialConversationId,
  initialParticipant,
}) => {
  const { t, isRTL, language } = useLanguage();

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load conversations
  useEffect(() => {
    if (!isOpen) return;

    const load = async () => {
      if (initialParticipant) {
        const conv = await chatService.getOrCreateConversation(
          initialParticipant.type,
          initialParticipant.id,
          initialParticipant.name,
          initialParticipant.avatarUrl,
          initialParticipant.orderId,
          initialParticipant.storeId
        );
        setActiveConversation(conv);
      }

      const all = await chatService.getConversations();
      setConversations(all);

      if (initialConversationId) {
        const target = all.find((c) => c.id === initialConversationId);
        if (target) setActiveConversation(target);
      }
    };

    load();

    const unsubscribe = chatService.subscribe((newMsg) => {
      // Refresh list
      chatService.getConversations().then(setConversations);

      // If active conversation matches, append message
      setActiveConversation((current) => {
        if (current && current.id === newMsg.conversationId) {
          setMessages((prev) => {
            if (prev.some((m) => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          setIsTyping(false);
        }
        return current;
      });
    });

    return () => unsubscribe();
  }, [isOpen, initialConversationId, initialParticipant]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (activeConversation) {
          setActiveConversation(null);
        } else {
          onClose();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, activeConversation, onClose]);

  // Load messages when active conversation changes
  useEffect(() => {
    if (!activeConversation) return;

    chatService.markAsRead(activeConversation.id);
    chatService.getMessages(activeConversation.id).then(setMessages);

    // Focus input
    setTimeout(() => {
      inputRef.current?.focus();
    }, 150);
  }, [activeConversation]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!isOpen) return null;

  const handleSendMessage = async () => {
    if (!inputText.trim() || !activeConversation) return;

    const text = inputText.trim();
    setInputText('');

    try {
      const msg = await chatService.sendMessage(
        activeConversation.id,
        text,
        undefined,
        activeConversation.orderId
      );
      setMessages((prev) => [...prev, msg]);

      // Show typing indicator after user message
      setIsTyping(true);
      setTimeout(() => {
        setIsTyping(false);
      }, 1900);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSendImage = async (dataUrl: string) => {
    if (!activeConversation) return;
    try {
      const msg = await chatService.sendMessage(
        activeConversation.id,
        '',
        dataUrl,
        activeConversation.orderId
      );
      setMessages((prev) => [...prev, msg]);
    } catch (e) {
      console.error(e);
    }
  };

  const formatTimestamp = (ts?: string) => {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <>
      {/* Backdrop: desktop shows dark overlay, mobile covers screen */}
      <div
        id="chat-drawer-backdrop"
        className={`fixed inset-0 z-50 flex ${isRTL ? 'justify-start' : 'justify-end'} bg-black/45 backdrop-blur-2xs transition-opacity`}
        onClick={onClose}
        role="dialog"
        aria-modal="true"
        aria-label={t.chat?.title || 'Chat'}
      >
        <div
          id="chat-drawer-panel"
          className={`w-full md:w-[400px] lg:w-[420px] h-[100dvh] max-h-screen bg-surface shadow-2xl flex flex-col border-s border-theme select-none transition-transform ${
            isRTL ? 'text-right' : 'text-left'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* HEADER */}
          <div className="h-16 px-4 border-b border-theme flex items-center justify-between bg-surface-elevated shrink-0">
            {activeConversation ? (
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <button
                  type="button"
                  onClick={() => setActiveConversation(null)}
                  className="p-1.5 -ms-1 rounded-xl text-secondary hover:text-primary hover:bg-surface transition shrink-0"
                  aria-label={language === 'he' ? 'חזרה לשיחות' : language === 'ru' ? 'Назад к диалогам' : 'Back to conversations'}
                >
                  <ArrowLeft className={`w-5 h-5 ${isRTL ? 'rotate-180' : ''}`} />
                </button>

                {/* Avatar (not mirrored in RTL) */}
                <div className="relative w-9 h-9 rounded-xl overflow-hidden bg-[#EDE9DE] dark:bg-[#1A2220] border border-theme shrink-0 flex items-center justify-center">
                  {activeConversation.participantAvatar ? (
                    <img
                      src={activeConversation.participantAvatar}
                      alt={activeConversation.participantNames?.[language] || activeConversation.participantName}
                      className="w-full h-full object-cover"
                    />
                  ) : activeConversation.type === 'courier' ? (
                    <Bike className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B]" />
                  ) : (
                    <Store className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B]" />
                  )}
                  {activeConversation.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-[#1E824C] ring-2 ring-white dark:ring-stone-900" />
                  )}
                </div>

                {/* Info */}
                <div className="truncate flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <h4 className="text-xs sm:text-sm font-bold text-primary truncate leading-tight">
                      {activeConversation.participantNames?.[language] || activeConversation.participantName}
                    </h4>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-[#123B35]/10 dark:bg-[#B8D96B]/15 text-[#123B35] dark:text-[#B8D96B] font-semibold shrink-0">
                      {activeConversation.type === 'courier'
                        ? (language === 'he' ? 'שליח' : language === 'ru' ? 'Курьер' : 'Courier')
                        : (language === 'he' ? 'חנות' : language === 'ru' ? 'Магазин' : 'Store')}
                    </span>
                  </div>
                  <span className="text-[10px] text-muted block truncate">
                    {activeConversation.orderId
                      ? `${language === 'he' ? 'הזמנה' : language === 'ru' ? 'Заказ' : 'Order'} #${activeConversation.orderId}`
                      : (language === 'he' ? 'מחובר' : language === 'ru' ? 'В сети' : 'Online')}
                  </span>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B]" />
                <h3 className="text-sm font-bold text-primary">
                  {language === 'he' ? 'הודעות וצ\'אט' : language === 'ru' ? 'Сообщения & Чат' : 'Messages & Chat'}
                </h3>
              </div>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-xl text-muted hover:text-primary hover:bg-surface transition shrink-0 ms-2"
              aria-label={language === 'he' ? 'סגור צ\'אט' : language === 'ru' ? 'Закрыть чат' : 'Close chat'}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* BODY */}
          {activeConversation ? (
            /* ACTIVE CHAT THREAD */
            <div className="flex-1 flex flex-col min-h-0 bg-app overflow-hidden">
              {/* Message List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3 overscroll-contain">
                {messages.map((msg) => {
                  const isMe = msg.senderRole === 'customer';
                  const displayMessageText = msg.texts?.[language] || msg.text;
                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[85%] rounded-2xl p-3 text-xs shadow-2xs leading-relaxed break-words ${
                          isMe
                            ? 'bg-[#123B35] text-[#F3F1EA] rounded-br-xs'
                            : 'bg-surface text-primary border border-theme rounded-bl-xs'
                        }`}
                      >
                        {/* Attached Image if any */}
                        {msg.imageUrl && (
                          <div className="rounded-xl overflow-hidden mb-2 max-h-56 bg-black/10">
                            <img
                              src={msg.imageUrl}
                              alt="Attachment"
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        {displayMessageText && <p>{displayMessageText}</p>}

                        {/* Timestamp and ticks */}
                        <div
                          className={`flex items-center justify-end gap-1 mt-1 text-[9px] font-mono tabular-nums ${
                            isMe ? 'text-[#F3F1EA]/70' : 'text-muted'
                          }`}
                        >
                          <span>{formatTimestamp(msg.timestamp)}</span>
                          {isMe && (
                            <span>
                              {msg.status === 'read' ? (
                                <CheckCheck className="w-3 h-3 text-[#B8D96B]" />
                              ) : (
                                <Check className="w-3 h-3 text-white/60" />
                              )}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {/* Typing Indicator */}
                {isTyping && (
                  <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-surface border border-theme text-muted text-xs max-w-[120px]">
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce delay-100" />
                    <span className="w-1.5 h-1.5 rounded-full bg-current animate-bounce delay-200" />
                    <span className="text-[10px] ms-1">
                      {language === 'he' ? 'מקליד...' : language === 'ru' ? 'Печатает...' : 'Typing...'}
                    </span>
                  </div>
                )}

                <div ref={messagesEndRef} />
              </div>

              {/* Input Bar (stays firmly at the bottom) */}
              <div
                className="p-3 bg-surface border-t border-theme shrink-0"
                style={{
                  paddingBottom: 'max(0.75rem, env(safe-area-inset-bottom, 0px))',
                }}
              >
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className="flex items-center gap-2"
                >
                  <button
                    type="button"
                    onClick={() => setIsPhotoModalOpen(true)}
                    className="p-2 rounded-xl text-secondary hover:text-primary hover:bg-surface-elevated transition shrink-0"
                    aria-label={language === 'he' ? 'צרף תמונה' : language === 'ru' ? 'Прикрепить фото' : 'Attach photo'}
                  >
                    <ImageIcon className="w-5 h-5" />
                  </button>

                  <input
                    ref={inputRef}
                    type="text"
                    maxLength={1000}
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={
                      language === 'he'
                        ? 'כתוב הודעה...'
                        : language === 'ru'
                        ? 'Напишите сообщение...'
                        : 'Type a message...'
                    }
                    className="flex-1 bg-surface-elevated border border-theme rounded-xl px-3 py-2 text-xs sm:text-sm text-primary placeholder:text-muted focus:outline-none focus:ring-1 focus:ring-[#123B35] dark:focus:ring-[#B8D96B]"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim()}
                    className="p-2.5 rounded-xl bg-[#123B35] text-[#F3F1EA] hover:bg-[#0E2E29] disabled:opacity-40 disabled:cursor-not-allowed transition shrink-0 dark:bg-[#B8D96B] dark:text-[#151817] dark:hover:bg-[#A6C958]"
                    aria-label={language === 'he' ? 'שלח הודעה' : language === 'ru' ? 'Отправить' : 'Send message'}
                  >
                    <Send className={`w-4 h-4 ${isRTL ? 'rotate-180' : ''}`} />
                  </button>
                </form>
              </div>
            </div>
          ) : (
            /* CONVERSATIONS LIST */
            <div className="flex-1 overflow-y-auto p-3 space-y-2 bg-app overscroll-contain">
              {conversations.length === 0 ? (
                <div className="p-8 text-center text-muted text-xs">
                  {language === 'he'
                    ? 'אין שיחות פעילות כרגע'
                    : language === 'ru'
                    ? 'Нет активных переписок'
                    : 'No active conversations'}
                </div>
              ) : (
                conversations.map((conv) => {
                  const participantName = conv.participantNames?.[language] || conv.participantName;
                  const roleLabel = conv.type === 'courier'
                    ? (language === 'he' ? 'שליח' : language === 'ru' ? 'Курьер' : 'Courier')
                    : (language === 'he' ? 'חנות' : language === 'ru' ? 'Магазин' : 'Store');
                  const storeOrOrder = conv.orderId
                    ? `${language === 'he' ? 'הזמנה' : language === 'ru' ? 'Заказ' : 'Order'} #${conv.orderId}`
                    : conv.storeId ? conv.storeId : '';
                  const lastMsg = conv.lastMessages?.[language] || conv.lastMessage || (language === 'he' ? 'התחל שיחה...' : language === 'ru' ? 'Начните диалог...' : 'Start a conversation...');

                  return (
                    <div
                      key={conv.id}
                      onClick={() => setActiveConversation(conv)}
                      className="flex items-center gap-3 p-3 rounded-2xl bg-surface border border-theme hover:border-secondary cursor-pointer transition shadow-2xs group select-none"
                    >
                      {/* Avatar (not mirrored in RTL) */}
                      <div className="relative w-11 h-11 rounded-2xl overflow-hidden bg-[#EDE9DE] dark:bg-[#1A2220] border border-theme shrink-0 flex items-center justify-center">
                        {conv.participantAvatar ? (
                          <img
                            src={conv.participantAvatar}
                            alt={participantName}
                            className="w-full h-full object-cover"
                          />
                        ) : conv.type === 'courier' ? (
                          <Bike className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B]" />
                        ) : (
                          <Store className="w-5 h-5 text-[#123B35] dark:text-[#B8D96B]" />
                        )}
                        {conv.isOnline && (
                          <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 rounded-full bg-[#1E824C] ring-2 ring-white dark:ring-stone-900" />
                        )}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        {/* Top: Name, Role badge, and Time */}
                        <div className="flex items-center justify-between gap-1 mb-0.5 min-w-0">
                          <div className="flex items-center gap-1.5 min-w-0 truncate">
                            <h4 className="text-xs font-bold text-primary truncate group-hover:text-[#123B35] dark:group-hover:text-[#B8D96B]">
                              {participantName}
                            </h4>
                            <span className="text-[9px] px-1.5 py-0.2 rounded font-semibold bg-[#123B35]/10 dark:bg-[#B8D96B]/15 text-[#123B35] dark:text-[#B8D96B] shrink-0">
                              {roleLabel}
                            </span>
                          </div>
                          <span className="text-[10px] text-muted shrink-0 tabular-nums">
                            {formatTimestamp(conv.lastMessageTimestamp)}
                          </span>
                        </div>

                        {/* Middle: Store / Order tag */}
                        {storeOrOrder && (
                          <div className="text-[10px] text-muted truncate mb-0.5 font-medium">
                            {storeOrOrder}
                          </div>
                        )}

                        {/* Bottom: Last message and unread badge */}
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-[11px] text-secondary truncate flex-1 min-w-0">
                            {lastMsg}
                          </p>
                          {conv.unreadCount > 0 && (
                            <span className="min-w-[18px] h-4 px-1 rounded-full bg-[#123B35] text-[#F3F1EA] dark:bg-[#B8D96B] dark:text-[#151817] text-[10px] font-black flex items-center justify-center shrink-0 tabular-nums">
                              {conv.unreadCount}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          )}
        </div>
      </div>

      {/* Attach Photo Modal */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        category="chat"
        title={language === 'he' ? 'צרף תמונה' : language === 'ru' ? 'Прикрепить фото' : 'Attach Photo'}
        onSuccess={(dataUrl) => {
          handleSendImage(dataUrl);
          setIsPhotoModalOpen(false);
        }}
      />
    </>
  );
};
