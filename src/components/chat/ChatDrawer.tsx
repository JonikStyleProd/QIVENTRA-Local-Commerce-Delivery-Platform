import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, Send, Image as ImageIcon, ArrowLeft, Check, CheckCheck, Store, Bike } from 'lucide-react';
import { chatService } from '../../services/ChatService';
import { ChatMessage, Conversation } from '../../types';
import { useLanguage } from '../../context/LanguageContext';
import { PhotoUploadModal } from '../media/PhotoUploadModal';
import { IconButton } from '../ui/IconButton';
import { useDialogFocus } from '../collage/useDialogFocus';

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

/** Square avatar: the participant's picture, or their kind as an icon when there is none. */
const ParticipantAvatar: React.FC<{ conversation: Conversation; alt: string; size: string }> = ({
  conversation,
  alt,
  size,
}) => (
  <span className={`relative grid place-items-center shrink-0 bg-tint-pets border-2 border-ink rounded-xl overflow-hidden ${size}`}>
    {conversation.participantAvatar ? (
      <img src={conversation.participantAvatar} alt={alt} className="w-full h-full object-cover" />
    ) : conversation.type === 'courier' ? (
      <Bike aria-hidden="true" className="w-5 h-5" />
    ) : (
      <Store aria-hidden="true" className="w-5 h-5" />
    )}
    {conversation.isOnline && (
      <span aria-hidden="true" className="absolute bottom-0.5 end-0.5 w-2.5 h-2.5 rounded-full bg-success ring-2 ring-card" />
    )}
  </span>
);

