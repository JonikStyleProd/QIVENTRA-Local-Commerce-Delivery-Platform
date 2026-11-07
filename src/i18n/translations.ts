import { CollageStrings, collageTranslations } from './collage';
import { ScreenStrings, screenTranslations } from './screens';
import { PromotionStrings, promotionTranslations } from './promotions';
import { DemoStrings, demoTranslations } from './demo';

export type Language = 'ru' | 'en' | 'he';

export interface Translations {
  collage: CollageStrings;
  screens: ScreenStrings;
  promotions: PromotionStrings;
  demo: DemoStrings;
  nav: {
    home: string;
    catalog: string;
    orders: string;
    cart: string;
    profile: string;
    search: string;
    portals: string;
    vendorPortal: string;
    courierHub: string;
    adminHub: string;
    delivery: string;
    searchPlaceholder: string;
    clear: string;
    toggleThemeLight: string;
    toggleThemeDark: string;
  };
  home: {
    searchPlaceholder: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    quickTags: string[];
  };
  catalog: {
    title: string;
    tabStores: string;
    tabProducts: string;
    allCategories: string;
    allProducts: string;
    freeDelivery: string;
    filterEco: string;
    filterFreeDelivery: string;
    sortBy: string;
    sortLabel: string;
    sortDeliverySpeed: string;
    sortMinOrder: string;
    emptyProductsDesc: string;
  };
  search: {
    title: string;
    subtitle: string;
    allCategories: string;
    onlyEco: string;
    startTypingSubtitle: string;
    noResultsTitle: string;
    noResultsSubtitle: string;
    openCatalog: string;
  };
  orders: {
    title: string;
    subtitle: string;
    statusLabel: string;
    completed: string;
    statusCompleted: string;
    stepReceived: string;
    stepPreparing: string;
    stepOnTheWay: string;
    stepAtDoor: string;
    callCourier: string;
    chat: string;
    orderItemsTitle: string;
    total: string;
    nextStepBtn: string;
    repeatOrder: string;
    repeatOrderToastTitle: string;
    repeatOrderToastMsg: string;
  };
  cart: {
    title: string;
    checkoutTitle: string;
    itemsCountLabel: string;
    clearAll: string;
    emptyTitle: string;
    emptyDesc: string;
    exploreCatalog: string;
    deliverTo: string;
    deliveryDestination: string;
    changeAddress: string;
    orderSummary: string;
    itemsSubtotal: string;
    deliveryFee: string;
    applyPromo: string;
  };
  profile: {
    switchAccount: string;
    savedAddresses: string;
    manage: string;
    appSettings: string;
    languageSetting: string;
    themeSetting: string;
    themeDark: string;
    themeLight: string;
    switchTheme: string;
    pwaSetting: string;
    pwaDesc: string;
    vendorPortalTitle: string;
    vendorPortalDesc: string;
    courierPortalTitle: string;
    courierPortalDesc: string;
    adminPortalTitle: string;
    adminPortalDesc: string;
  };
  store: {
    backToCatalog: string;
    shareStore: string;
    courierDeliveryLabel: string;
    deliveryCostLabel: string;
    minOrderPrefix: string;
    storeAssortment: string;
  };
  vendor: {
    portalTitle: string;
    acceptanceOpenToast: string;
    acceptancePausedToast: string;
    acceptanceOpenMsg: string;
    acceptancePausedMsg: string;
    acceptanceActive: string;
    acceptancePaused: string;
    revenueToday: string;
    ordersShift: string;
    avgTicket: string;
    liveOrdersQueue: string;
    statusAssembling: string;
    statusReadyForPickup: string;
    statusHandedToCourier: string;
    statusUpdatedToastTitle: string;
    statusUpdatedToastMsg: string;
    finishAssembly: string;
    handToCourier: string;
  };
  courier: {
    courierLabel: string;
    shiftStartedTitle: string;
    shiftPausedTitle: string;
    shiftStartedMsg: string;
    shiftPausedMsg: string;
    onShift: string;
    breakTime: string;
    earnedShift: string;
    includingTips: string;
    completedDeliveries: string;
    batteryLevel: string;
    currentTask: string;
    pointAPickup: string;
    pointBDelivery: string;
  };
  admin: {
    adminHubTitle: string;
    adminHubSubtitle: string;
    monitoringCenter: string;
    platformGMV: string;
    activeMerchants: string;
    inDistricts: string;
    couriersOnShift: string;
    onLine: string;
    avgDeliveryTime: string;
    merchantApplications: string;
    statusVerified: string;
    statusPending: string;
    approveAndPublish: string;
    merchantVerifiedTitle: string;
    merchantVerifiedMsg: string;
    activeInCatalog: string;
    brandAssetsTitle: string;
    brandAssetsSubtitle: string;
    markTitle: string;
    lockupTitle: string;
    currentActiveVersion: string;
    uploadNewVersion: string;
    actualDimensions: string;
    checksumLabel: string;
    confirmReplacement: string;
    confirmReplacementMsg: string;
    restoreVersion: string;
    versionHistory: string;
    adminOnlyNotice: string;
    dropFileHere: string;
    browseFiles: string;
  };
  address: {
    modalTitle: string;
    modalSubtitle: string;
    primaryBadge: string;
  };
  auth: {
    modalTitle: string;
    modalSubtitle: string;
    roleCustomer: string;
    roleVendor: string;
    roleCourier: string;
    phoneLabel: string;
    storeEmailLabel: string;
    submitBtn: string;
    roleSwitchedMsg: string;
  };
  productCard: {
    addToCart: string;
    inCart: string;
    decrease: string;
    increase: string;
  };
  storeCard: {
    eco: string;
    promo: string;
    freeDelivery: string;
    minOrder: string;
  };
  footer: {
    brandStatement: string;
    deliveryTime: string;
    forCustomers: string;
    categoriesCatalog: string;
    productSearch: string;
    activeOrdersTracker: string;
    userProfile: string;
    forBusiness: string;
    vendorAccount: string;
    courierService: string;
    adminHub: string;
    privacy: string;
    terms: string;
  };
  media: {
    changePhoto: string;
    dropzoneTitle: string;
    allowedFormats: string;
    browse: string;
    camera: string;
    zoom: string;
    replace: string;
    delete: string;
    uploading: string;
    uploadSuccess: string;
    fileTooLarge: string;
    invalidType: string;
    invalidSignature: string;
  };
  chat: {
    title: string;
    emptyConversations: string;
    typeMessage: string;
    send: string;
    attachPhoto: string;
    online: string;
    typing: string;
    withStore: string;
    backToList: string;
  };
  common: {
    km: string;
    items: string;
    save: string;
    cancel: string;
  };
}

