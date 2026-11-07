/**
 * Collage design copy, exposed through the app's localization system as `t.collage`.
 * Source: the design set's collage-strings.json. Prices, times, fees and minimums are
 * NOT here: they come from src/data/mockData.ts and the AppContext cart calculation.
 *
 * The Hebrew text was not written by a native speaker and needs proofreading.
 */

export type CollageGroupId = 'all' | 'food' | 'health' | 'gift' | 'tech' | 'pets';

export interface CollageStoreCopy {
  name: string;
  kind: string;
  area: string;
}

export interface CollageStrings {
  meta: { title: string };
  common: {
    /** Sentence case, for panels. */
    demo: string;
    /** Lower case, after "QIVENTRA ·". */
    demoInline: string;
    skipToContent: string;
    langLabel: string;
    nophoto: string;
    fee: string;
    minFrom: string;
    cartItems: string;
    addressLabel: string;
  };
  tabs: {
    label: string;
    home: string;
    shops: string;
    cart: string;
    orders: string;
    profile: string;
    main: string;
  };
  landing: {
    cta: string;
    hello: string;
    h1a: string;
    h1b: string;
    h1c: string;
    lead: string;
    start: string;
    quick: string;
    boardTitle: string;
    /** {n} is the number of shops in the data. */
    boardNote: string;
    how: string;
    wait: string;
    toShops: string;
    caps: [string, string, string];
    steps: [[string, string], [string, string], [string, string]];
  };
  mobileHome: {
    today: string;
    h1a: string;
    h1b: string;
    h1c: string;
    stickers: string;
    swipe: string;
    add: string;
    inCart: string;
    near: string;
    /** {n} is the number of shops in the data. */
    count: string;
    all: string;
    kinds: string;
    pick: string;
    howT: string;
    howD: string;
  };
  stores: {
    back: string;
    step: string;
    title: string;
    titleMobile: string;
    catLabel: string;
    emptyT: string;
    emptyD: string;
    showAll: string;
    chosen: string;
    next: string;
    nextMobile: string;
    thisOne: string;
    openStore: string;
  };
  delivery: {
    back: string;
    backMobile: string;
    step: string;
    done: string;
    title: string;
    titleDone: string;
    titleDoneMobile: string;
    when: string;
    windowLabel: string;
    note: string;
    notePh: string;
    where: string;
    packing: string;
    stamp: string;
    home: string;
    change: string;
    orderLabel: string;
    photoAlt: string;
    soon: string;
    /** {store} is one or more shop names from the basket. */
    sent: string;
    confirm: string;
    confirmMobile: string;
    busy: string;
    windowWord: string;
    /** {n} is the missing amount, {store} the shop, {min} its minimum order. */
    addMore: string;
    toStoreItems: string;
    toOrder: string;
    deliveryLabel: string;
    total: string;
  };
  orders: {
    otherActive: string;
    open: string;
  };
  groups: Record<CollageGroupId, string>;
  storeCopy: Record<string, CollageStoreCopy>;
  productLabels: Record<string, string>;
  /** Delivery windows are built from the current time in src/data/deliverySlots.ts. */
  slots: {
    asap: string;
    days: Record<'today' | 'tomorrow' | 'dayAfter', string>;
    parts: Record<'morning' | 'midday' | 'evening', string>;
    dayLabel: string;
  };
}

