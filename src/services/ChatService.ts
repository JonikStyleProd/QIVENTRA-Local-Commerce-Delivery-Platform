import { ChatMessage, Conversation } from '../types';

const DB_NAME = 'qiventra_chat_db';
const DB_VERSION = 1;
const CONVERSATIONS_STORE = 'conversations';
const MESSAGES_STORE = 'messages';

class ChatService {
  private dbPromise: Promise<IDBDatabase> | null = null;
  private listeners: Set<(message: ChatMessage) => void> = new Set();

  private getDB(): Promise<IDBDatabase> {
    if (this.dbPromise) return this.dbPromise;

    this.dbPromise = new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.indexedDB) {
        reject(new Error('IndexedDB not supported'));
        return;
      }

      const req = indexedDB.open(DB_NAME, DB_VERSION);

      req.onupgradeneeded = (e) => {
        const db = (e.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(CONVERSATIONS_STORE)) {
          db.createObjectStore(CONVERSATIONS_STORE, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(MESSAGES_STORE)) {
          const mStore = db.createObjectStore(MESSAGES_STORE, { keyPath: 'id' });
          mStore.createIndex('conversationId', 'conversationId', { unique: false });
          mStore.createIndex('timestamp', 'timestamp', { unique: false });
        }
      };

      req.onsuccess = async () => {
        const db = req.result;
        await this.seedInitialData(db);
        resolve(db);
      };

      req.onerror = () => reject(req.error);
    });

    return this.dbPromise;
  }

  private async seedInitialData(db: IDBDatabase) {
    const tx = db.transaction([CONVERSATIONS_STORE, MESSAGES_STORE], 'readonly');
    const cStore = tx.objectStore(CONVERSATIONS_STORE);
    const countReq = cStore.count();

    const count = await new Promise<number>((resolve) => {
      countReq.onsuccess = () => resolve(countReq.result);
      countReq.onerror = () => resolve(0);
    });

    if (count > 0) return; // already seeded

    // Seed conversations and initial messages
    const now = new Date();
    const tenMinAgo = new Date(now.getTime() - 10 * 60000).toISOString();
    const fiveMinAgo = new Date(now.getTime() - 5 * 60000).toISOString();
    const twoMinAgo = new Date(now.getTime() - 2 * 60000).toISOString();

    const initialConversations: Conversation[] = [
      {
        id: 'conv-store-1',
        type: 'store',
        participantId: 'store-1',
        participantName: 'Carmel Fresh Market',
        participantNames: {
          ru: 'Рынок Кармель',
          en: 'Carmel Fresh Market',
          he: 'שוק הכרמל',
        },
        participantRole: 'store',
        participantAvatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=200&q=80',
        orderId: 'IL-84920',
        storeId: 'store-1',
        lastMessage: 'Shalom! Your order #IL-84920 has been packed and handed to the courier.',
        lastMessages: {
          ru: 'Шалом! Ваш заказ №IL-84920 бережно собран и передан курьеру.',
          en: 'Shalom! Your order #IL-84920 has been packed and handed to the courier.',
          he: 'שלום! הזמנתך מס׳ IL-84920 נארזה בקפידה ונמסרה לשליח.',
        },
        lastMessageTimestamp: fiveMinAgo,
        unreadCount: 1,
        isOnline: true,
      },
      {
        id: 'conv-courier-1',
        type: 'courier',
        participantId: 'courier-1',
        participantName: 'Amitai Levi',
        participantNames: {
          ru: 'Амитай Леви',
          en: 'Amitai Levi',
          he: 'אמיתי לוי',
        },
        participantRole: 'courier',
        participantAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
        orderId: 'IL-84920',
        lastMessage: 'Hello! I picked up your order and am riding towards you on an e-bike. Arriving in 12 min.',
        lastMessages: {
          ru: 'Здравствуйте! Я забрал заказ и уже еду к вам на электровелосипеде. Буду через 12 минут.',
          en: 'Hello! I picked up your order and am riding towards you on an e-bike. Arriving in 12 min.',
          he: 'שלום! אספתי את ההזמנה ואני בדרך אליך על אופניים חשמליים. אגיע בעוד 12 דקות.',
        },
        lastMessageTimestamp: twoMinAgo,
        unreadCount: 1,
        isOnline: true,
      },
    ];

    const initialMessages: ChatMessage[] = [
      {
        id: 'msg-seed-1',
        conversationId: 'conv-store-1',
        senderId: 'store-1',
        senderRole: 'store',
        senderName: 'Carmel Fresh Market',
        senderNames: {
          ru: 'Рынок Кармель',
          en: 'Carmel Fresh Market',
          he: 'שוק הכרמל',
        },
        text: 'Shalom! We received your order #IL-84920. All fresh fruits and labneh have been hand-picked.',
        texts: {
          ru: 'Шалом! Мы получили ваш заказ №IL-84920. Все фрукты и сыр лабне отобраны свежайшие.',
          en: 'Shalom! We received your order #IL-84920. All fresh fruits and labneh have been hand-picked.',
          he: 'שלום! קיבלנו את הזמנתך מס׳ IL-84920. כל הפירות והלבנה הטריים נבחרו בקפידה.',
        },
        status: 'read',
        timestamp: tenMinAgo,
        orderId: 'IL-84920',
      },
      {
        id: 'msg-seed-2',
        conversationId: 'conv-store-1',
        senderId: 'store-1',
        senderRole: 'store',
        senderName: 'Carmel Fresh Market',
        senderNames: {
          ru: 'Рынок Кармель',
          en: 'Carmel Fresh Market',
          he: 'שוק הכרמל',
        },
        text: 'Shalom! Your order #IL-84920 has been packed and handed to the courier.',
        texts: {
          ru: 'Шалом! Ваш заказ №IL-84920 бережно собран и передан курьеру.',
          en: 'Shalom! Your order #IL-84920 has been packed and handed to the courier.',
          he: 'שלום! הזמנתך מס׳ IL-84920 נארזה בקפידה ונמסרה לשליח.',
        },
        status: 'delivered',
        timestamp: fiveMinAgo,
        orderId: 'IL-84920',
      },
      {
        id: 'msg-seed-3',
        conversationId: 'conv-courier-1',
        senderId: 'courier-1',
        senderRole: 'courier',
        senderName: 'Amitai Levi',
        senderNames: {
          ru: 'Амитай Леви',
          en: 'Amitai Levi',
          he: 'אמיתי לוי',
        },
        text: 'Hello! I picked up your order and am riding towards you on an e-bike. Arriving in 12 min.',
        texts: {
          ru: 'Здравствуйте! Я забрал заказ и уже еду к вам на электровелосипеде. Буду через 12 минут.',
          en: 'Hello! I picked up your order and am riding towards you on an e-bike. Arriving in 12 min.',
          he: 'שלום! אספתי את ההזמנה ואני בדרך אליך על אופניים חשמליים. אגיע בעוד 12 דקות.',
        },
        status: 'delivered',
        timestamp: twoMinAgo,
        orderId: 'IL-84920',
      },
    ];

    const writeTx = db.transaction([CONVERSATIONS_STORE, MESSAGES_STORE], 'readwrite');
    const cWrite = writeTx.objectStore(CONVERSATIONS_STORE);
    const mWrite = writeTx.objectStore(MESSAGES_STORE);

    for (const c of initialConversations) cWrite.put(c);
    for (const m of initialMessages) mWrite.put(m);
  }

  async getConversations(): Promise<Conversation[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(CONVERSATIONS_STORE, 'readonly');
      const store = tx.objectStore(CONVERSATIONS_STORE);
      const req = store.getAll();
      req.onsuccess = () => {
        const res: Conversation[] = req.result || [];
        // Sort descending by last message timestamp
        res.sort(
          (a, b) =>
            new Date(b.lastMessageTimestamp || 0).getTime() -
            new Date(a.lastMessageTimestamp || 0).getTime()
        );
        resolve(res);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async getOrCreateConversation(
    type: 'store' | 'courier',
    participantId: string,
    name: string,
    avatarUrl?: string,
    orderId?: string,
    storeId?: string
  ): Promise<Conversation> {
    const convs = await this.getConversations();
    const existing = convs.find(
      (c) =>
        c.type === type &&
        c.participantId === participantId &&
        (!orderId || c.orderId === orderId)
    );

    if (existing) return existing;

    const newConv: Conversation = {
      id: `conv-${type}-${Date.now()}`,
      type,
      participantId,
      participantName: name,
      participantRole: type,
      participantAvatar: avatarUrl,
      orderId,
      storeId,
      unreadCount: 0,
      isOnline: true,
      lastMessageTimestamp: new Date().toISOString(),
    };

    const db = await this.getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction(CONVERSATIONS_STORE, 'readwrite');
      const store = tx.objectStore(CONVERSATIONS_STORE);
      const req = store.put(newConv);
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });

    return newConv;
  }

  async getMessages(conversationId: string): Promise<ChatMessage[]> {
    const db = await this.getDB();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(MESSAGES_STORE, 'readonly');
      const store = tx.objectStore(MESSAGES_STORE);
      const index = store.index('conversationId');
      const req = index.getAll(conversationId);
      req.onsuccess = () => {
        const msgs: ChatMessage[] = req.result || [];
        msgs.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
        resolve(msgs);
      };
      req.onerror = () => reject(req.error);
    });
  }

  async sendMessage(
    conversationId: string,
    text: string,
    imageUrl?: string,
    orderId?: string
  ): Promise<ChatMessage> {
    const safeText = text.trim();
    if (!safeText && !imageUrl) {
      throw new Error('Message cannot be empty');
    }

    const message: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      conversationId,
      senderId: 'user-me',
      senderRole: 'customer',
      senderName: 'You',
      senderNames: {
        ru: 'Вы',
        en: 'You',
        he: 'את/ה',
      },
      text: safeText,
      imageUrl,
      status: 'delivered',
      timestamp: new Date().toISOString(),
      orderId,
    };

    const db = await this.getDB();
    await new Promise<void>((resolve, reject) => {
      const tx = db.transaction([MESSAGES_STORE, CONVERSATIONS_STORE], 'readwrite');
      const mStore = tx.objectStore(MESSAGES_STORE);
      const cStore = tx.objectStore(CONVERSATIONS_STORE);

      mStore.put(message);

      const cReq = cStore.get(conversationId);
      cReq.onsuccess = () => {
        const conv: Conversation = cReq.result;
        if (conv) {
          conv.lastMessage = safeText || (imageUrl ? '📷 [Photo]' : '');
          conv.lastMessages = {
            ru: safeText || (imageUrl ? '📷 [Изображение]' : ''),
            en: safeText || (imageUrl ? '📷 [Photo]' : ''),
            he: safeText || (imageUrl ? '📷 [תמונה]' : ''),
          };
          conv.lastMessageTimestamp = message.timestamp;
          cStore.put(conv);
        }
      };

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });

    this.notifyListeners(message);

    // Simulated responsive reply after 1.8 seconds from store/courier
    this.scheduleSimulatedReply(conversationId);

    return message;
  }

  private scheduleSimulatedReply(conversationId: string) {
    setTimeout(async () => {
      try {
        const db = await this.getDB();
        const convReq = await new Promise<Conversation | null>((resolve) => {
          const tx = db.transaction(CONVERSATIONS_STORE, 'readonly');
          const store = tx.objectStore(CONVERSATIONS_STORE);
          const req = store.get(conversationId);
          req.onsuccess = () => resolve(req.result || null);
          req.onerror = () => resolve(null);
        });

        if (!convReq) return;

        const isCourier = convReq.type === 'courier';
        const replyTexts = isCourier
          ? {
              ru: 'Принял, спасибо за уточнение! Буду у домофона через несколько минут.',
              en: 'Got it, thanks for confirming! I will be at the intercom in a few minutes.',
              he: 'הבנתי, תודה על העדכון! אהיה ליד האינטרקום בעוד מספר דקות.',
            }
          : {
              ru: 'Спасибо за сообщение! Если возникнут пожелания по заказу, мы сразу учтем при упаковке.',
              en: 'Thank you for your message! Any special requests will be taken care of during packaging.',
              he: 'תודה על ההודעה! אם ישנן בקשות מיוחדות להזמנה, נתחשב בהן בעת האריזה.',
            };

        const replyMsg: ChatMessage = {
          id: `msg-reply-${Date.now()}`,
          conversationId,
          senderId: convReq.participantId,
          senderRole: convReq.participantRole,
          senderName: convReq.participantName,
          senderNames: convReq.participantNames,
          senderAvatar: convReq.participantAvatar,
          text: replyTexts.en,
          texts: replyTexts,
          status: 'delivered',
          timestamp: new Date().toISOString(),
          orderId: convReq.orderId,
        };

        const tx = db.transaction([MESSAGES_STORE, CONVERSATIONS_STORE], 'readwrite');
        const mStore = tx.objectStore(MESSAGES_STORE);
        const cStore = tx.objectStore(CONVERSATIONS_STORE);

        mStore.put(replyMsg);
        convReq.lastMessage = replyTexts.en;
        convReq.lastMessages = replyTexts;
        convReq.lastMessageTimestamp = replyMsg.timestamp;
        convReq.unreadCount = (convReq.unreadCount || 0) + 1;
        cStore.put(convReq);

        this.notifyListeners(replyMsg);
      } catch (e) {
        console.error('Error simulating reply:', e);
      }
    }, 1800);
  }

  async markAsRead(conversationId: string): Promise<void> {
    try {
      const db = await this.getDB();
      const tx = db.transaction([CONVERSATIONS_STORE, MESSAGES_STORE], 'readwrite');
      const cStore = tx.objectStore(CONVERSATIONS_STORE);
      const req = cStore.get(conversationId);

      req.onsuccess = () => {
        const conv: Conversation = req.result;
        if (conv && conv.unreadCount > 0) {
          conv.unreadCount = 0;
          cStore.put(conv);
        }
      };
    } catch {
      // ignore
    }
  }

  async getUnreadCount(): Promise<number> {
    try {
      const convs = await this.getConversations();
      return convs.reduce((acc, c) => acc + (c.unreadCount || 0), 0);
    } catch {
      return 0;
    }
  }

  subscribe(listener: (message: ChatMessage) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners(message: ChatMessage) {
    for (const listener of this.listeners) {
      listener(message);
    }
  }
}

export const chatService = new ChatService();