export const translations: Record<Language, Translations> = {
  he: {
    collage: collageTranslations.he,
    screens: screenTranslations.he,
    promotions: promotionTranslations.he,
    demo: demoTranslations.he,
    nav: {
      home: 'בית',
      catalog: 'קטלוג',
      orders: 'הזמנות',
      cart: 'סל קניות',
      profile: 'פרופיל',
      search: 'חיפוש',
      portals: 'אזורים',
      vendorPortal: 'אזור מוכר',
      courierHub: 'מרכז שליחים',
      adminHub: 'ניהול מערכת',
      delivery: 'משלוח',
      searchPlaceholder: 'חיפוש חנויות, מצרכים, מנות...',
      clear: 'נקה',
      toggleThemeLight: 'מעבר למצב בהיר',
      toggleThemeDark: 'מעבר למצב כהה',
    },
    home: {
      searchPlaceholder: 'מה נביא לכם: חלה טרייה, אבוקדו, גבינות, קפה...',
    },
    hero: {
      badge: 'משלוח אקספרס החל מ-25 דקות בתל אביב וגוש דן',
      title: 'חנויות שכונתיות, מצרכים טריים ומעדנים עד הדלת',
      subtitle: 'מאפיות בוטיק, משקים אורגניים, בתי מרקחת וטכנולוגיה באפליקציה אחת עם משלוח אקספרס מהיר ומוקפד.',
      searchPlaceholder: 'מה נביא לכם: חלה טרייה, זיתים, אבוקדו, קפה, מוצרי חשמל...',
      quickTags: ['חלה טרייה', 'אבוקדו האס', 'שמן זית', 'גבינת עיזים', 'קפה ספיישלטי'],
    },
    catalog: {
      title: 'חנויות ושווקים שכונתיים',
      tabStores: 'חנויות',
      tabProducts: 'מוצרים',
      allCategories: 'כל הקטגוריות',
      allProducts: 'כל המוצרים',
      freeDelivery: 'משלוח חינם',
      filterEco: 'אקו ומשק',
      filterFreeDelivery: 'משלוח חינם',
      sortBy: 'מיון:',
      sortLabel: 'מיון',
      sortDeliverySpeed: 'לפי מהירות',
      sortMinOrder: 'לפי מינימום הזמנה',
      emptyProductsDesc: 'אין מוצרים התואמים את הסינון בקטגוריה זו.',
    },
    search: {
      title: 'חיפוש חנויות ומוצרים בשכונה',
      subtitle: 'חיפוש מהיר של מצרכים, מאפים, טכנולוגיה ומותגים מקומיים',
      allCategories: 'כל הקטגוריות',
      onlyEco: '🍃 מוצרים ירוקים בלבד',
      startTypingSubtitle: 'נאתר עבורכם מוצרים בחנויות הסמוכות ונציג זמן הגעה מדויק.',
      noResultsTitle: 'לא נמצאו תוצאות',
      noResultsSubtitle: 'בדקו שגיאות הקלדה, נסו מילות חיפוש אחרות או עיינו בקטלוג.',
      openCatalog: 'פתיחת הקטלוג',
    },
    orders: {
      title: 'הזמנות ומעקב משלוח',
      subtitle: 'מעקב בזמן אמת אחר משלוחים פעילים והיסטוריית רכישות',
      statusLabel: 'סטטוס',
      completed: 'הושלם',
      statusCompleted: 'הושלם',
      stepReceived: 'התקבלה',
      stepPreparing: 'באריזה',
      stepOnTheWay: 'בדרך',
      stepAtDoor: 'בדלת',
      callCourier: 'התקשר לשליח',
      chat: 'צ\'אט',
      orderItemsTitle: 'פירוט ההזמנה',
      total: 'סה״כ',
      nextStepBtn: 'שלב השליח הבא',
      repeatOrder: 'הזמן שוב',
      repeatOrderToastTitle: 'נוספו לסל הקניות',
      repeatOrderToastMsg: 'מוצרי ההזמנה נטענו מחדש לסל',
    },
    cart: {
      title: 'סל קניות ותשלום',
      checkoutTitle: 'סיום הזמנה',
      itemsCountLabel: 'מוצרים',
      clearAll: 'רוקן סל',
      emptyTitle: 'סל הקניות ריק כרגע',
      emptyDesc: 'הוסיפו מוצרים טריים מהשוק, מאפים או גאדג\'טים מקטלוג החנויות השכונתיות.',
      exploreCatalog: 'מעבר לקטלוג',
      deliverTo: 'כתובת למשלוח:',
      deliveryDestination: 'כתובת למשלוח',
      changeAddress: 'שינוי',
      orderSummary: 'סיכום הזמנה',
      itemsSubtotal: 'סה״כ מוצרים',
      deliveryFee: 'דמי משלוח',
      applyPromo: 'החל',
    },
    profile: {
      switchAccount: 'החלפת חשבון',
      savedAddresses: 'כתובות שמורות',
      manage: 'ניהול',
      appSettings: 'הגדרות אפליקציה',
      languageSetting: 'שפת ממשק',
      themeSetting: 'ערכת נושא',
      themeDark: 'מצב כהה פעיל',
      themeLight: 'מצב בהיר פעיל',
      switchTheme: 'החלף',
      pwaSetting: 'אפליקציית PWA',
      pwaDesc: 'גישה מהירה ממסך הבית ועבודה במצב לא מקוון',
      vendorPortalTitle: 'אזור מוכר',
      vendorPortalDesc: 'הזמנות החנות, קטלוג וניהול מלאי',
      courierPortalTitle: 'מרכז שליחים',
      courierPortalDesc: 'מסלולים, משמרות ויתרת תשלומים',
      adminPortalTitle: 'ניהול מערכת',
      adminPortalDesc: 'סטטיסטיקת פלטפורמה ובקרת איכות',
    },
    store: {
      backToCatalog: 'חזרה לקטלוג',
      shareStore: 'שתף חנות',
      courierDeliveryLabel: 'משלוח שליחים',
      deliveryCostLabel: 'עלות משלוח',
      minOrderPrefix: 'מינימום הזמנה',
      storeAssortment: 'מגוון החנות',
    },
    vendor: {
      portalTitle: 'פורטל מוכר',
      acceptanceOpenToast: 'קבלת הזמנות נפתחה',
      acceptancePausedToast: 'החנות בהשהייה',
      acceptanceOpenMsg: 'החנות זמינה כעת ללקוחות באזור.',
      acceptancePausedMsg: 'קבלת הזמנות חדשות הושהתה זמנית.',
      acceptanceActive: 'קבלת הזמנות פעילה',
      acceptancePaused: 'החנות בהשהייה',
      revenueToday: 'הכנסות היום',
      ordersShift: 'הזמנות במשמרת',
      avgTicket: 'סל ממוצע',
      liveOrdersQueue: 'תור הזמנות פעיל',
      statusAssembling: 'באריזה',
      statusReadyForPickup: 'מוכן למסירה לשליח',
      statusHandedToCourier: 'נמסר למשלוח',
      statusUpdatedToastTitle: 'סטטוס ההזמנה עודכן',
      statusUpdatedToastMsg: 'הזמנה עברה לשלב הבא',
      finishAssembly: 'סיים אריזה',
      handToCourier: 'מסור לשליח',
    },
    courier: {
      courierLabel: 'שליח',
      shiftStartedTitle: 'יצאת למשמרת',
      shiftPausedTitle: 'משמרת הושהתה',
      shiftStartedMsg: 'מוכן לקבל הזמנות חדשות.',
      shiftPausedMsg: 'הזמנות חדשות אינן מנותבות כעת.',
      onShift: 'במשמרת (מקבל הזמנות)',
      breakTime: 'בהפסקה',
      earnedShift: 'הכנסה במשמרת',
      includingTips: 'כולל טיפים',
      completedDeliveries: 'משלוחים שהושלמו',
      batteryLevel: 'רמת סוללה',
      currentTask: 'הזמנה נוכחית בטיפול',
      pointAPickup: 'נקודה א׳: איסוף מהחנות',
      pointBDelivery: 'נקודה ב׳: מסירה ללקוח',
    },
    admin: {
      adminHubTitle: 'מרכז ניהול ובקרה QIVENTRA ישראל',
      adminHubSubtitle: 'ניטור פעילות מסחרית שכונתית ואיזון ציי השליחים',
      monitoringCenter: 'מרכז ניטור',
      platformGMV: 'מחזור פלטפורמה (GMV)',
      activeMerchants: 'בתי עסק פעילים',
      inDistricts: 'ב-4 אזורים בעיר',
      couriersOnShift: 'שליחים במשמרת',
      onLine: 'מחוברים',
      avgDeliveryTime: 'זמן משלוח ממוצע',
      merchantApplications: 'בקשות הצטרפות של בתי עסק',
      statusVerified: 'מאומת',
      statusPending: 'ממתין לבדיקה',
      approveAndPublish: 'אישור ופרסום בקטלוג',
      merchantVerifiedTitle: 'בית העסק אומת',
      merchantVerifiedMsg: 'החנות נוספה לקטלוג QIVENTRA וזמינה להזמנות.',
      activeInCatalog: 'פעיל בקטלוג',
      brandAssetsTitle: 'נכסי מותג ולוגו רשמי',
      brandAssetsSubtitle: 'ניהול אובייקטים רשמיים ב-Supabase Storage עם בקרת גרסאות ואימות SHA-256',
      markTitle: 'סמל רשמי (Mark ללא טקסט)',
      lockupTitle: 'לוגו מלא (Lockup רשמי)',
      currentActiveVersion: 'גרסה פעילה נוכחית',
      uploadNewVersion: 'העלאת גרסה חדשה',
      actualDimensions: 'ממדים בפועל',
      checksumLabel: 'חתימת SHA-256',
      confirmReplacement: 'אישור החלפת לוגו רשמי',
      confirmReplacementMsg: 'האם לעדכן את נכס המותג הפעיל? הגרסה הקודמת תישמר בהיסטוריה וניתנת לשחזור.',
      restoreVersion: 'שחזור גרסה זו',
      versionHistory: 'היסטוריית גרסאות וארכיון',
      adminOnlyNotice: 'גישה למנהלי מערכת בלבד (Admin RLS)',
      dropFileHere: 'גררו קובץ לכאן או לחצו לבחירה',
      browseFiles: 'בחירת קובץ',
    },
    address: {
      modalTitle: 'כתובת למשלוח',
      modalSubtitle: 'בחרו כתובת לחישוב זמני הגעה מדויקים מחנויות השכונה',
      primaryBadge: 'ראשית',
    },
    auth: {
      modalTitle: 'כניסה ל-QIVENTRA',
      modalSubtitle: 'בחרו תפקיד להתחברות במצב הדגמה',
      roleCustomer: 'לקוח',
      roleVendor: 'מוכר',
      roleCourier: 'שליח',
      phoneLabel: 'מספר טלפון (+972)',
      storeEmailLabel: 'דוא״ל של החנות',
      submitBtn: 'התחברות בקוד הדגמה',
      roleSwitchedMsg: 'מחובר כעת בתפקיד',
    },
    productCard: {
      addToCart: 'הוסף לסל',
      inCart: 'בסל',
      decrease: 'הפחת כמות',
      increase: 'הגדל כמות',
    },
    storeCard: {
      eco: 'ירוק',
      promo: 'מבצע',
      freeDelivery: 'משלוח חינם',
      minOrder: 'החל מ-',
    },
    footer: {
      brandStatement: 'פלטפורמה חדשנית למסחר מקומי ומשלוחי אקספרס בישראל. מחברים את מיטב החנויות השכונתיות, המאפיות והמשקים באקו-סיסטם דיגיטלי מתקדם.',
      deliveryTime: 'משלוח מ-25 דק׳',
      forCustomers: 'ללקוחות',
      categoriesCatalog: 'קטלוג קטגוריות',
      productSearch: 'חיפוש מוצרים',
      activeOrdersTracker: 'הזמנות ומעקב חי',
      userProfile: 'פרופיל אישי',
      forBusiness: 'לעסקים ושותפים',
      vendorAccount: 'אזור מוכר',
      courierService: 'שירות שליחים',
      adminHub: 'ניהול מערכת',
      privacy: 'פרטיות',
      terms: 'תנאי שימוש',
    },
    media: {
      changePhoto: 'החלף תמונה',
      dropzoneTitle: 'גרור ושחרר תמונה לכאן או לחץ לבחירה',
      allowedFormats: 'תומך ב-JPG, PNG, WebP עד 8MB',
      browse: 'בחר קובץ',
      camera: 'מצלמה',
      zoom: 'קנה מידה:',
      replace: 'החלף',
      delete: 'מחק',
      uploading: 'שומר קובץ...',
      uploadSuccess: 'התמונה נשמרה בהצלחה!',
      fileTooLarge: 'גודל הקובץ עולה על 8MB',
      invalidType: 'פורמטים נתמכים: JPG, PNG, WebP בלבד',
      invalidSignature: 'קובץ תמונה פגום או לא נתמך',
    },
    chat: {
      title: 'הודעות וצ\'אט',
      emptyConversations: 'אין שיחות פעילות כרגע',
      typeMessage: 'כתוב הודעה...',
      send: 'שלח',
      attachPhoto: 'צרף תמונה',
      online: 'מחובר',
      typing: 'מקליד...',
      withStore: 'צ\'אט עם החנות',
      backToList: 'חזרה לשיחות',
    },
    common: {
      km: 'ק״מ',
      items: 'יח׳',
      save: 'שמור',
      cancel: 'ביטול',
    },
  },
  en: {
    collage: collageTranslations.en,
    screens: screenTranslations.en,
    promotions: promotionTranslations.en,
    demo: demoTranslations.en,
    nav: {
      home: 'Home',
      catalog: 'Catalog',
      orders: 'Orders',
      cart: 'Cart',
      profile: 'Profile',
      search: 'Search',
      portals: 'Portals',
      vendorPortal: 'Merchant Portal',
      courierHub: 'Courier Hub',
      adminHub: 'Admin Hub',
      delivery: 'Delivery',
      searchPlaceholder: 'Search stores, groceries, dishes...',
      clear: 'Clear',
      toggleThemeLight: 'Switch to light mode',
      toggleThemeDark: 'Switch to dark mode',
    },
    home: {
      searchPlaceholder: 'What to deliver: fresh challah, avocado, cheese, coffee...',
    },
    hero: {
      badge: 'Express delivery from 25 min in Tel Aviv & Gush Dan',
      title: 'Local stores, fresh market groceries & delicacies at your door',
      subtitle: 'Artisan bakeries, organic farms, pharmacies, and tech essentials in one single app with reliable doorstep express delivery.',
      searchPlaceholder: 'What to deliver: challah, olives, avocado, coffee, gadgets...',
      quickTags: ['Fresh Challah', 'Hass Avocado', 'Olive Oil', 'Goat Cheese', 'Specialty Coffee'],
    },
    catalog: {
      title: 'Neighborhood Stores & Markets',
      tabStores: 'Stores',
      tabProducts: 'Products',
      allCategories: 'All Categories',
      allProducts: 'All Products',
      freeDelivery: 'Free Delivery',
      filterEco: 'Eco & Farm',
      filterFreeDelivery: 'Free Delivery',
      sortBy: 'Sort by:',
      sortLabel: 'Sort',
      sortDeliverySpeed: 'By Speed',
      sortMinOrder: 'By Min Order',
      emptyProductsDesc: 'No products found matching these filters in this category.',
    },
    search: {
      title: 'Search Neighborhood Stores & Products',
      subtitle: 'Instant search across fresh groceries, pastries, tech, and local brands',
      allCategories: 'All categories',
      onlyEco: '🍃 Eco Only',
      startTypingSubtitle: 'We will find items in nearby stores and calculate precise delivery time.',
      noResultsTitle: 'No results found',
      noResultsSubtitle: 'Try checking your spelling, changing terms, or browsing categories in the catalog.',
      openCatalog: 'Open catalog',
    },
    orders: {
      title: 'Orders & Live Delivery Tracker',
      subtitle: 'Real-time active order tracking and purchase history',
      statusLabel: 'Status',
      completed: 'Completed',
      statusCompleted: 'Completed',
      stepReceived: 'Received',
      stepPreparing: 'Preparing',
      stepOnTheWay: 'On the way',
      stepAtDoor: 'At door',
      callCourier: 'Call courier',
      chat: 'Chat',
      orderItemsTitle: 'Order Items',
      total: 'Total',
      nextStepBtn: 'Next Courier Step',
      repeatOrder: 'Reorder',
      repeatOrderToastTitle: 'Added to cart',
      repeatOrderToastMsg: 'Order items reloaded into cart',
    },
    cart: {
      title: 'Checkout & Review',
      checkoutTitle: 'Checkout',
      itemsCountLabel: 'Items',
      clearAll: 'Clear all',
      emptyTitle: 'Your cart is empty',
      emptyDesc: 'Add fresh market groceries, artisan sourdough, or gadgets from local stores.',
      exploreCatalog: 'Explore catalog',
      deliverTo: 'Deliver to:',
      deliveryDestination: 'Deliver to',
      changeAddress: 'Change',
      orderSummary: 'Order Summary',
      itemsSubtotal: 'Items Subtotal',
      deliveryFee: 'Courier Delivery',
      applyPromo: 'Apply',
    },
    profile: {
      switchAccount: 'Switch Account',
      savedAddresses: 'Saved Addresses',
      manage: 'Manage',
      appSettings: 'App Settings',
      languageSetting: 'Display Language',
      themeSetting: 'Theme',
      themeDark: 'Dark mode active',
      themeLight: 'Light mode active',
      switchTheme: 'Toggle',
      pwaSetting: 'Installable PWA',
      pwaDesc: 'Instant home-screen access and offline caching',
      vendorPortalTitle: 'Merchant Portal',
      vendorPortalDesc: 'Store orders, catalog, stock management',
      courierPortalTitle: 'Courier Hub',
      courierPortalDesc: 'Routes, active shifts, payout balance',
      adminPortalTitle: 'Admin Hub',
      adminPortalDesc: 'Platform analytics, store moderation',
    },
    store: {
      backToCatalog: 'Back to catalog',
      shareStore: 'Share store',
      courierDeliveryLabel: 'Courier delivery',
      deliveryCostLabel: 'Delivery fee',
      minOrderPrefix: 'Min order',
      storeAssortment: 'Store Assortment',
    },
    vendor: {
      portalTitle: 'Merchant Hub',
      acceptanceOpenToast: 'Orders acceptance open',
      acceptancePausedToast: 'Store paused',
      acceptanceOpenMsg: 'Store is now visible to nearby customers.',
      acceptancePausedMsg: 'New orders are temporarily paused.',
      acceptanceActive: 'Accepting orders',
      acceptancePaused: 'Store paused',
      revenueToday: 'Today\'s Revenue',
      ordersShift: 'Orders this shift',
      avgTicket: 'Average Order',
      liveOrdersQueue: 'Live Store Order Queue',
      statusAssembling: 'Assembling',
      statusReadyForPickup: 'Ready for pickup',
      statusHandedToCourier: 'Dispatched to delivery',
      statusUpdatedToastTitle: 'Order status updated',
      statusUpdatedToastMsg: 'Order moved to the next step',
      finishAssembly: 'Finish Assembly',
      handToCourier: 'Hand to Courier',
    },
    courier: {
      courierLabel: 'Courier',
      shiftStartedTitle: 'Shift started',
      shiftPausedTitle: 'Shift paused',
      shiftStartedMsg: 'Ready to receive new orders.',
      shiftPausedMsg: 'New orders are paused.',
      onShift: 'On Duty (Accepting orders)',
      breakTime: 'On Break',
      earnedShift: 'Shift Earnings',
      includingTips: 'Including tips',
      completedDeliveries: 'Completed Deliveries',
      batteryLevel: 'Battery Level',
      currentTask: 'Active Delivery Task',
      pointAPickup: 'Point A: Store pickup',
      pointBDelivery: 'Point B: Dropoff customer',
    },
    admin: {
      adminHubTitle: 'QIVENTRA Israel Admin Hub',
      adminHubSubtitle: 'Real-time city commerce monitoring & courier fleet balance',
      monitoringCenter: 'Monitoring Center',
      platformGMV: 'Platform Volume (GMV)',
      activeMerchants: 'Active Merchants',
      inDistricts: 'across 4 city areas',
      couriersOnShift: 'Couriers on Shift',
      onLine: 'online',
      avgDeliveryTime: 'Average Delivery Time',
      merchantApplications: 'Merchant Onboarding Requests',
      statusVerified: 'Verified',
      statusPending: 'Pending review',
      approveAndPublish: 'Approve & Publish',
      merchantVerifiedTitle: 'Merchant Verified',
      merchantVerifiedMsg: 'Store added to QIVENTRA catalog and ready for orders.',
      activeInCatalog: 'Active in catalog',
      brandAssetsTitle: 'Official Brand Assets',
      brandAssetsSubtitle: 'Manage official brand logos in Supabase Storage with SHA-256 verification and versioning',
      markTitle: 'Official Mark (Symbol without text)',
      lockupTitle: 'Full Official Lockup (Logo with wordmark)',
      currentActiveVersion: 'Current Active Version',
      uploadNewVersion: 'Upload New Version',
      actualDimensions: 'Actual Dimensions',
      checksumLabel: 'SHA-256 Checksum',
      confirmReplacement: 'Confirm Logo Replacement',
      confirmReplacementMsg: 'Are you sure you want to deploy this new brand asset version? The previous version will be preserved in version history.',
      restoreVersion: 'Restore this version',
      versionHistory: 'Version History & Audit',
      adminOnlyNotice: 'Restricted to Administrators only (Admin RLS)',
      dropFileHere: 'Drag & drop image here or click to browse',
      browseFiles: 'Browse File',
    },
    address: {
      modalTitle: 'Delivery Address',
      modalSubtitle: 'Select your address to calculate accurate delivery ETA from neighborhood stores',
      primaryBadge: 'Primary',
    },
    auth: {
      modalTitle: 'Sign in to QIVENTRA',
      modalSubtitle: 'Choose a role for demo access to the platform',
      roleCustomer: 'Customer',
      roleVendor: 'Merchant',
      roleCourier: 'Courier',
      phoneLabel: 'Phone number (+972)',
      storeEmailLabel: 'Store email',
      submitBtn: 'Demo Sign In',
      roleSwitchedMsg: 'Logged in with role',
    },
    productCard: {
      addToCart: 'Add to cart',
      inCart: 'In cart',
      decrease: 'Decrease quantity',
      increase: 'Increase quantity',
    },
    storeCard: {
      eco: 'Eco',
      promo: 'Promo',
      freeDelivery: 'Free Delivery',
      minOrder: 'from',
    },
    footer: {
      brandStatement: 'Next-generation local commerce and express delivery platform in Israel. Connecting the best neighborhood markets, bakeries, pharmacies, and creators in one digital ecosystem.',
      deliveryTime: 'Delivery from 25 min',
      forCustomers: 'Customers',
      categoriesCatalog: 'Category Catalog',
      productSearch: 'Product Search',
      activeOrdersTracker: 'Active Orders & Tracker',
      userProfile: 'User Profile',
      forBusiness: 'Business & Partners',
      vendorAccount: 'Merchant Portal',
      courierService: 'Courier Hub',
      adminHub: 'Admin Hub',
      privacy: 'Privacy',
      terms: 'Terms',
    },
    media: {
      changePhoto: 'Change Photo',
      dropzoneTitle: 'Drag and drop image here or click to browse',
      allowedFormats: 'Supports JPG, PNG, WebP up to 8MB',
      browse: 'Choose File',
      camera: 'Camera',
      zoom: 'Scale:',
      replace: 'Replace',
      delete: 'Delete',
      uploading: 'Saving image...',
      uploadSuccess: 'Image saved successfully!',
      fileTooLarge: 'File size exceeds 8MB limit',
      invalidType: 'Only JPG, PNG and WebP formats supported',
      invalidSignature: 'Corrupted or unsupported image file',
    },
    chat: {
      title: 'Messages & Chat',
      emptyConversations: 'No active conversations',
      typeMessage: 'Type a message...',
      send: 'Send',
      attachPhoto: 'Attach Photo',
      online: 'Online',
      typing: 'Typing...',
      withStore: 'Chat with Store',
      backToList: 'Back to conversations',
    },
    common: {
      km: 'km',
      items: 'pcs',
      save: 'Save',
      cancel: 'Cancel',
    },
  },
  ru: {
    collage: collageTranslations.ru,
    screens: screenTranslations.ru,
    promotions: promotionTranslations.ru,
    demo: demoTranslations.ru,
    nav: {
      home: 'Главная',
      catalog: 'Каталог',
      orders: 'Заказы',
      cart: 'Корзина',
      profile: 'Профиль',
      search: 'Поиск',
      portals: 'Кабинеты',
      vendorPortal: 'Кабинет продавца',
      courierHub: 'Интерфейс курьера',
      adminHub: 'Административный хаб',
      delivery: 'Доставка',
      searchPlaceholder: 'Поиск магазинов, продуктов, блюд...',
      clear: 'Очистить',
      toggleThemeLight: 'Включить светлую тему',
      toggleThemeDark: 'Включить тёмную тему',
    },
    home: {
      searchPlaceholder: 'Что доставить: хала, оливки, авокадо, кофе, гаджеты...',
    },
    hero: {
      badge: 'Экспресс-доставка от 25 минут в Тель-Авиве и Гуш-Дане',
      title: 'Локальные магазины, свежие продукты и деликатесы у вас дома',
      subtitle: 'Фермерские лавки, ремесленные пекарни, аптеки и гаджеты в одном приложении с бережной экспресс-доставкой до двери.',
      searchPlaceholder: 'Что доставить: хала, оливки, авокадо, кофе, гаджеты...',
      quickTags: ['Свежая хала', 'Авокадо Hass', 'Оливковое масло', 'Козий сыр', 'Спешелти кофе'],
    },
    catalog: {
      title: 'Каталог районов и магазинов',
      tabStores: 'Магазины',
      tabProducts: 'Товары',
      allCategories: 'Все категории',
      allProducts: 'Все товары',
      freeDelivery: 'Бесплатная доставка',
      filterEco: 'Эко & Ферма',
      filterFreeDelivery: 'Бесплатная доставка',
      sortBy: 'Сортировка:',
      sortLabel: 'Сортировка',
      sortDeliverySpeed: 'По скорости',
      sortMinOrder: 'По мин. заказу',
      emptyProductsDesc: 'В этой категории пока нет товаров с указанными параметрами.',
    },
    search: {
      title: 'Поиск по магазинам и товарам района',
      subtitle: 'Мгновенный поиск продуктов, выпечки, техники и локальных брендов',
      allCategories: 'Все категории',
      onlyEco: '🍃 Только Эко',
      startTypingSubtitle: 'Мы найдём нужные товары в ближайших магазинах и рассчитаем точное время доставки.',
      noResultsTitle: 'Ничего не найдено',
      noResultsSubtitle: 'Попробуйте изменить формулировку, проверить опечатки или выберите категорию в каталоге.',
      openCatalog: 'Открыть каталог',
    },
    orders: {
      title: 'Заказы и трекер доставки',
      subtitle: 'Отслеживание активных доставок в режиме реального времени и история покупок',
      statusLabel: 'Статус',
      completed: 'Завершено',
      statusCompleted: 'Завершено',
      stepReceived: 'Принят',
      stepPreparing: 'Сборка',
      stepOnTheWay: 'В пути',
      stepAtDoor: 'У двери',
      callCourier: 'Позвонить',
      chat: 'Чат',
      orderItemsTitle: 'Состав заказа',
      total: 'Итого',
      nextStepBtn: 'Следующий шаг курьера',
      repeatOrder: 'Повторить',
      repeatOrderToastTitle: 'Позиции добавлены в корзину',
      repeatOrderToastMsg: 'Товары из заказа повторно загружены:',
    },
    cart: {
      title: 'Оформление заказа',
      checkoutTitle: 'Оформление заказа',
      itemsCountLabel: 'Товары',
      clearAll: 'Очистить всё',
      emptyTitle: 'В корзине пока пусто',
      emptyDesc: 'Добавьте свежие фермерские продукты, выпечку или технику из каталога районных магазинов.',
      exploreCatalog: 'Перейти в каталог',
      deliverTo: 'Куда доставить:',
      deliveryDestination: 'Куда доставить',
      changeAddress: 'Изменить',
      orderSummary: 'Итог заказа',
      itemsSubtotal: 'Товары',
      deliveryFee: 'Курьерская доставка',
      applyPromo: 'Применить',
    },
    profile: {
      switchAccount: 'Сменить аккаунт',
      savedAddresses: 'Адреса доставки',
      manage: 'Управление',
      appSettings: 'Настройки приложения',
      languageSetting: 'Язык интерфейса',
      themeSetting: 'Тема оформления',
      themeDark: 'Тёмная тема активна',
      themeLight: 'Светлая тема активна',
      switchTheme: 'Переключить',
      pwaSetting: 'Устанавливаемое PWA',
      pwaDesc: 'Быстрый доступ с экрана "Домой" и офлайн кеш',
      vendorPortalTitle: 'Кабинет продавца',
      vendorPortalDesc: 'Заказы точки, каталог, стоп-лист',
      courierPortalTitle: 'Курьерский хаб',
      courierPortalDesc: 'Маршруты, смена, баланс выплат',
      adminPortalTitle: 'Администрация',
      adminPortalDesc: 'Статистика платформы, модерация',
    },
    store: {
      backToCatalog: 'Вернуться в каталог',
      shareStore: 'Поделиться магазином',
      courierDeliveryLabel: 'Доставка курьером',
      deliveryCostLabel: 'Стоимость доставки',
      minOrderPrefix: 'Минимальный заказ',
      storeAssortment: 'Ассортимент магазина',
    },
    vendor: {
      portalTitle: 'Кабинет мерчанта',
      acceptanceOpenToast: 'Приём заказов открыт',
      acceptancePausedToast: 'Точка на паузе',
      acceptanceOpenMsg: 'Магазин снова виден покупателям района.',
      acceptancePausedMsg: 'Новые заказы временно приостановлены.',
      acceptanceActive: 'Приём заказов активен',
      acceptancePaused: 'Магазин на паузе',
      revenueToday: 'Выручка сегодня',
      ordersShift: 'Заказов за смену',
      avgTicket: 'Средний чек',
      liveOrdersQueue: 'Очередь текущих заказов точки',
      statusAssembling: 'В сборке',
      statusReadyForPickup: 'Готов к передаче курьеру',
      statusHandedToCourier: 'Передан в доставку',
      statusUpdatedToastTitle: 'Статус заказа обновлен',
      statusUpdatedToastMsg: 'Заказ передан на следующий этап:',
      finishAssembly: 'Завершить сборку',
      handToCourier: 'Передать курьеру',
    },
    courier: {
      courierLabel: 'Курьер',
      shiftStartedTitle: 'Вы вышли на линию',
      shiftPausedTitle: 'Смена приостановлена',
      shiftStartedMsg: 'Готовы принимать новые доставки.',
      shiftPausedMsg: 'Новые заказы не поступают.',
      onShift: 'На линии (Принимаю заказы)',
      breakTime: 'Перерыв',
      earnedShift: 'Заработано за смену',
      includingTips: 'Включая чаевые',
      completedDeliveries: 'Выполнено доставок',
      batteryLevel: 'Заряд батареи',
      currentTask: 'Текущий заказ в работе',
      pointAPickup: 'Точка А: Забор заказа',
      pointBDelivery: 'Точка Б: Вручение клиенту',
    },
    admin: {
      adminHubTitle: 'Административный хаб QIVENTRA Израиль',
      adminHubSubtitle: 'Мониторинг торговой активности районов и логистического баланса',
      monitoringCenter: 'Центр мониторинга',
      platformGMV: 'Оборот платформы (GMV)',
      activeMerchants: 'Активных мерчантов',
      inDistricts: 'в 4 районах города',
      couriersOnShift: 'Курьеров на смене',
      onLine: 'на линии',
      avgDeliveryTime: 'Среднее время доставки',
      merchantApplications: 'Заявки мерчантов на подключение',
      statusVerified: 'Верифицирован',
      statusPending: 'Ожидает проверки',
      approveAndPublish: 'Одобрить и опубликовать',
      merchantVerifiedTitle: 'Магазин верифицирован',
      merchantVerifiedMsg: 'Точка добавлена в каталог QIVENTRA и доступна для заказов.',
      activeInCatalog: 'Активен в каталоге',
      brandAssetsTitle: 'Бренд-ассеты и официальный логотип',
      brandAssetsSubtitle: 'Управление официальными логотипами в Supabase Storage с проверкой SHA-256 и версионированием',
      markTitle: 'Официальный знак (Mark без текста)',
      lockupTitle: 'Полный логотип (Lockup с надписью)',
      currentActiveVersion: 'Текущая активная версия',
      uploadNewVersion: 'Загрузить новую версию',
      actualDimensions: 'Реальные размеры',
      checksumLabel: 'Контрольная сумма SHA-256',
      confirmReplacement: 'Подтверждение замены официального логотипа',
      confirmReplacementMsg: 'Вы уверены, что хотите опубликовать новую версию бренд-ассета? Предыдущая версия сохранится в архиве и может быть восстановлена.',
      restoreVersion: 'Восстановить эту версию',
      versionHistory: 'История версий и архив',
      adminOnlyNotice: 'Доступ только для администраторов (Admin RLS)',
      dropFileHere: 'Перетащите изображение сюда или выберите файл',
      browseFiles: 'Выбрать файл',
    },
    address: {
      modalTitle: 'Адрес доставки',
      modalSubtitle: 'Выберите адрес для расчёта точного времени доставки из магазинов района',
      primaryBadge: 'Основной',
    },
    auth: {
      modalTitle: 'Вход в QIVENTRA',
      modalSubtitle: 'Выберите роль для демонстрационного входа в платформу',
      roleCustomer: 'Клиент',
      roleVendor: 'Продавец',
      roleCourier: 'Курьер',
      phoneLabel: 'Номер телефона (+972)',
      storeEmailLabel: 'Email магазина',
      submitBtn: 'Войти по демо-коду',
      roleSwitchedMsg: 'Вы вошли как',
    },
    productCard: {
      addToCart: 'В корзину',
      inCart: 'В корзине',
      decrease: 'Уменьшить количество',
      increase: 'Увеличить количество',
    },
    storeCard: {
      eco: 'Эко',
      promo: 'Акция',
      freeDelivery: 'Бесплатная доставка',
      minOrder: 'от',
    },
    footer: {
      brandStatement: 'Современная платформа локальной торговли и экспресс-доставки в Израиле. Объединяем лучшие районные магазины, фермерские лавки, пекарни и производителей в единой цифровой экосистеме.',
      deliveryTime: 'Доставка от 25 мин',
      forCustomers: 'Покупателям',
      categoriesCatalog: 'Каталог категорий',
      productSearch: 'Поиск товаров',
      activeOrdersTracker: 'Активные заказы & Трекер',
      userProfile: 'Личный профиль',
      forBusiness: 'Бизнесу & Партнерам',
      vendorAccount: 'Кабинет продавца',
      courierService: 'Курьерская служба',
      adminHub: 'Административный хаб',
      privacy: 'Конфиденциальность',
      terms: 'Условия',
    },
    media: {
      changePhoto: 'Изменить фото',
      dropzoneTitle: 'Перетащите изображение сюда или выберите файл',
      allowedFormats: 'Поддерживаются JPG, PNG, WebP до 8 МБ',
      browse: 'Выбрать файл',
      camera: 'Камера',
      zoom: 'Масштаб:',
      replace: 'Заменить',
      delete: 'Удалить',
      uploading: 'Сохранение файла...',
      uploadSuccess: 'Изображение успешно сохранено!',
      fileTooLarge: 'Размер файла превышает 8 МБ',
      invalidType: 'Поддерживаются только форматы JPG, PNG и WebP',
      invalidSignature: 'Повреждённый или неподдерживаемый файл',
    },
    chat: {
      title: 'Сообщения & Чат',
      emptyConversations: 'Нет активных диалогов',
      typeMessage: 'Напишите сообщение...',
      send: 'Отправить',
      attachPhoto: 'Прикрепить фото',
      online: 'В сети',
      typing: 'Печатает...',
      withStore: 'Чат с магазином',
      backToList: 'Назад к списку',
    },
    common: {
      km: 'км',
      items: 'шт',
      save: 'Сохранить',
      cancel: 'Отмена',
    },
  },
};