export const collageTranslations: Record<'ru' | 'en' | 'he', CollageStrings> = {
  ru: {
    meta: { title: 'QIVENTRA — собери район в одну корзину' },
    common: {
      demo: 'Демо-проект портфолио; оплата не проводится',
      demoInline: 'демо-проект портфолио; оплата не проводится',
      skipToContent: 'К содержимому',
      langLabel: 'Язык',
      nophoto: 'фото скоро',
      fee: 'доставка',
      minFrom: 'от',
      cartItems: 'Корзина, товаров:',
      addressLabel: 'Адрес доставки',
    },
    tabs: {
      label: 'Разделы приложения',
      home: 'Главная',
      shops: 'Лавки',
      cart: 'Корзина',
      orders: 'Заказы',
      profile: 'Профиль',
      main: 'Основная навигация',
    },
    landing: {
      cta: 'Выбрать лавку',
      hello: 'привет, сосед!',
      h1a: 'Собери ',
      h1b: 'район',
      h1c: ' в одну корзину',
      lead: 'Хала из пекарни, авокадо с рынка, букет из Яффо — выбираете лавку, мы показываем итог и окно доставки.',
      start: 'Начать →',
      quick: '← это быстро',
      boardTitle: 'Лавки на нашей доске',
      boardNote: '(их {n})',
      how: 'Как это работает',
      wait: 'Ваша корзина ждёт',
      toShops: 'К лавкам →',
      caps: ['хала!', 'букет', 'лабне'],
      steps: [
        ['Адрес', 'Пишете улицу — показываем лавки рядом с вашим адресом.'],
        ['Корзина', 'Кладёте товары, итог считается сразу, без сюрпризов.'],
        ['Окно', 'Как можно скорее или ко времени — на три дня вперёд.'],
      ],
    },
    mobileHome: {
      today: 'что берём сегодня?',
      h1a: 'Собери ',
      h1b: 'район',
      h1c: ' в корзину',
      stickers: 'Стикеры дня',
      swipe: '← листай',
      add: 'Добавить:',
      inCart: 'Уже в корзине:',
      near: 'Лавки рядом',
      count: '({n})',
      all: 'все →',
      kinds: 'Пекарня, рынок, цветы, аптека…',
      pick: 'выбери свою →',
      howT: 'как это работает:',
      howD: '1 — лавка · 2 — корзина · 3 — окно доставки. Итог виден сразу.',
    },
    stores: {
      back: 'Назад',
      step: 'шаг 1 из 2',
      title: 'Выберите лавку',
      titleMobile: 'Выбери лавку',
      catLabel: 'Категория',
      emptyT: 'упс, пусто',
      emptyD: 'В этой категории пока нет лавок рядом с вами.',
      showAll: 'Показать все',
      chosen: 'выбрано:',
      next: 'К окну доставки →',
      nextMobile: 'Дальше →',
      thisOne: 'эта!',
      openStore: 'Товары лавки',
    },
    delivery: {
      back: '← к лавкам',
      backMobile: 'Назад к лавкам',
      step: 'шаг 2 из 2',
      done: 'записано!',
      title: 'Окно доставки',
      titleDone: 'Заказ передан в лавку',
      titleDoneMobile: 'Заказ принят',
      when: 'когда привезти?',
      windowLabel: 'Окно доставки',
      note: 'записка курьеру:',
      notePh: 'код домофона, этаж…',
      where: 'куда привезти:',
      packing: 'лавка уже собирает пакет →',
      stamp: 'ГОТОВО!',
      home: 'На главную',
      change: 'Изменить окно',
      orderLabel: 'Заказ',
      photoAlt: 'Курьер передаёт пакет у двери',
      soon: 'скоро у двери :)',
      sent: 'Заказ передан в {store}',
      confirm: 'Подтвердить',
      confirmMobile: 'Подтвердить заказ',
      busy: 'Передаём заказ в лавку…',
      windowWord: 'Окно',
      addMore: 'Добавьте ещё {n}: минимальный заказ в {store} — {min}.',
      toStoreItems: 'К товарам лавки',
      toOrder: 'К заказу',
      deliveryLabel: 'Доставка',
      total: 'Итого',
    },
    orders: {
      otherActive: 'Другие активные заказы',
      open: 'Открыть',
    },
    groups: {
      all: 'Все',
      food: 'Еда',
      health: 'Аптека',
      gift: 'Цветы и дом',
      tech: 'Техника',
      pets: 'Зоотовары',
    },
    storeCopy: {
      'store-1': { name: 'Carmel Fresh Market', kind: 'Рынок', area: 'Кармель' },
      'store-2': { name: 'Sarona Tech & Sound', kind: 'Электроника', area: 'Сарона' },
      'store-3': { name: 'Levinsky Artisan', kind: 'Пекарня', area: 'Флорентин' },
      'store-4': { name: 'Jaffa Botanicals', kind: 'Цветы', area: 'Яффо' },
      'store-5': { name: 'Neve Tzedek Living', kind: 'Дом', area: 'Неве-Цедек' },
      'store-6': { name: 'Galilee BioPharm', kind: 'Аптека', area: 'Лев а-Ир' },
    },
    productLabels: {
      'prod-1': 'лабне',
      'prod-2': 'авокадо',
      'prod-3': 'масло',
      'prod-4': 'хала',
      'prod-5': 'круассан',
      'prod-6': 'колдбрю',
      'prod-7': 'наушники',
      'prod-8': 'зарядка',
      'prod-9': 'свеча',
      'prod-10': 'чашка',
      'prod-11': 'букет',
      'prod-12': 'магний',
    },
    slots: {
      asap: 'как можно скорее',
      days: { today: 'сегодня', tomorrow: 'завтра', dayAfter: 'послезавтра' },
      parts: { morning: 'утро', midday: 'день', evening: 'вечер' },
      dayLabel: 'День доставки',
    },
  },
  en: {
    meta: { title: 'QIVENTRA — put your block in one basket' },
    common: {
      demo: 'Portfolio demo project; no payments are processed',
      demoInline: 'portfolio demo project; no payments are processed',
      skipToContent: 'Skip to content',
      langLabel: 'Language',
      nophoto: 'photo soon',
      fee: 'delivery',
      minFrom: 'min.',
      cartItems: 'Basket, items:',
      addressLabel: 'Delivery address',
    },
    tabs: {
      label: 'App sections',
      home: 'Home',
      shops: 'Shops',
      cart: 'Basket',
      orders: 'Orders',
      profile: 'Profile',
      main: 'Main navigation',
    },
    landing: {
      cta: 'Choose a shop',
      hello: 'hi, neighbor!',
      h1a: 'Put your ',
      h1b: 'block',
      h1c: ' in one basket',
      lead: 'Challah from the bakery, avocados from the market, flowers from Jaffa — pick a shop and we show the total and the delivery window.',
      start: 'Start →',
      quick: '← it’s quick',
      boardTitle: 'Shops on our board',
      boardNote: '({n} of them)',
      how: 'How it works',
      wait: 'Your basket is waiting',
      toShops: 'To the shops →',
      caps: ['challah!', 'flowers', 'labneh'],
      steps: [
        ['Address', 'Type your street — we show the shops near your address.'],
        ['Basket', 'Add items — the total updates right away, no surprises.'],
        ['Window', 'As soon as possible or at a set time — up to three days ahead.'],
      ],
    },
    mobileHome: {
      today: 'what are we getting?',
      h1a: 'Your ',
      h1b: 'block',
      h1c: ' in one basket',
      stickers: 'Today’s stickers',
      swipe: 'swipe →',
      add: 'Add:',
      inCart: 'Already in basket:',
      near: 'Shops nearby',
      count: '({n})',
      all: 'all →',
      kinds: 'Bakery, market, flowers, pharmacy…',
      pick: 'pick yours →',
      howT: 'how it works:',
      howD: '1 — shop · 2 — basket · 3 — delivery window. You see the total right away.',
    },
    stores: {
      back: 'Back',
      step: 'step 1 of 2',
      title: 'Choose a shop',
      titleMobile: 'Pick a shop',
      catLabel: 'Category',
      emptyT: 'oops, empty',
      emptyD: 'No shops in this category deliver to you yet.',
      showAll: 'Show all',
      chosen: 'picked:',
      next: 'To delivery window →',
      nextMobile: 'Next →',
      thisOne: 'this one!',
      openStore: 'Shop items',
    },
    delivery: {
      back: '← back to shops',
      backMobile: 'Back to shops',
      step: 'step 2 of 2',
      done: 'noted!',
      title: 'Delivery window',
      titleDone: 'Order sent to the shop',
      titleDoneMobile: 'Order placed',
      when: 'when should we come?',
      windowLabel: 'Delivery window',
      note: 'note for the courier:',
      notePh: 'door code, floor…',
      where: 'where to bring it:',
      packing: 'the shop is packing your bag →',
      stamp: 'DONE!',
      home: 'Back home',
      change: 'Change window',
      orderLabel: 'Order',
      photoAlt: 'Courier handing over a bag at the door',
      soon: 'at your door soon :)',
      sent: 'Order sent to {store}',
      confirm: 'Confirm',
      confirmMobile: 'Confirm order',
      busy: 'Sending your order…',
      windowWord: 'Window',
      addMore: 'Add {n} more: the minimum order at {store} is {min}.',
      toStoreItems: 'To the shop’s items',
      toOrder: 'To the order',
      deliveryLabel: 'Delivery',
      total: 'Total',
    },
    orders: {
      otherActive: 'Other active orders',
      open: 'Open',
    },
    groups: {
      all: 'All',
      food: 'Food',
      health: 'Pharmacy',
      gift: 'Flowers & home',
      tech: 'Tech',
      pets: 'Pets',
    },
    storeCopy: {
      'store-1': { name: 'Carmel Fresh Market', kind: 'Market', area: 'Carmel' },
      'store-2': { name: 'Sarona Tech & Sound', kind: 'Electronics', area: 'Sarona' },
      'store-3': { name: 'Levinsky Artisan', kind: 'Bakery', area: 'Florentin' },
      'store-4': { name: 'Jaffa Botanicals', kind: 'Flowers', area: 'Jaffa' },
      'store-5': { name: 'Neve Tzedek Living', kind: 'Home', area: 'Neve Tzedek' },
      'store-6': { name: 'Galilee BioPharm', kind: 'Pharmacy', area: 'Lev HaIr' },
    },
    productLabels: {
      'prod-1': 'labneh',
      'prod-2': 'avocado',
      'prod-3': 'olive oil',
      'prod-4': 'challah',
      'prod-5': 'croissant',
      'prod-6': 'cold brew',
      'prod-7': 'earbuds',
      'prod-8': 'charger',
      'prod-9': 'candle',
      'prod-10': 'mug',
      'prod-11': 'bouquet',
      'prod-12': 'magnesium',
    },
    slots: {
      asap: 'as soon as possible',
      days: { today: 'today', tomorrow: 'tomorrow', dayAfter: 'day after tomorrow' },
      parts: { morning: 'morning', midday: 'midday', evening: 'evening' },
      dayLabel: 'Delivery day',
    },
  },
  he: {
    meta: { title: 'QIVENTRA — כל השכונה בסל אחד' },
    common: {
      demo: 'פרויקט הדגמה לתיק עבודות; לא מתבצעים תשלומים',
      demoInline: 'פרויקט הדגמה לתיק עבודות; לא מתבצעים תשלומים',
      skipToContent: 'דילוג לתוכן',
      langLabel: 'שפה',
      nophoto: 'תמונה בקרוב',
      fee: 'משלוח',
      minFrom: 'מינימום',
      cartItems: 'סל, פריטים:',
      addressLabel: 'כתובת למשלוח',
    },
    tabs: {
      label: 'אזורי האפליקציה',
      home: 'בית',
      shops: 'חנויות',
      cart: 'סל',
      orders: 'הזמנות',
      profile: 'פרופיל',
      main: 'ניווט ראשי',
    },
    landing: {
      cta: 'בחירת חנות',
      hello: 'שלום, שכנים!',
      h1a: 'כל ',
      h1b: 'השכונה',
      h1c: ' בסל אחד',
      lead: 'חלה מהמאפייה, אבוקדו מהשוק, זר פרחים מיפו — בוחרים חנות, ואנחנו מראים את הסכום ואת חלון המשלוח.',
      start: 'מתחילים ←',
      quick: 'זה מהיר →',
      boardTitle: 'החנויות על הלוח שלנו',
      boardNote: '(יש {n})',
      how: 'איך זה עובד',
      wait: 'הסל שלכם מחכה',
      toShops: 'לחנויות ←',
      caps: ['חלה!', 'זר', 'לבנה'],
      steps: [
        ['כתובת', 'מקלידים רחוב — ואנחנו מראים חנויות ליד הכתובת שלכם.'],
        ['סל', 'מוסיפים מוצרים — הסכום מתעדכן מיד, בלי הפתעות.'],
        ['חלון', 'בהקדם האפשרי או בשעה שתבחרו — עד שלושה ימים קדימה.'],
      ],
    },
    mobileHome: {
      today: 'מה לוקחים היום?',
      h1a: 'כל ',
      h1b: 'השכונה',
      h1c: ' בסל אחד',
      stickers: 'מדבקות היום',
      swipe: 'החליקו ←',
      add: 'הוספה:',
      inCart: 'כבר בסל:',
      near: 'חנויות קרובות',
      count: '({n})',
      all: '← הכול',
      kinds: 'מאפייה, שוק, פרחים, בית מרקחת…',
      pick: '← בחרו את שלכם',
      howT: 'איך זה עובד:',
      howD: '1 — חנות · 2 — סל · 3 — חלון משלוח. הסכום מוצג מיד.',
    },
    stores: {
      back: 'חזרה',
      step: 'שלב 1 מתוך 2',
      title: 'בחרו חנות',
      titleMobile: 'בחרו חנות',
      catLabel: 'קטגוריה',
      emptyT: 'אופס, ריק',
      emptyD: 'עדיין אין בקטגוריה הזו חנויות שמגיעות אליכם.',
      showAll: 'הצגת הכול',
      chosen: 'נבחרה:',
      next: 'לחלון המשלוח ←',
      nextMobile: 'הלאה ←',
      thisOne: 'זאת!',
      openStore: 'מוצרי החנות',
    },
    delivery: {
      back: 'לחנויות →',
      backMobile: 'חזרה לחנויות',
      step: 'שלב 2 מתוך 2',
      done: 'נרשם!',
      title: 'חלון משלוח',
      titleDone: 'ההזמנה נשלחה לחנות',
      titleDoneMobile: 'ההזמנה התקבלה',
      when: 'מתי להביא?',
      windowLabel: 'חלון משלוח',
      note: 'פתק לשליח:',
      notePh: 'קוד אינטרקום, קומה…',
      where: 'לאן להביא:',
      packing: 'החנות כבר אורזת את השקית ←',
      stamp: 'מוכן!',
      home: 'לדף הבית',
      change: 'שינוי חלון',
      orderLabel: 'הזמנה',
      photoAlt: 'שליח מוסר שקית בדלת',
      soon: 'בקרוב אצלכם :)',
      sent: 'ההזמנה נשלחה ל־{store}',
      confirm: 'אישור',
      confirmMobile: 'אישור ההזמנה',
      busy: 'שולחים את ההזמנה…',
      windowWord: 'חלון',
      addMore: 'הוסיפו עוד {n}: ההזמנה המינימלית ב־{store} היא {min}.',
      toStoreItems: 'למוצרי החנות',
      toOrder: 'להזמנה',
      deliveryLabel: 'משלוח',
      total: 'סה״כ',
    },
    orders: {
      otherActive: 'הזמנות פעילות נוספות',
      open: 'פתיחה',
    },
    groups: {
      all: 'הכול',
      food: 'אוכל',
      health: 'בית מרקחת',
      gift: 'פרחים ובית',
      tech: 'טכנולוגיה',
      pets: 'חיות מחמד',
    },
    storeCopy: {
      'store-1': { name: 'Carmel Fresh Market', kind: 'שוק', area: 'הכרמל' },
      'store-2': { name: 'Sarona Tech & Sound', kind: 'אלקטרוניקה', area: 'שרונה' },
      'store-3': { name: 'Levinsky Artisan', kind: 'מאפייה', area: 'פלורנטין' },
      'store-4': { name: 'Jaffa Botanicals', kind: 'פרחים', area: 'יפו' },
      'store-5': { name: 'Neve Tzedek Living', kind: 'בית', area: 'נווה צדק' },
      'store-6': { name: 'Galilee BioPharm', kind: 'בית מרקחת', area: 'לב העיר' },
    },
    productLabels: {
      'prod-1': 'לבנה',
      'prod-2': 'אבוקדו',
      'prod-3': 'שמן זית',
      'prod-4': 'חלה',
      'prod-5': 'קרואסון',
      'prod-6': 'קולד ברו',
      'prod-7': 'אוזניות',
      'prod-8': 'מטען',
      'prod-9': 'נר',
      'prod-10': 'ספל',
      'prod-11': 'זר',
      'prod-12': 'מגנזיום',
    },
    slots: {
      asap: 'בהקדם האפשרי',
      days: { today: 'היום', tomorrow: 'מחר', dayAfter: 'מחרתיים' },
      parts: { morning: 'בוקר', midday: 'צהריים', evening: 'ערב' },
      dayLabel: 'יום המשלוח',
    },
  },
};
