/**
 * Copy for the screens redrawn in the Collage style, exposed as `t.screens`.
 * Handwritten notes stay short; anything important is set in the main font.
 *
 * The Hebrew text was not written by a native speaker and needs proofreading.
 */

export interface ScreenStrings {
  common: {
    close: string;
    back: string;
    /** Sticker on portal figures: they are examples, not real numbers. */
    demoFigures: string;
    loading: string;
  };
  madeBy: {
    created: string;
    /** {year} is the current year. The company name is isolated for RTL by the component. */
    rights: string;
  };
  menu: {
    label: string;
    portals: string;
    messages: string;
  };
  footer: {
    contactsTitle: string;
    contactsDemo: string;
  };
  store: {
    note: string;
    inBasket: string;
    toBasket: string;
    distance: string;
  };
  product: {
    details: string;
    origin: string;
    unit: string;
    quantity: string;
    openStore: string;
  };
  cart: {
    note: string;
    removeItem: string;
    promoLabel: string;
    toWindow: string;
  };
  search: {
    note: string;
    start: string;
    nothing: string;
    clearFilters: string;
  };
  orders: {
    note: string;
    route: string;
    courier: string;
    callDemoTitle: string;
    callDemoMsg: string;
    demoStep: string;
    repeatNoneTitle: string;
    repeatMissing: string;
  };
  profile: {
    note: string;
    demoProfile: string;
    demoProfileDesc: string;
    messagesDesc: string;
    workspaces: string;
    moreNote: string;
  };
  address: {
    selected: string;
  };
  auth: {
    phonePlaceholder: string;
    emailPlaceholder: string;
  };
  chat: {
    store: string;
    courier: string;
    order: string;
    start: string;
    attachment: string;
    close: string;
    note: string;
  };
  portal: {
    role: string;
    roleChangedTitle: string;
    /** {role} is the new role. */
    roleChangedMsg: string;
    roles: Record<'admin' | 'customer' | 'vendor' | 'courier', string>;
    queue: string;
    applications: string;
    pickupCode: string;
    doorCode: string;
  };
  brand: {
    unknownType: string;
    badFormatTitle: string;
    /** {type} is the file's MIME type. */
    badFormat: string;
    tooBigTitle: string;
    /** {size} is the file size in MB. */
    tooBig: string;
    fileReadyTitle: string;
    /** {w} and {h} are the image size in pixels. */
    fileReadyMsg: string;
    readErrorTitle: string;
    readError: string;
    uploadErrorTitle: string;
    uploadError: string;
    uploadedTitle: string;
    /** {version} is the new version number. */
    uploadedMsg: string;
    uploadExceptionTitle: string;
    unknownError: string;
    rollbackErrorTitle: string;
    rollbackError: string;
    rolledBackTitle: string;
    /** {version} is the restored version number. */
    rolledBackMsg: string;
    copiedTitle: string;
    copiedMsg: string;
    adminOnlyBody: string;
    currentRole: string;
    refresh: string;
    bucketNote: string;
    connected: string;
    fallback: string;
    active: string;
    previewLight: string;
    previewDark: string;
    previewMark: string;
    copy: string;
    copied: string;
    canonicalPath: string;
    version: string;
    formats: string;
    stagingHint: string;
    fileSize: string;
    newSha: string;
    publishing: string;
    commit: string;
    historyHint: string;
    historyEmpty: string;
    archive: string;
    replacing: string;
    newSize: string;
    newVersion: string;
    confirmPublish: string;
    /** {version} is the version to restore. */
    rollbackTitle: string;
    /** {variant} is the asset's variant. */
    rollbackAsset: string;
    /** {version} is the version to restore. */
    rollbackConfirm: string;
    rollbackBtn: string;
    previewAlt: string;
  };
  pwa: {
    installLabel: string;
    install: string;
    iosLabel: string;
    ios: string;
    iosTitle: string;
    iosStep1: string;
    iosStep2: string;
    gotIt: string;
  };
  offline: {
    message: string;
  };
  error: {
    title: string;
    message: string;
    retry: string;
  };
}