export const ChatDrawer: React.FC<ChatDrawerProps> = ({ isOpen, onClose, initialConversationId, initialParticipant }) => {
  const { t, language } = useLanguage();
  const copy = t.screens.chat;

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversation, setActiveConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);

  const panelRef = useRef<HTMLDivElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useDialogFocus(panelRef, isOpen);

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
      const msg = await chatService.sendMessage(activeConversation.id, text, undefined, activeConversation.orderId);
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
      const msg = await chatService.sendMessage(activeConversation.id, '', dataUrl, activeConversation.orderId);
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

  const nameOf = (conv: Conversation) => conv.participantNames?.[language] || conv.participantName;
  const roleOf = (conv: Conversation) => (conv.type === 'courier' ? copy.courier : copy.store);

  return createPortal(
    <>
      <div className="fixed inset-0 z-50 flex">
        <div className="fixed inset-0 bg-[rgba(30,30,30,0.6)]" onClick={onClose} aria-hidden="true" />

        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.chat.title}
          tabIndex={-1}
          className="anim-in relative ms-auto flex flex-col w-full desk:w-[420px] h-[100dvh] paper-dots bg-paper text-ink desk:border-s-[3px] border-ink"
        >
          {/* ---------- Header ---------- */}
          <div
            className="flex items-center gap-2.5 px-3 py-2.5 bg-card border-b-[3px] border-ink shrink-0"
            style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 10px)' }}
          >
            {activeConversation ? (
              <>
                <IconButton
                  onClick={() => setActiveConversation(null)}
                  aria-label={t.chat.backToList}
                  icon={<ArrowLeft aria-hidden="true" className="w-5 h-5 rtl-flip" />}
                />
                <ParticipantAvatar conversation={activeConversation} alt="" size="w-11 h-11" />
                <div className="flex-1 min-w-0">
                  <h2 className="font-black leading-tight truncate">
                    <bdi>{nameOf(activeConversation)}</bdi>
                  </h2>
                  <p className="text-[13px] font-bold text-ink-2 truncate">
                    {roleOf(activeConversation)} ·{' '}
                    {activeConversation.orderId ? (
                      <>
                        {copy.order} <bdi>#{activeConversation.orderId}</bdi>
                      </>
                    ) : (
                      t.chat.online
                    )}
                  </p>
                </div>
              </>
            ) : (
              <div className="flex-1 min-w-0">
                <p className="hand text-2xl leading-none text-action">{copy.note}</p>
                <h2 className="text-xl font-black leading-tight">{t.screens.menu.messages}</h2>
              </div>
            )}
            <IconButton onClick={onClose} aria-label={copy.close} icon={<X aria-hidden="true" className="w-5 h-5" />} />
          </div>

          {/* ---------- Body ---------- */}
          {activeConversation ? (
            <div className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-3">
                {messages.map((msg) => {
                  const isMe = msg.senderRole === 'customer';
                  const text = msg.texts?.[language] || msg.text;
                  return (
                    <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                      <div
                        className={`max-w-[85%] p-3 border-2 border-ink rounded-2xl shadow-hard-2 break-words ${
                          isMe ? 'bg-accent text-ink rounded-ee-sm' : 'bg-card rounded-es-sm'
                        }`}
                      >
                        {msg.imageUrl && (
                          <img
                            src={msg.imageUrl}
                            alt={copy.attachment}
                            className="w-full max-h-56 mb-2 object-cover rounded-lg"
                          />
                        )}
                        {text && <p className="font-bold leading-snug">{text}</p>}
                        <div className="flex items-center justify-end gap-1 mt-1 text-xs font-bold text-ink-2 tabular-nums">
                          <span>{formatTimestamp(msg.timestamp)}</span>
                          {isMe &&
                            (msg.status === 'read' ? (
                              <CheckCheck aria-hidden="true" className="w-3.5 h-3.5" />
                            ) : (
                              <Check aria-hidden="true" className="w-3.5 h-3.5" />
                            ))}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {isTyping && (
                  <p role="status" className="hand inline-block text-2xl leading-none text-link-text">
                    {t.chat.typing}
                  </p>
                )}

                <div ref={messagesEndRef} />
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendMessage();
                }}
                className="flex items-center gap-2 p-3 bg-card border-t-[3px] border-ink shrink-0"
                style={{ paddingBottom: 'calc(env(safe-area-inset-bottom, 0px) + 12px)' }}
              >
                <IconButton
                  onClick={() => setIsPhotoModalOpen(true)}
                  aria-label={t.chat.attachPhoto}
                  title={t.chat.attachPhoto}
                  icon={<ImageIcon aria-hidden="true" className="w-5 h-5" />}
                />
                <input
                  ref={inputRef}
                  type="text"
                  maxLength={1000}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  aria-label={t.chat.typeMessage}
                  placeholder={t.chat.typeMessage}
                  className="flex-1 min-w-0 min-h-11 px-3 bg-card text-ink border-2 border-ink rounded-xl font-bold placeholder:text-ink-3 placeholder:font-semibold"
                />
                <button
                  type="submit"
                  disabled={!inputText.trim()}
                  aria-label={t.chat.send}
                  className="chip-tilt grid place-items-center w-11 h-11 shrink-0 bg-link text-white border-2 border-ink rounded-xl cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send aria-hidden="true" className="w-4 h-4 rtl-flip" />
                </button>
              </form>
            </div>
          ) : conversations.length === 0 ? (
            <p className="p-8 text-center font-bold text-ink-2">{t.chat.emptyConversations}</p>
          ) : (
            <ul className="flex-1 overflow-y-auto overscroll-contain p-3 space-y-2.5">
              {conversations.map((conv) => {
                const lastMessage = conv.lastMessages?.[language] || conv.lastMessage || copy.start;
                return (
                  <li key={conv.id}>
                    <button
                      type="button"
                      onClick={() => setActiveConversation(conv)}
                      className="chip-tilt flex items-center gap-3 w-full p-3 text-start bg-card border-2 border-ink rounded-2xl shadow-hard-3 cursor-pointer"
                    >
                      <ParticipantAvatar conversation={conv} alt="" size="w-12 h-12" />
                      <span className="flex-1 min-w-0">
                        <span className="flex items-center justify-between gap-2">
                          <span className="font-black truncate">
                            <bdi>{nameOf(conv)}</bdi>
                          </span>
                          <span className="text-xs font-bold text-ink-3 shrink-0 tabular-nums">
                            {formatTimestamp(conv.lastMessageTimestamp)}
                          </span>
                        </span>
                        <span className="block text-xs font-bold text-ink-2 truncate">
                          {roleOf(conv)}
                          {conv.orderId && (
                            <>
                              {' · '}
                              {copy.order} <bdi>#{conv.orderId}</bdi>
                            </>
                          )}
                        </span>
                        <span className="flex items-center justify-between gap-2 mt-0.5">
                          <span className="text-sm font-bold text-ink-2 truncate">{lastMessage}</span>
                          {conv.unreadCount > 0 && (
                            <span className="grid place-items-center shrink-0 min-w-[22px] h-[22px] px-1 bg-accent text-ink border-2 border-ink rounded-full text-[11px] font-black tabular-nums">
                              {conv.unreadCount}
                            </span>
                          )}
                        </span>
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>

      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        category="chat"
        title={t.chat.attachPhoto}
        onSuccess={(dataUrl) => {
          handleSendImage(dataUrl);
          setIsPhotoModalOpen(false);
        }}
      />
    </>,
    document.body
  );
};