export const screenTranslations: Record<'ru' | 'en' | 'he', ScreenStrings> = {
  ru: {
    common: {
      close: 'Закрыть',
      back: 'Назад',
      demoFigures: 'демо-цифры',
      loading: 'Загрузка…',
    },
    madeBy: {
      created: 'Создано',
      rights: '© {year} JonikStyle Production. Все права защищены.',
    },
    menu: {
      label: 'Меню профиля',
      portals: 'кабинеты',
      messages: 'Сообщения',
    },
    footer: {
      contactsTitle: 'контакты',
      contactsDemo: 'Демо-проект: контакты не подключены',
    },
    store: {
      note: 'лавка рядом',
      inBasket: 'в корзине',
      toBasket: 'К корзине',
      distance: 'Расстояние',
    },
    product: {
      details: 'Подробнее',
      origin: 'Откуда',
      unit: 'Упаковка',
      quantity: 'Количество',
      openStore: 'Открыть лавку',
    },
    cart: {
      note: 'что берём',
      removeItem: 'Убрать',
      promoLabel: 'Промокод',
      toWindow: 'К окну доставки',
    },
    search: {
      note: 'найдём',
      start: 'что ищем?',
      nothing: 'пусто!',
      clearFilters: 'Сбросить фильтры',
    },
    orders: {
      note: 'где заказ?',
      route: 'маршрут',
      courier: 'курьер',
      callDemoTitle: 'Звонок не подключён',
      callDemoMsg: 'В демо-проекте нет настоящих номеров. Напишите курьеру в чат.',
      demoStep: 'Демо: статус меняется кнопкой',
      repeatNoneTitle: 'Эти товары сейчас недоступны',
      repeatMissing: 'Нет в наличии',
    },
    profile: {
      note: 'это вы',
      demoProfile: 'Демо-профиль',
      demoProfileDesc: 'Контакты не подключены: это пример аккаунта.',
      messagesDesc: 'Диалоги с лавками и курьерами',
      workspaces: 'Рабочие кабинеты',
      moreNote: 'ещё',
    },
    address: {
      selected: 'Выбран',
    },
    auth: {
      phonePlaceholder: '+972 00 000 0000',
      emailPlaceholder: 'name@example.com',
    },
    chat: {
      store: 'Лавка',
      courier: 'Курьер',
      order: 'Заказ',
      start: 'Начните диалог…',
      attachment: 'Вложенное фото',
      close: 'Закрыть чат',
      note: 'пишите',
    },
    portal: {
      role: 'Роль',
      roleChangedTitle: 'Роль изменена',
      roleChangedMsg: 'Текущая роль: {role}',
      roles: { admin: 'Админ', customer: 'Клиент', vendor: 'Продавец', courier: 'Курьер' },
      queue: 'очередь',
      applications: 'заявки',
      pickupCode: 'Код выдачи',
      doorCode: 'домофон',
    },
    brand: {
      unknownType: 'неизвестно',
      badFormatTitle: 'Ошибка формата файла',
      badFormat: 'Недопустимый формат ({type}). Разрешены только PNG, WebP и проверенные SVG.',
      tooBigTitle: 'Файл слишком большой',
      tooBig: 'Размер файла превышает лимит 10 МБ ({size} МБ).',
      fileReadyTitle: 'Файл проверен и готов к предпросмотру',
      fileReadyMsg: 'Разрешение: {w} × {h} px. SHA-256 рассчитан.',
      readErrorTitle: 'Ошибка обработки',
      readError: 'Не удалось прочитать изображение или рассчитать контрольную сумму.',
      uploadErrorTitle: 'Ошибка загрузки',
      uploadError: 'Не удалось обновить официальный бренд-ассет.',
      uploadedTitle: 'Бренд-ассет обновлён',
      uploadedMsg: 'Новая версия v{version} зафиксирована в Supabase Storage.',
      uploadExceptionTitle: 'Сбой при обновлении',
      unknownError: 'Неизвестная ошибка',
      rollbackErrorTitle: 'Ошибка отката версии',
      rollbackError: 'Не удалось откатить версию.',
      rolledBackTitle: 'Версия восстановлена',
      rolledBackMsg: 'Бренд-ассет возвращён к версии v{version}.',
      copiedTitle: 'Скопировано',
      copiedMsg: 'Контрольная сумма SHA-256 скопирована.',
      adminOnlyBody:
        'Логотипы QIVENTRA в Supabase Storage меняет только администратор платформы. Покупатели, продавцы и курьеры таких прав не имеют.',
      currentRole: 'Текущая роль',
      refresh: 'Обновить статус',
      bucketNote: 'Чтение публичное, запись только для администратора (RLS)',
      connected: 'Supabase подключён',
      fallback: 'Локальный запасной режим',
      active: 'Активна',
      previewLight: 'Светлая тема и шапка',
      previewDark: 'Тёмная тема',
      previewMark: 'Знак: телефон и иконка',
      copy: 'Копировать',
      copied: 'Скопировано',
      canonicalPath: 'Путь',
      version: 'Версия',
      formats: 'PNG, WebP, SVG, до 10 МБ',
      stagingHint: 'До сохранения файл будет проверен и измерен, контрольная сумма будет рассчитана.',
      fileSize: 'Размер файла',
      newSha: 'Новый SHA-256',
      publishing: 'Публикация…',
      commit: 'Зафиксировать замену',
      historyHint: 'Предыдущие версии хранятся для безопасного отката',
      historyEmpty: 'Предыдущих версий пока нет. Текущая версия базовая.',
      archive: 'Архив',
      replacing: 'Заменяемый файл',
      newSize: 'Новый размер',
      newVersion: 'Новая версия',
      confirmPublish: 'Подтвердить и опубликовать',
      rollbackTitle: 'Восстановление версии v{version}',
      rollbackAsset: 'Официальный ассет: {variant}',
      rollbackConfirm: 'Переключить активный логотип на версию v{version}? Текущий файл перейдёт в архив.',
      rollbackBtn: 'Восстановить версию',
      previewAlt: 'Предпросмотр нового логотипа',
    },
    pwa: {
      installLabel: 'Установить приложение QIVENTRA',
      install: 'Установить',
      iosLabel: 'Установить на iPhone',
      ios: 'Установить на iOS',
      iosTitle: 'Установка на iPhone и iPad',
      iosStep1: 'Нажмите «Поделиться» в нижней панели Safari.',
      iosStep2: 'Прокрутите список и выберите «На экран “Домой”».',
      gotIt: 'Понятно',
    },
    offline: {
      message: 'Нет сети: показываем сохранённые данные',
    },
    error: {
      title: 'ой!',
      message: 'При отображении страницы что-то сломалось. Перезагрузите приложение, данные корзины останутся.',
      retry: 'Перезагрузить',
    },
  },
  en: {
    common: {
      close: 'Close',
      back: 'Back',
      demoFigures: 'demo figures',
      loading: 'Loading…',
    },
    madeBy: {
      created: 'Created by',
      rights: '© {year} JonikStyle Production. All rights reserved.',
    },
    menu: {
      label: 'Profile menu',
      portals: 'workspaces',
      messages: 'Messages',
    },
    footer: {
      contactsTitle: 'contacts',
      contactsDemo: 'Demo project: contacts are not connected',
    },
    store: {
      note: 'nearby shop',
      inBasket: 'in the basket',
      toBasket: 'To basket',
      distance: 'Distance',
    },
    product: {
      details: 'Details',
      origin: 'From',
      unit: 'Pack',
      quantity: 'Quantity',
      openStore: 'Open the shop',
    },
    cart: {
      note: 'what we are getting',
      removeItem: 'Remove',
      promoLabel: 'Promo code',
      toWindow: 'To delivery window',
    },
    search: {
      note: 'we will find it',
      start: 'looking for?',
      nothing: 'nothing!',
      clearFilters: 'Reset filters',
    },
    orders: {
      note: 'where is it?',
      route: 'the route',
      courier: 'courier',
      callDemoTitle: 'Calls are not connected',
      callDemoMsg: 'This demo has no real phone numbers. Message the courier in chat instead.',
      demoStep: 'Demo: this button changes the status',
      repeatNoneTitle: 'These items are not available now',
      repeatMissing: 'Out of stock',
    },
    profile: {
      note: "that's you",
      demoProfile: 'Demo profile',
      demoProfileDesc: 'Contacts are not connected: this is a sample account.',
      messagesDesc: 'Chats with shops and couriers',
      workspaces: 'Workspaces',
      moreNote: 'more',
    },
    address: {
      selected: 'Selected',
    },
    auth: {
      phonePlaceholder: '+972 00 000 0000',
      emailPlaceholder: 'name@example.com',
    },
    chat: {
      store: 'Shop',
      courier: 'Courier',
      order: 'Order',
      start: 'Start a conversation…',
      attachment: 'Attached photo',
      close: 'Close chat',
      note: 'say hi',
    },
    portal: {
      role: 'Role',
      roleChangedTitle: 'Role changed',
      roleChangedMsg: 'Current role: {role}',
      roles: { admin: 'Admin', customer: 'Customer', vendor: 'Vendor', courier: 'Courier' },
      queue: 'queue',
      applications: 'applications',
      pickupCode: 'Pickup code',
      doorCode: 'door code',
    },
    brand: {
      unknownType: 'unknown',
      badFormatTitle: 'Wrong file format',
      badFormat: 'Format not allowed ({type}). Only PNG, WebP and verified SVG files are accepted.',
      tooBigTitle: 'File too large',
      tooBig: 'The file is over the 10 MB limit ({size} MB).',
      fileReadyTitle: 'File checked and ready to preview',
      fileReadyMsg: 'Size: {w} × {h} px. SHA-256 calculated.',
      readErrorTitle: 'Processing error',
      readError: 'Could not read the image or calculate its checksum.',
      uploadErrorTitle: 'Upload error',
      uploadError: 'Could not update the official brand asset.',
      uploadedTitle: 'Brand asset updated',
      uploadedMsg: 'New version v{version} saved to Supabase Storage.',
      uploadExceptionTitle: 'Update failed',
      unknownError: 'Unknown error',
      rollbackErrorTitle: 'Rollback error',
      rollbackError: 'Could not roll back the version.',
      rolledBackTitle: 'Version restored',
      rolledBackMsg: 'The brand asset is back at version v{version}.',
      copiedTitle: 'Copied',
      copiedMsg: 'The SHA-256 checksum was copied.',
      adminOnlyBody:
        'Only a platform administrator can change QIVENTRA logos in Supabase Storage. Customers, vendors and couriers do not have this permission.',
      currentRole: 'Current role',
      refresh: 'Refresh status',
      bucketNote: 'Public read, write for administrators only (RLS)',
      connected: 'Supabase connected',
      fallback: 'Local fallback mode',
      active: 'Active',
      previewLight: 'Light theme and header',
      previewDark: 'Dark theme',
      previewMark: 'Mark: phone and icon',
      copy: 'Copy',
      copied: 'Copied',
      canonicalPath: 'Path',
      version: 'Version',
      formats: 'PNG, WebP, SVG, up to 10 MB',
      stagingHint: 'Before saving, the file is checked and measured, and its checksum is calculated.',
      fileSize: 'File size',
      newSha: 'New SHA-256',
      publishing: 'Publishing…',
      commit: 'Save the replacement',
      historyHint: 'Earlier versions are kept for a safe rollback',
      historyEmpty: 'No earlier versions yet. The current version is the base one.',
      archive: 'Archive',
      replacing: 'File being replaced',
      newSize: 'New size',
      newVersion: 'New version',
      confirmPublish: 'Confirm and publish',
      rollbackTitle: 'Restore version v{version}',
      rollbackAsset: 'Official asset: {variant}',
      rollbackConfirm: 'Switch the active logo to version v{version}? The current file moves to the archive.',
      rollbackBtn: 'Restore version',
      previewAlt: 'Preview of the new logo',
    },
    pwa: {
      installLabel: 'Install the QIVENTRA app',
      install: 'Install',
      iosLabel: 'Install on iPhone',
      ios: 'Install on iOS',
      iosTitle: 'Install on iPhone and iPad',
      iosStep1: 'Tap Share in the Safari toolbar.',
      iosStep2: 'Scroll down and choose “Add to Home Screen”.',
      gotIt: 'Got it',
    },
    offline: {
      message: 'No connection: showing saved data',
    },
    error: {
      title: 'oops!',
      message: 'Something broke while showing this page. Reload the app; your basket stays as it was.',
      retry: 'Reload',
    },
  },
  he: {
    common: {
      close: 'סגירה',
      back: 'חזרה',
      demoFigures: 'נתוני הדגמה',
      loading: 'טוען…',
    },
    madeBy: {
      created: 'נוצר על ידי',
      rights: '© {year} JonikStyle Production. כל הזכויות שמורות.',
    },
    menu: {
      label: 'תפריט פרופיל',
      portals: 'אזורי עבודה',
      messages: 'הודעות',
    },
    footer: {
      contactsTitle: 'יצירת קשר',
      contactsDemo: 'פרויקט הדגמה: פרטי הקשר אינם מחוברים',
    },
    store: {
      note: 'חנות קרובה',
      inBasket: 'בסל',
      toBasket: 'לסל',
      distance: 'מרחק',
    },
    product: {
      details: 'פרטים',
      origin: 'מקור',
      unit: 'אריזה',
      quantity: 'כמות',
      openStore: 'לפתוח את החנות',
    },
    cart: {
      note: 'מה לוקחים',
      removeItem: 'הסרה',
      promoLabel: 'קוד קופון',
      toWindow: 'לחלון המשלוח',
    },
    search: {
      note: 'נמצא',
      start: 'מה מחפשים?',
      nothing: 'ריק!',
      clearFilters: 'איפוס מסננים',
    },
    orders: {
      note: 'איפה ההזמנה?',
      route: 'המסלול',
      courier: 'שליח',
      callDemoTitle: 'שיחות אינן מחוברות',
      callDemoMsg: 'בפרויקט ההדגמה אין מספרים אמיתיים. אפשר לכתוב לשליח בצ׳אט.',
      demoStep: 'הדגמה: הכפתור משנה את הסטטוס',
      repeatNoneTitle: 'הפריטים האלה אינם זמינים כעת',
      repeatMissing: 'אזל מהמלאי',
    },
    profile: {
      note: 'זה אתם',
      demoProfile: 'פרופיל הדגמה',
      demoProfileDesc: 'פרטי הקשר אינם מחוברים: זהו חשבון לדוגמה.',
      messagesDesc: 'שיחות עם חנויות ושליחים',
      workspaces: 'אזורי עבודה',
      moreNote: 'עוד',
    },
    address: {
      selected: 'נבחר',
    },
    auth: {
      phonePlaceholder: '+972 00 000 0000',
      emailPlaceholder: 'name@example.com',
    },
    chat: {
      store: 'חנות',
      courier: 'שליח',
      order: 'הזמנה',
      start: 'התחילו שיחה…',
      attachment: 'תמונה מצורפת',
      close: 'סגירת הצ׳אט',
      note: 'כתבו לנו',
    },
    portal: {
      role: 'תפקיד',
      roleChangedTitle: 'התפקיד הוחלף',
      roleChangedMsg: 'התפקיד הנוכחי: {role}',
      roles: { admin: 'מנהל', customer: 'לקוח', vendor: 'מוכר', courier: 'שליח' },
      queue: 'בתור',
      applications: 'בקשות',
      pickupCode: 'קוד איסוף',
      doorCode: 'קוד כניסה',
    },
    brand: {
      unknownType: 'לא ידוע',
      badFormatTitle: 'פורמט קובץ שגוי',
      badFormat: 'הפורמט אינו מותר ({type}). מותרים רק PNG, WebP ו-SVG מאומת.',
      tooBigTitle: 'הקובץ גדול מדי',
      tooBig: 'הקובץ חורג ממגבלת 10 MB ‏({size} MB).',
      fileReadyTitle: 'הקובץ נבדק ומוכן לתצוגה מקדימה',
      fileReadyMsg: 'גודל: {w} × {h} px. חושב SHA-256.',
      readErrorTitle: 'שגיאת עיבוד',
      readError: 'לא ניתן לקרוא את התמונה או לחשב את סכום הביקורת.',
      uploadErrorTitle: 'שגיאת העלאה',
      uploadError: 'לא ניתן לעדכן את נכס המותג הרשמי.',
      uploadedTitle: 'נכס המותג עודכן',
      uploadedMsg: 'גרסה חדשה v{version} נשמרה ב-Supabase Storage.',
      uploadExceptionTitle: 'העדכון נכשל',
      unknownError: 'שגיאה לא ידועה',
      rollbackErrorTitle: 'שגיאה בשחזור הגרסה',
      rollbackError: 'לא ניתן לשחזר את הגרסה.',
      rolledBackTitle: 'הגרסה שוחזרה',
      rolledBackMsg: 'נכס המותג חזר לגרסה v{version}.',
      copiedTitle: 'הועתק',
      copiedMsg: 'סכום הביקורת SHA-256 הועתק.',
      adminOnlyBody:
        'רק מנהל הפלטפורמה יכול לשנות את לוגו QIVENTRA ב-Supabase Storage. ללקוחות, מוכרים ושליחים אין הרשאה לכך.',
      currentRole: 'התפקיד הנוכחי',
      refresh: 'רענון סטטוס',
      bucketNote: 'קריאה ציבורית, כתיבה למנהלים בלבד (RLS)',
      connected: 'Supabase מחובר',
      fallback: 'מצב גיבוי מקומי',
      active: 'פעילה',
      previewLight: 'ערכת נושא בהירה וכותרת',
      previewDark: 'ערכת נושא כהה',
      previewMark: 'סמל: טלפון ואייקון',
      copy: 'העתקה',
      copied: 'הועתק',
      canonicalPath: 'נתיב',
      version: 'גרסה',
      formats: 'PNG, WebP, SVG, עד 10 MB',
      stagingHint: 'לפני השמירה הקובץ ייבדק וימדד, וסכום הביקורת יחושב.',
      fileSize: 'גודל הקובץ',
      newSha: 'SHA-256 חדש',
      publishing: 'מפרסם…',
      commit: 'שמירת ההחלפה',
      historyHint: 'גרסאות קודמות נשמרות לשחזור בטוח',
      historyEmpty: 'אין עדיין גרסאות קודמות. הגרסה הנוכחית היא הבסיסית.',
      archive: 'ארכיון',
      replacing: 'הקובץ שמוחלף',
      newSize: 'גודל חדש',
      newVersion: 'גרסה חדשה',
      confirmPublish: 'אישור ופרסום',
      rollbackTitle: 'שחזור גרסה v{version}',
      rollbackAsset: 'נכס רשמי: {variant}',
      rollbackConfirm: 'להחליף את הלוגו הפעיל לגרסה v{version}? הקובץ הנוכחי יעבור לארכיון.',
      rollbackBtn: 'שחזור גרסה',
      previewAlt: 'תצוגה מקדימה של הלוגו החדש',
    },
    pwa: {
      installLabel: 'התקנת אפליקציית QIVENTRA',
      install: 'התקנה',
      iosLabel: 'התקנה ב-iPhone',
      ios: 'התקנה ב-iOS',
      iosTitle: 'התקנה ב-iPhone וב-iPad',
      iosStep1: 'הקישו על „שיתוף” בסרגל של Safari.',
      iosStep2: 'גללו ובחרו „הוספה למסך הבית”.',
      gotIt: 'הבנתי',
    },
    offline: {
      message: 'אין חיבור: מוצגים נתונים שמורים',
    },
    error: {
      title: 'אופס!',
      message: 'משהו נשבר בהצגת הדף. טענו מחדש את האפליקציה; הסל יישאר כפי שהיה.',
      retry: 'טעינה מחדש',
    },
  },
};
