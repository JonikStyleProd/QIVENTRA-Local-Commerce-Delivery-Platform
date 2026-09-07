export type Language = 'ru' | 'en' | 'he';

export interface Translations {
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
    deliveryTo: string;
    delivery: string;
    searchPlaceholder: string;
    clear: string;
    selectAddress: string;
    toggleThemeLight: string;
    toggleThemeDark: string;
  };
  home: {
    heroTag: string;
    heroTitle: string;
    heroSubtitle: string;
    deliveryAddress: string;
    searchPlaceholder: string;
    searchButton: string;
    quickTagsTitle: string;
    promo1Code: string;
    promo1Title: string;
    promo1Desc: string;
    promo2Tag: string;
    promo2Title: string;
    promo2Desc: string;
    promo3Tag: string;
    promo3Title: string;
    promo3Desc: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    viewAllCatalog: string;
    expressTitle: string;
    expressBadge: string;
    viewAll: string;
    popularStoresTitle: string;
    radiusBadge: string;
    popularStoresSubtitle: string;
    filterAll: string;
    filterFarm: string;
    filterBakery: string;
    filterGadgets: string;
    bestsellersTitle: string;
    bestsellersBadge: string;
    bestsellersSubtitle: string;
    toCatalog: string;
    activeOrderPrefix: string;
    simulateStep: string;
    openTracker: string;
    smartTrackingTitle: string;
    smartTrackingHeadline: string;
    smartTrackingDesc: string;
    statAvgTime: string;
    statEtaAccuracy: string;
    statEcoFleet: string;
    courierOnWay: string;
    timelinePacked: string;
    timelineCourier: string;
    timelineLocation: string;
  };
  hero: {
    badge: string;
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    searchButton: string;
    quickTagsLabel: string;
    quickTags: string[];
    promo1Badge: string;
    promo1Title: string;
    promo1Subtitle: string;
    promo2Badge: string;
    promo2Title: string;
    promo2Subtitle: string;
    promo3Badge: string;
    promo3Title: string;
    promo3Subtitle: string;
    categoriesTitle: string;
    categoriesSubtitle: string;
    allCatalog: string;
    expressDeliveryTitle: string;
    expressBadge: string;
    viewAll: string;
    popularStoresTitle: string;
    radiusBadge: string;
    popularStoresSubtitle: string;
    filterAll: string;
    filterGrocery: string;
    filterBakery: string;
    filterTech: string;
    bestSellersTitle: string;
    topChoiceBadge: string;
    bestSellersSubtitle: string;
    toCatalog: string;
    activeOrderBadge: string;
    orderSimulatorStep: string;
    orderTracker: string;
    liveTrackingBadge: string;
    liveTrackingTitle: string;
    liveTrackingSubtitle: string;
    avgTime: string;
    avgTimeValue: string;
    etaAccuracy: string;
    etaAccuracyValue: string;
    ecoTransport: string;
    ecoTransportValue: string;
    courierEnRoute: string;
    orderAssembled: string;
    orderAssembledStore: string;
    courierNameEbike: string;
    courierMovingOn: string;
    openTracker: string;
  };
  catalog: {
    title: string;
    allPlaces: string;
    defaultSubtitle: string;
    storesTab: string;
    productsTab: string;
    tabStores: string;
    tabProducts: string;
    allCategories: string;
    allProducts: string;
    freeDelivery: string;
    ecoFarm: string;
    filterEco: string;
    filterFreeDelivery: string;
    sortBy: string;
    sortLabel: string;
    sortRating: string;
    sortDeliverySpeed: string;
    sortMinOrder: string;
    byRating: string;
    byDeliveryTime: string;
    byMinOrder: string;
    noStoresTitle: string;
    noStoresDesc: string;
    emptyStoresTitle: string;
    emptyStoresDesc: string;
    resetFilters: string;
    noProductsTitle: string;
    noProductsDesc: string;
    emptyProductsTitle: string;
    emptyProductsDesc: string;
    allProductsBtn: string;
  };
  search: {
    title: string;
    subtitle: string;
    inputPlaceholder: string;
    popularSearches: string;
    trendingSearch: string;
    allCategories: string;
    onlyEco: string;
    startTypingTitle: string;
    startTypingSubtitle: string;
    startTypingDesc: string;
    noResultsTitle: string;
    noResultsSubtitle: string;
    noResultsDesc: string;
    openCatalog: string;
    storesFound: string;
    productsFound: string;
  };
  orders: {
    title: string;
    subtitle: string;
    deliveredBadge: string;
    activeDeliveryBadge: string;
    statusLabel: string;
    estimatedTimeLabel: string;
    estTimeLabel: string;
    completed: string;
    statusCompleted: string;
    statusDelivered: string;
    stepReceived: string;
    stepPreparing: string;
    stepOnTheWay: string;
    stepAtDoor: string;
    step1: string;
    step2: string;
    step3: string;
    step4: string;
    deliveriesCount: string;
    callCourier: string;
    chatWithCourier: string;
    chat: string;
    chatSoon: string;
    orderItemsTitle: string;
    orderComposition: string;
    total: string;
    simStepDesc: string;
    simulatorHint: string;
    nextStepBtn: string;
    historyTitle: string;
    completedStatus: string;
    repeatOrder: string;
    repeatOrderToastTitle: string;
    repeatOrderToastMsg: string;
    placedTitle: string;
    placedMessage: string;
  };
  cart: {
    title: string;
    checkoutTitle: string;
    itemsCount: string;
    itemsCountLabel: string;
    clearAll: string;
    emptyTitle: string;
    emptyDesc: string;
    goToShopping: string;
    exploreCatalog: string;
    deliverTo: string;
    deliveryDestination: string;
    changeAddress: string;
    orderSummary: string;
    itemsSubtotal: string;
    promoDiscount: string;
    promoDiscountDesc: string;
    deliveryFee: string;
    courierDelivery: string;
    free: string;
    totalToPay: string;
    totalPayable: string;
    payOrderPrefix: string;
    promoPlaceholder: string;
    applyPromo: string;
    promoAppliedTitle: string;
    promoInvalidTitle: string;
    promoInvalidDesc: string;
    checkoutButton: string;
    securePaymentNote: string;
    paymentConfirmationNote: string;
    freeDeliveryProgress: string;
    freeDeliveryUnlocked: string;
    drawerTitle: string;
    itemWord1: string;
    itemWordFew: string;
    itemWordMany: string;
    drawerEmptyDesc: string;
    goToCatalog: string;
    orderNow: string;
    demoPaymentSafety: string;
  };
  profile: {
    activeClient: string;
    switchAccount: string;
    logout: string;
    savedAddresses: string;
    deliveryAddresses: string;
    manage: string;
    defaultBadge: string;
    appSettings: string;
    languageSetting: string;
    themeSetting: string;
    themeDark: string;
    themeLight: string;
    switchTheme: string;
    pwaSetting: string;
    pwaDesc: string;
    partnerPortalsTitle: string;
    partnerPortalsDesc: string;
    vendorPortalTitle: string;
    vendorPortalDesc: string;
    courierPortalTitle: string;
    courierPortalDesc: string;
    adminPortalTitle: string;
    adminPortalDesc: string;
    vendorTitle: string;
    vendorDesc: string;
    courierTitle: string;
    courierDesc: string;
    adminTitle: string;
    adminDesc: string;
  };
  store: {
    backToCatalog: string;
    ecoCertified: string;
    shareStore: string;
    linkCopied: string;
    ratingLabel: string;
    courierDeliveryLabel: string;
    deliveryCostLabel: string;
    minOrderPrefix: string;
    storeAssortment: string;
  };
  vendor: {
    portalTitle: string;
    partnerSince: string;
    acceptanceOpenToast: string;
    acceptancePausedToast: string;
    acceptanceOpenMsg: string;
    acceptancePausedMsg: string;
    acceptanceActive: string;
    acceptancePaused: string;
    revenueToday: string;
    vsLastWeek: string;
    ordersShift: string;
    avgPrepTime: string;
    avgTicket: string;
    optRange: string;
    ratingLabel: string;
    posReviews: string;
    liveOrdersQueue: string;
    autoRefresh: string;
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
    onTime: string;
    batteryLevel: string;
    hoursLeft: string;
    currentTask: string;
    headingToStore: string;
    headingToClient: string;
    pointAPickup: string;
    pointBDelivery: string;
    orderPickedUpTitle: string;
    orderPickedUpMsg: string;
    orderDeliveredTitle: string;
    payoutCredited: string;
    findingNextOrderTitle: string;
    findingNextOrderMsg: string;
    confirmPickup: string;
    confirmDelivery: string;
    acceptNewOrder: string;
  };
  admin: {
    adminHubTitle: string;
    adminHubSubtitle: string;
    monitoringCenter: string;
    allSystemsOperational: string;
    platformGMV: string;
    todayLabel: string;
    activeMerchants: string;
    storesCount: string;
    inDistricts: string;
    couriersOnShift: string;
    onLine: string;
    ecoFleet: string;
    avgDeliveryTime: string;
    minLabel: string;
    targetSLA: string;
    merchantApplications: string;
    verificationQueue: string;
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
    previewBeforeSave: string;
    actualDimensions: string;
    formatAndSizeCheck: string;
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
    newAddressTitle: string;
    inputPlaceholder: string;
    applyBtn: string;
    cancelBtn: string;
    otherAddressBtn: string;
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
    demoNotice: string;
    roleSwitchedMsg: string;
  };
  productCard: {
    addToCart: string;
    inCart: string;
    decrease: string;
    increase: string;
    topBadge: string;
    newBadge: string;
  };
  storeCard: {
    eco: string;
    promo: string;
    freeDelivery: string;
    deliveryPrice: string;
    minOrder: string;
  };
  footer: {
    brandStatement: string;
    deliveryTime: string;
    verifiedMerchants: string;
    pwaReady: string;
    forCustomers: string;
    categoriesCatalog: string;
    productSearch: string;
    activeOrdersTracker: string;
    userProfile: string;
    forBusiness: string;
    vendorAccount: string;
    courierService: string;
    adminHub: string;
    connectIn24h: string;
    ecosystemTitle: string;
    ecosystemDesc: string;
    versionBadgeTitle: string;
    versionBadgeDesc: string;
    allRightsReserved: string;
    privacy: string;
    terms: string;
    systemStatus: string;
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
    withCourier: string;
    backToList: string;
  };
  common: {
    currencySymbol: string;
    currencyCode: string;
    minutes: string;
    km: string;
    items: string;
    pieces: string;
    save: string;
    cancel: string;
  };
}

export const translations: Record<Language, Translations> = {
  he: {
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
      deliveryTo: 'משלוח ל',
      delivery: 'משלוח',
      searchPlaceholder: 'חיפוש חנויות, מצרכים, מנות...',
      clear: 'נקה',
      selectAddress: 'בחירת כתובת למשלוח',
      toggleThemeLight: 'מעבר למצב בהיר',
      toggleThemeDark: 'מעבר למצב כהה',
    },
    home: {
      heroTag: 'משלוח אקספרס החל מ-25 דקות בתל אביב וגוש דן',
      heroTitle: 'חנויות שכונתיות, מצרכים טריים ומעדנים עד הדלת',
      heroSubtitle: 'מאפיות בוטיק, משקים אורגניים, בתי מרקחת וטכנולוגיה באפליקציה אחת עם משלוח אקספרס מהיר ומוקפד.',
      deliveryAddress: 'כתובת למשלוח',
      searchPlaceholder: 'מה נביא לכם: חלה טרייה, אבוקדו, גבינות, קפה...',
      searchButton: 'חיפוש',
      quickTagsTitle: 'מהיר:',
      promo1Code: 'קוד: START20',
      promo1Title: '20 ₪ הנחה בהזמנה ראשונה',
      promo1Desc: 'בהזמנה מעל 80 ₪ בכל החנויות',
      promo2Tag: 'יוזמה ירוקה',
      promo2Title: 'משלוח ירוק חינם עם שליח',
      promo2Desc: 'על גבי אופניים חשמליים ללא זיהום ורעש',
      promo3Tag: 'מאפיות שכונתיות',
      promo3Title: 'מאפים טריים לארוחת בוקר',
      promo3Desc: 'לחמי מחמצת וקרואסונים חמים מהתנור תוך 25 דקות',
      categoriesTitle: 'קטגוריות מובילות',
      categoriesSubtitle: 'כל מה שצריך ממוכרים מקומיים מובחרים',
      viewAllCatalog: 'לכל הקטלוג',
      expressTitle: 'משלוח מהיר תוך 15–25 דקות',
      expressBadge: 'אקספרס',
      viewAll: 'הצג הכל',
      popularStoresTitle: 'חנויות פופולריות בסביבה',
      radiusBadge: 'ברדיוס 3 ק״מ',
      popularStoresSubtitle: 'שליחי QIVENTRA ייעודיים ואיכות מובטחת',
      filterAll: 'הכל',
      filterFarm: 'משק ושוק',
      filterBakery: 'מאפיות ובתי קפה',
      filterGadgets: 'גאדג\'טים',
      bestsellersTitle: 'רבי מכר וחדשים',
      bestsellersBadge: 'בחירה מובילה',
      bestsellersSubtitle: 'הפריטים המוזמנים ביותר השבוע',
      toCatalog: 'לקטלוג המלא',
      activeOrderPrefix: 'הזמנה פעילה',
      simulateStep: 'הדמיית שלב',
      openTracker: 'למעקב המלא ←',
      smartTrackingTitle: 'מעקב חכם בזמן אמת',
      smartTrackingHeadline: 'שליטה מלאה בכל שלב במשלוח',
      smartTrackingDesc: 'עקבו אחר אישור ההזמנה, האריזה ותנועת השליח ברחבי העיר בדיוק של דקה. כל השלבים מסונכרנים בזמן אמת.',
      statAvgTime: 'זמן ממוצע',
      statEtaAccuracy: 'דיוק זמנים',
      statEcoFleet: 'תחבורה ירוקה',
      courierOnWay: 'השליח בדרך לכתובת',
      timelinePacked: 'ההזמנה נארזה בחנות Carmel Fresh Market',
      timelineCourier: 'השליח תומר על אופניים חשמליים',
      timelineLocation: 'בתנועה בשדרות רוטשילד, 900 מ׳ מכם',
    },
    hero: {
      badge: 'משלוח אקספרס החל מ-25 דקות בתל אביב וגוש דן',
      title: 'חנויות שכונתיות, מצרכים טריים ומעדנים עד הדלת',
      subtitle: 'מאפיות בוטיק, משקים אורגניים, בתי מרקחת וטכנולוגיה באפליקציה אחת עם משלוח אקספרס מהיר ומוקפד.',
      searchPlaceholder: 'מה נביא לכם: חלה טרייה, זיתים, אבוקדו, קפה, מוצרי חשמל...',
      searchButton: 'חיפוש',
      quickTagsLabel: 'מהיר:',
      quickTags: ['חלה טרייה', 'אבוקדו האס', 'שמן זית', 'גבינת עיזים', 'קפה ספיישלטי'],
      promo1Badge: 'קוד קופון: START20',
      promo1Title: '20 ₪ הנחה בהזמנה ראשונה',
      promo1Subtitle: 'בהזמנה מעל 80 ₪ בכל החנויות',
      promo2Badge: 'יוזמה ירוקה',
      promo2Title: 'משלוח ירוק חינם עם שליח',
      promo2Subtitle: 'על גבי אופניים חשמליים ללא זיהום ורעש',
      promo3Badge: 'מאפיות שכונתיות',
      promo3Title: 'מאפים טריים לארוחת בוקר',
      promo3Subtitle: 'לחמי מחמצת וקרואסונים חמים מהתנור תוך 25 דקות',
      categoriesTitle: 'קטגוריות מובילות',
      categoriesSubtitle: 'כל מה שצריך ממוכרים מקומיים מובחרים',
      allCatalog: 'לכל הקטלוג',
      expressDeliveryTitle: 'משלוח מהיר תוך 15–25 דקות',
      expressBadge: 'אקספרס',
      viewAll: 'הצג הכל',
      popularStoresTitle: 'חנויות פופולריות בסביבה',
      radiusBadge: 'ברדיוס 3 ק״מ',
      popularStoresSubtitle: 'שליחי QIVENTRA ייעודיים ואיכות מובטחת',
      filterAll: 'הכל',
      filterGrocery: 'משק ושוק',
      filterBakery: 'מאפיות ובתי קפה',
      filterTech: 'גאדג\'טים',
      bestSellersTitle: 'רבי מכר וחדשים',
      topChoiceBadge: 'בחירה מובילה',
      bestSellersSubtitle: 'הפריטים המוזמנים ביותר השבוע',
      toCatalog: 'לקטלוג המלא',
      activeOrderBadge: 'הזמנה פעילה',
      orderSimulatorStep: 'הדמיית שלב',
      orderTracker: 'מעקב הזמנה',
      liveTrackingBadge: 'מעקב חכם בזמן אמת',
      liveTrackingTitle: 'שליטה מלאה בכל שלב במשלוח',
      liveTrackingSubtitle: 'עקבו אחר אישור ההזמנה, האריזה ותנועת השליח ברחבי העיר בדיוק של דקה. כל השלבים מסונכרנים בזמן אמת.',
      avgTime: 'זמן ממוצע',
      avgTimeValue: '26 דק׳',
      etaAccuracy: 'דיוק זמנים',
      etaAccuracyValue: '99.4%',
      ecoTransport: 'תחבורה ירוקה',
      ecoTransportValue: '100%',
      courierEnRoute: 'השליח בדרך לכתובת',
      orderAssembled: 'ההזמנה נארזה בחנות',
      orderAssembledStore: '14:15 • Carmel Fresh Market',
      courierNameEbike: 'השליח תומר על אופניים חשמליים',
      courierMovingOn: 'בתנועה בשדרות רוטשילד, 900 מ׳ מכם',
      openTracker: 'למעקב המלא ←',
    },
    catalog: {
      title: 'חנויות ושווקים שכונתיים',
      allPlaces: 'מקומות',
      defaultSubtitle: 'כל החנויות המקומיות, מעדניות הבוטיק והמשקים עם משלוח מהיר',
      storesTab: 'חנויות',
      productsTab: 'מוצרים',
      tabStores: 'חנויות',
      tabProducts: 'מוצרים',
      allCategories: 'כל הקטגוריות',
      allProducts: 'כל המוצרים',
      freeDelivery: 'משלוח חינם',
      ecoFarm: 'אקו ומשק',
      filterEco: 'אקו ומשק',
      filterFreeDelivery: 'משלוח חינם',
      sortBy: 'מיון:',
      sortLabel: 'מיון',
      sortRating: 'לפי דירוג',
      sortDeliverySpeed: 'לפי מהירות',
      sortMinOrder: 'לפי מינימום הזמנה',
      byRating: 'לפי דירוג',
      byDeliveryTime: 'לפי מהירות',
      byMinOrder: 'לפי מינימום הזמנה',
      noStoresTitle: 'לא נמצאו חנויות',
      noStoresDesc: 'נסו לאפס את המסננים או לבחור קטגוריה אחרת.',
      emptyStoresTitle: 'לא נמצאו חנויות',
      emptyStoresDesc: 'נסו לאפס את המסננים או לבחור קטגוריה אחרת.',
      resetFilters: 'איפוס מסננים',
      noProductsTitle: 'לא נמצאו מוצרים',
      noProductsDesc: 'אין מוצרים התואמים את הסינון בקטגוריה זו.',
      emptyProductsTitle: 'לא נמצאו מוצרים',
      emptyProductsDesc: 'אין מוצרים התואמים את הסינון בקטגוריה זו.',
      allProductsBtn: 'כל המוצרים',
    },
    search: {
      title: 'חיפוש חנויות ומוצרים בשכונה',
      subtitle: 'חיפוש מהיר של מצרכים, מאפים, טכנולוגיה ומותגים מקומיים',
      inputPlaceholder: 'הקלידו שם מוצר, מנה או חנות...',
      popularSearches: 'חיפושים נפוצים:',
      trendingSearch: 'חיפושים חמים',
      allCategories: 'כל הקטגוריות',
      onlyEco: '🍃 מוצרים ירוקים בלבד',
      startTypingTitle: 'התחילו להקליד לחיפוש',
      startTypingSubtitle: 'נאתר עבורכם מוצרים בחנויות הסמוכות ונציג זמן הגעה מדויק.',
      startTypingDesc: 'נאתר עבורכם מוצרים בחנויות הסמוכות ונציג זמן הגעה מדויק.',
      noResultsTitle: 'לא נמצאו תוצאות',
      noResultsSubtitle: 'בדקו שגיאות הקלדה, נסו מילות חיפוש אחרות או עיינו בקטלוג.',
      noResultsDesc: 'בדקו שגיאות הקלדה, נסו מילות חיפוש אחרות או עיינו בקטלוג.',
      openCatalog: 'פתיחת הקטלוג',
      storesFound: 'חנויות',
      productsFound: 'מוצרים',
    },
    orders: {
      title: 'הזמנות ומעקב משלוח',
      subtitle: 'מעקב בזמן אמת אחר משלוחים פעילים והיסטוריית רכישות',
      deliveredBadge: 'ההזמנה נמסרה',
      activeDeliveryBadge: 'משלוח פעיל',
      statusLabel: 'סטטוס',
      estimatedTimeLabel: 'זמן משוער',
      estTimeLabel: 'זמן משוער',
      completed: 'הושלם',
      statusCompleted: 'הושלם',
      statusDelivered: 'נמסר בהצלחה',
      stepReceived: 'התקבלה',
      stepPreparing: 'באריזה',
      stepOnTheWay: 'בדרך',
      stepAtDoor: 'בדלת',
      step1: '1. התקבלה',
      step2: '2. באריזה',
      step3: '3. בדרך',
      step4: '4. בדלת',
      deliveriesCount: 'משלוחים',
      callCourier: 'התקשר לשליח',
      chatWithCourier: 'צ\'אט עם השליח',
      chat: 'צ\'אט',
      chatSoon: 'שירות הצ\'אט יהיה זמין בשלב הבא.',
      orderItemsTitle: 'פירוט ההזמנה',
      orderComposition: 'פירוט ההזמנה',
      total: 'סה״כ',
      simStepDesc: 'הדמיה אינטראקטיבית של שלבי המשלוח',
      simulatorHint: 'הדמיה אינטראקטיבית של שלבי המשלוח',
      nextStepBtn: 'שלב השליח הבא',
      historyTitle: 'היסטוריית הזמנות',
      completedStatus: 'הושלם',
      repeatOrder: 'הזמן שוב',
      repeatOrderToastTitle: 'נוספו לסל הקניות',
      repeatOrderToastMsg: 'מוצרי ההזמנה נטענו מחדש לסל',
      placedTitle: 'ההזמנה נוצרה בהצלחה!',
      placedMessage: 'ההזמנה הועברה לשליח ולחנות.',
    },
    cart: {
      title: 'סל קניות ותשלום',
      checkoutTitle: 'סיום הזמנה',
      itemsCount: 'פריטים בסל שלך',
      itemsCountLabel: 'מוצרים',
      clearAll: 'רוקן סל',
      emptyTitle: 'סל הקניות ריק כרגע',
      emptyDesc: 'הוסיפו מוצרים טריים מהשוק, מאפים או גאדג\'טים מקטלוג החנויות השכונתיות.',
      goToShopping: 'מעבר לקניות',
      exploreCatalog: 'מעבר לקטלוג',
      deliverTo: 'כתובת למשלוח:',
      deliveryDestination: 'כתובת למשלוח',
      changeAddress: 'שינוי',
      orderSummary: 'סיכום הזמנה',
      itemsSubtotal: 'סה״כ מוצרים',
      promoDiscount: 'הנחת קופון',
      promoDiscountDesc: 'הנחה חושבה על סך',
      deliveryFee: 'דמי משלוח',
      courierDelivery: 'משלוח עם שליח',
      free: 'חינם',
      totalToPay: 'לתשלום',
      totalPayable: 'סה״כ לתשלום',
      payOrderPrefix: 'תשלום בסך',
      promoPlaceholder: 'קוד קופון (START20)',
      applyPromo: 'החל',
      promoAppliedTitle: 'הקופון הופעל!',
      promoInvalidTitle: 'קוד קופון שגוי',
      promoInvalidDesc: 'נסו את הקוד START20 להנחה של 25 ₪.',
      checkoutButton: 'ביצוע הזמנה',
      securePaymentNote: 'תשלום מאובטח באמצעות Bit, Apple Pay או כרטיס אשראי',
      paymentConfirmationNote: 'חיוב מתבצע לאחר אישור בית העסק',
      freeDeliveryProgress: 'למשלוח חינם:',
      freeDeliveryUnlocked: 'זכאי למשלוח חינם!',
      drawerTitle: 'סל קניות',
      itemWord1: 'פריט',
      itemWordFew: 'פריטים',
      itemWordMany: 'פריטים',
      drawerEmptyDesc: 'בחרו מוצרים טריים, לחם מחמצת או גאדג\'טים מהקטלוג.',
      goToCatalog: 'מעבר לקטלוג',
      orderNow: 'לתשלום',
      demoPaymentSafety: 'תשלום מאובטח (Bit, Apple Pay, ישראכרט)',
    },
    profile: {
      activeClient: 'לקוח פעיל',
      switchAccount: 'החלפת חשבון',
      logout: 'התנתקות',
      savedAddresses: 'כתובות שמורות',
      deliveryAddresses: 'כתובות שמורות',
      manage: 'ניהול',
      defaultBadge: 'ברירת מחדל',
      appSettings: 'הגדרות אפליקציה',
      languageSetting: 'שפת ממשק',
      themeSetting: 'ערכת נושא',
      themeDark: 'מצב כהה פעיל',
      themeLight: 'מצב בהיר פעיל',
      switchTheme: 'החלף',
      pwaSetting: 'אפליקציית PWA',
      pwaDesc: 'גישה מהירה ממסך הבית ועבודה במצב לא מקוון',
      partnerPortalsTitle: 'אזורי שותפים וניהול',
      partnerPortalsDesc: 'מעבר בין סביבות העבודה השונות של QIVENTRA:',
      vendorPortalTitle: 'אזור מוכר',
      vendorPortalDesc: 'הזמנות החנות, קטלוג וניהול מלאי',
      courierPortalTitle: 'מרכז שליחים',
      courierPortalDesc: 'מסלולים, משמרות ויתרת תשלומים',
      adminPortalTitle: 'ניהול מערכת',
      adminPortalDesc: 'סטטיסטיקת פלטפורמה ובקרת איכות',
      vendorTitle: 'אזור מוכר',
      vendorDesc: 'הזמנות החנות, קטלוג וניהול מלאי',
      courierTitle: 'מרכז שליחים',
      courierDesc: 'מסלולים, משמרות ויתרת תשלומים',
      adminTitle: 'ניהול מערכת',
      adminDesc: 'סטטיסטיקת פלטפורמה ובקרת איכות',
    },
    store: {
      backToCatalog: 'חזרה לקטלוג',
      ecoCertified: 'מוסמך אקו וירוק',
      shareStore: 'שתף חנות',
      linkCopied: 'הקישור הועתק ללוח',
      ratingLabel: 'דירוג',
      courierDeliveryLabel: 'משלוח שליחים',
      deliveryCostLabel: 'עלות משלוח',
      minOrderPrefix: 'מינימום הזמנה',
      storeAssortment: 'מגוון החנות',
    },
    vendor: {
      portalTitle: 'פורטל מוכר',
      partnerSince: 'שותף מאז 2024',
      acceptanceOpenToast: 'קבלת הזמנות נפתחה',
      acceptancePausedToast: 'החנות בהשהייה',
      acceptanceOpenMsg: 'החנות זמינה כעת ללקוחות באזור.',
      acceptancePausedMsg: 'קבלת הזמנות חדשות הושהתה זמנית.',
      acceptanceActive: 'קבלת הזמנות פעילה',
      acceptancePaused: 'החנות בהשהייה',
      revenueToday: 'הכנסות היום',
      vsLastWeek: 'לעומת שבוע שעבר',
      ordersShift: 'הזמנות במשמרת',
      avgPrepTime: 'ממוצע 2.8 דק׳ להכנה',
      avgTicket: 'סל ממוצע',
      optRange: 'טווח אופטימלי',
      ratingLabel: 'דירוג בית עסק',
      posReviews: 'ביקורות חיוביות',
      liveOrdersQueue: 'תור הזמנות פעיל',
      autoRefresh: 'עדכון אוטומטי כל 15 שניות',
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
      onTime: 'בזמן',
      batteryLevel: 'רמת סוללה',
      hoursLeft: 'שעות פעילות',
      currentTask: 'הזמנה נוכחית בטיפול',
      headingToStore: 'בדרך לאיסוף מהחנות',
      headingToClient: 'בדרך ללקוח',
      pointAPickup: 'נקודה א׳: איסוף מהחנות',
      pointBDelivery: 'נקודה ב׳: מסירה ללקוח',
      orderPickedUpTitle: 'ההזמנה נאספה מהחנות',
      orderPickedUpMsg: 'המסלול עודכן לכתובת הלקוח.',
      orderDeliveredTitle: 'ההזמנה נמסרה בהצלחה!',
      payoutCredited: 'תשלום נוסף ליתרה שלך',
      findingNextOrderTitle: 'חיפוש ההזמנה הבאה',
      findingNextOrderMsg: 'הוקצתה הזמנה חדשה בסביבה.',
      confirmPickup: 'אישור איסוף מהחנות',
      confirmDelivery: 'אישור מסירה ללקוח',
      acceptNewOrder: 'קבלת הזמנה חדשה באזור',
    },
    admin: {
      adminHubTitle: 'מרכז ניהול ובקרה QIVENTRA ישראל',
      adminHubSubtitle: 'ניטור פעילות מסחרית שכונתית ואיזון ציי השליחים',
      monitoringCenter: 'מרכז ניטור',
      allSystemsOperational: 'כל המערכות פועלות כסדרן (100% SLA)',
      platformGMV: 'מחזור פלטפורמה (GMV)',
      todayLabel: 'היום',
      activeMerchants: 'בתי עסק פעילים',
      storesCount: 'חנויות',
      inDistricts: 'ב-4 אזורים בעיר',
      couriersOnShift: 'שליחים במשמרת',
      onLine: 'מחוברים',
      ecoFleet: 'צי ירוק',
      avgDeliveryTime: 'זמן משלוח ממוצע',
      minLabel: 'דק׳',
      targetSLA: 'יעד שירות: מתחת ל-30 דק׳',
      merchantApplications: 'בקשות הצטרפות של בתי עסק',
      verificationQueue: 'תור אימות',
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
      previewBeforeSave: 'תצוגה מקדימה לפני שמירה',
      actualDimensions: 'ממדים בפועל',
      formatAndSizeCheck: 'פורמט מאושר (PNG/WebP/SVG, עד 10MB)',
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
      newAddressTitle: 'הוספת כתובת חדשה',
      inputPlaceholder: 'תל אביב, דיזנגוף 105, דירה 4',
      applyBtn: 'הגדר כתובת',
      cancelBtn: 'ביטול',
      otherAddressBtn: 'הזנת כתובת אחרת',
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
      demoNotice: 'גישת הדגמה ללא צורך ב-SMS',
      roleSwitchedMsg: 'מחובר כעת בתפקיד',
    },
    productCard: {
      addToCart: 'הוסף לסל',
      inCart: 'בסל',
      decrease: 'הפחת כמות',
      increase: 'הגדל כמות',
      topBadge: 'מוביל',
      newBadge: 'חדש',
    },
    storeCard: {
      eco: 'ירוק',
      promo: 'מבצע',
      freeDelivery: 'משלוח חינם',
      deliveryPrice: 'משלוח',
      minOrder: 'החל מ-',
    },
    footer: {
      brandStatement: 'פלטפורמה חדשנית למסחר מקומי ומשלוחי אקספרס בישראל. מחברים את מיטב החנויות השכונתיות, המאפיות והמשקים באקו-סיסטם דיגיטלי מתקדם.',
      deliveryTime: 'משלוח מ-25 דק׳',
      verifiedMerchants: 'עסקים מאומתים',
      pwaReady: 'מוכן כ-PWA',
      forCustomers: 'ללקוחות',
      categoriesCatalog: 'קטלוג קטגוריות',
      productSearch: 'חיפוש מוצרים',
      activeOrdersTracker: 'הזמנות ומעקב חי',
      userProfile: 'פרופיל אישי',
      forBusiness: 'לעסקים ושותפים',
      vendorAccount: 'אזור מוכר',
      courierService: 'שירות שליחים',
      adminHub: 'ניהול מערכת',
      connectIn24h: 'חיבור חנות תוך 24 שעות',
      ecosystemTitle: 'אקוסיסטם',
      ecosystemDesc: 'QIVENTRA היא פלטפורמת מסחר היפר-לוקאלית בתקן Progressive Web App המותאמת לשוק הישראלי.',
      versionBadgeTitle: 'QIVENTRA 2.0:',
      versionBadgeDesc: 'לוקליזציה מלאה לשוק הישראלי (₪ ILS, Asia/Jerusalem, 3 שפות, תמיכה ב-RTL), תמיכה ב-Bit/Apple Pay ונכסי מותג רשמיים.',
      allRightsReserved: 'כל הזכויות שמורות.',
      privacy: 'פרטיות',
      terms: 'תנאי שימוש',
      systemStatus: 'סטטוס: 100% פעיל',
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
      withCourier: 'צ\'אט עם השליח',
      backToList: 'חזרה לשיחות',
    },
    common: {
      currencySymbol: '₪',
      currencyCode: 'ILS',
      minutes: 'דק׳',
      km: 'ק״מ',
      items: 'יח׳',
      pieces: 'יח׳',
      save: 'שמור',
      cancel: 'ביטול',
    },
  },
  en: {
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
      deliveryTo: 'Delivery to',
      delivery: 'Delivery',
      searchPlaceholder: 'Search stores, groceries, dishes...',
      clear: 'Clear',
      selectAddress: 'Select delivery address',
      toggleThemeLight: 'Switch to light mode',
      toggleThemeDark: 'Switch to dark mode',
    },
    home: {
      heroTag: 'Express delivery from 25 min in Tel Aviv & Gush Dan',
      heroTitle: 'Local stores, fresh market groceries & delicacies at your door',
      heroSubtitle: 'Artisan bakeries, organic farms, pharmacies, and tech essentials in one single app with reliable doorstep express delivery.',
      deliveryAddress: 'Delivery address',
      searchPlaceholder: 'What to deliver: fresh challah, avocado, cheese, coffee...',
      searchButton: 'Search',
      quickTagsTitle: 'Quick:',
      promo1Code: 'Code: START20',
      promo1Title: '20 ₪ OFF on your first order',
      promo1Desc: 'For orders over 80 ₪ across all stores',
      promo2Tag: 'Eco Initiative',
      promo2Title: 'Free eco-delivery by courier',
      promo2Desc: 'On quiet electric bikes with zero emissions',
      promo3Tag: 'Local Bakeries',
      promo3Title: 'Fresh breakfast pastries',
      promo3Desc: 'Crisp sourdough bread & warm croissants in 25 min',
      categoriesTitle: 'Shop by Category',
      categoriesSubtitle: 'Everything you need from trusted local merchants',
      viewAllCatalog: 'Full catalog',
      expressTitle: 'Fast delivery in 15–25 minutes',
      expressBadge: 'Express',
      viewAll: 'View all',
      popularStoresTitle: 'Popular stores nearby',
      radiusBadge: 'Within 3 km',
      popularStoresSubtitle: 'Dedicated QIVENTRA couriers and verified merchant quality',
      filterAll: 'All',
      filterFarm: 'Farm & Market',
      filterBakery: 'Bakeries & Cafes',
      filterGadgets: 'Gadgets',
      bestsellersTitle: 'Best Sellers & New Arrivals',
      bestsellersBadge: 'Top Choice',
      bestsellersSubtitle: 'Most ordered items this week',
      toCatalog: 'To catalog',
      activeOrderPrefix: 'Active Order',
      simulateStep: 'Simulate Step',
      openTracker: 'Open tracker →',
      smartTrackingTitle: 'Smart real-time tracking',
      smartTrackingHeadline: 'Live delivery tracking at every step',
      smartTrackingDesc: 'Follow confirmation, assembly, and courier movement across the city with minute-by-minute accuracy.',
      statAvgTime: 'Average Time',
      statEtaAccuracy: 'ETA Accuracy',
      statEcoFleet: 'Eco Transport',
      courierOnWay: 'Courier en route to address',
      timelinePacked: 'Order prepared at Carmel Fresh Market',
      timelineCourier: 'Courier Tomer on electric bike',
      timelineLocation: 'Riding along Rothschild Blvd, 900m to you',
    },
    hero: {
      badge: 'Express delivery from 25 min in Tel Aviv & Gush Dan',
      title: 'Local stores, fresh market groceries & delicacies at your door',
      subtitle: 'Artisan bakeries, organic farms, pharmacies, and tech essentials in one single app with reliable doorstep express delivery.',
      searchPlaceholder: 'What to deliver: challah, olives, avocado, coffee, gadgets...',
      searchButton: 'Search',
      quickTagsLabel: 'Quick:',
      quickTags: ['Fresh Challah', 'Hass Avocado', 'Olive Oil', 'Goat Cheese', 'Specialty Coffee'],
      promo1Badge: 'Promo: START20',
      promo1Title: '20 ₪ OFF on your first order',
      promo1Subtitle: 'For orders over 80 ₪ across all stores',
      promo2Badge: 'Eco Initiative',
      promo2Title: 'Free eco-delivery by courier',
      promo2Subtitle: 'On quiet electric bikes with zero emissions',
      promo3Badge: 'Local Bakeries',
      promo3Title: 'Fresh breakfast pastries',
      promo3Subtitle: 'Crisp sourdough bread & warm croissants in 25 min',
      categoriesTitle: 'Shop by Category',
      categoriesSubtitle: 'Everything you need from trusted local merchants',
      allCatalog: 'Full catalog',
      expressDeliveryTitle: 'Fast delivery in 15–25 minutes',
      expressBadge: 'Express',
      viewAll: 'View all',
      popularStoresTitle: 'Popular stores nearby',
      radiusBadge: 'Within 3 km',
      popularStoresSubtitle: 'Dedicated QIVENTRA couriers and verified merchant quality',
      filterAll: 'All',
      filterGrocery: 'Farm & Market',
      filterBakery: 'Bakeries & Cafes',
      filterTech: 'Gadgets',
      bestSellersTitle: 'Best Sellers & New Arrivals',
      topChoiceBadge: 'Top Choice',
      bestSellersSubtitle: 'Most ordered items this week',
      toCatalog: 'To catalog',
      activeOrderBadge: 'Active Order',
      orderSimulatorStep: 'Simulate Step',
      orderTracker: 'Order Tracker',
      liveTrackingBadge: 'Smart real-time tracking',
      liveTrackingTitle: 'Live delivery tracking at every step',
      liveTrackingSubtitle: 'Follow confirmation, assembly, and courier movement across the city with minute-by-minute accuracy.',
      avgTime: 'Average Time',
      avgTimeValue: '26 min',
      etaAccuracy: 'ETA Accuracy',
      etaAccuracyValue: '99.4%',
      ecoTransport: 'Eco Transport',
      ecoTransportValue: '100%',
      courierEnRoute: 'Courier en route to address',
      orderAssembled: 'Order prepared at store',
      orderAssembledStore: '14:15 • Carmel Fresh Market',
      courierNameEbike: 'Courier Tomer on electric bike',
      courierMovingOn: 'Riding along Rothschild Blvd, 900m to you',
      openTracker: 'Open tracker →',
    },
    catalog: {
      title: 'Neighborhood Stores & Markets',
      allPlaces: 'places',
      defaultSubtitle: 'All local shops, boutique bakeries, and organic farms with delivery',
      storesTab: 'Stores',
      productsTab: 'Products',
      tabStores: 'Stores',
      tabProducts: 'Products',
      allCategories: 'All Categories',
      allProducts: 'All Products',
      freeDelivery: 'Free Delivery',
      ecoFarm: 'Eco & Farm',
      filterEco: 'Eco & Farm',
      filterFreeDelivery: 'Free Delivery',
      sortBy: 'Sort by:',
      sortLabel: 'Sort',
      sortRating: 'By Rating',
      sortDeliverySpeed: 'By Speed',
      sortMinOrder: 'By Min Order',
      byRating: 'By Rating',
      byDeliveryTime: 'By Speed',
      byMinOrder: 'By Min Order',
      noStoresTitle: 'No stores found',
      noStoresDesc: 'Try resetting your filters or select a different category.',
      emptyStoresTitle: 'No stores found',
      emptyStoresDesc: 'Try resetting your filters or select a different category.',
      resetFilters: 'Reset filters',
      noProductsTitle: 'No products found',
      noProductsDesc: 'No products found matching these filters in this category.',
      emptyProductsTitle: 'No products found',
      emptyProductsDesc: 'No products found matching these filters in this category.',
      allProductsBtn: 'All products',
    },
    search: {
      title: 'Search Neighborhood Stores & Products',
      subtitle: 'Instant search across fresh groceries, pastries, tech, and local brands',
      inputPlaceholder: 'Search product, dish, or store name...',
      popularSearches: 'Popular searches:',
      trendingSearch: 'Trending searches',
      allCategories: 'All categories',
      onlyEco: '🍃 Eco Only',
      startTypingTitle: 'Start typing your search',
      startTypingSubtitle: 'We will find items in nearby stores and calculate precise delivery time.',
      startTypingDesc: 'We will find items in nearby stores and calculate precise delivery time.',
      noResultsTitle: 'No results found',
      noResultsSubtitle: 'Try checking your spelling, changing terms, or browsing categories in the catalog.',
      noResultsDesc: 'Try checking your spelling, changing terms, or browsing categories in the catalog.',
      openCatalog: 'Open catalog',
      storesFound: 'Stores',
      productsFound: 'Products',
    },
    orders: {
      title: 'Orders & Live Delivery Tracker',
      subtitle: 'Real-time active order tracking and purchase history',
      deliveredBadge: 'Delivered',
      activeDeliveryBadge: 'Active Delivery',
      statusLabel: 'Status',
      estimatedTimeLabel: 'Estimated Time',
      estTimeLabel: 'Estimated Time',
      completed: 'Completed',
      statusCompleted: 'Completed',
      statusDelivered: 'Delivered',
      stepReceived: 'Received',
      stepPreparing: 'Preparing',
      stepOnTheWay: 'On the way',
      stepAtDoor: 'At door',
      step1: '1. Received',
      step2: '2. Preparing',
      step3: '3. On the way',
      step4: '4. At door',
      deliveriesCount: 'deliveries',
      callCourier: 'Call courier',
      chatWithCourier: 'Chat with courier',
      chat: 'Chat',
      chatSoon: 'Chat feature will be available in the next release.',
      orderItemsTitle: 'Order Items',
      orderComposition: 'Order Items',
      total: 'Total',
      simStepDesc: 'Interactive status stepper simulation',
      simulatorHint: 'Interactive status stepper simulation',
      nextStepBtn: 'Next Courier Step',
      historyTitle: 'Order History',
      completedStatus: 'Completed',
      repeatOrder: 'Reorder',
      repeatOrderToastTitle: 'Added to cart',
      repeatOrderToastMsg: 'Order items reloaded into cart',
      placedTitle: 'Order placed successfully!',
      placedMessage: 'Your order has been sent to the store and courier.',
    },
    cart: {
      title: 'Checkout & Review',
      checkoutTitle: 'Checkout',
      itemsCount: 'items in your cart',
      itemsCountLabel: 'Items',
      clearAll: 'Clear all',
      emptyTitle: 'Your cart is empty',
      emptyDesc: 'Add fresh market groceries, artisan sourdough, or gadgets from local stores.',
      goToShopping: 'Start shopping',
      exploreCatalog: 'Explore catalog',
      deliverTo: 'Deliver to:',
      deliveryDestination: 'Deliver to',
      changeAddress: 'Change',
      orderSummary: 'Order Summary',
      itemsSubtotal: 'Items Subtotal',
      promoDiscount: 'Promo Discount',
      promoDiscountDesc: 'Discount applied',
      deliveryFee: 'Courier Delivery',
      courierDelivery: 'Courier Delivery',
      free: 'Free',
      totalToPay: 'Total Amount',
      totalPayable: 'Total Payable',
      payOrderPrefix: 'Pay',
      promoPlaceholder: 'Promo code (START20)',
      applyPromo: 'Apply',
      promoAppliedTitle: 'Promo code applied!',
      promoInvalidTitle: 'Invalid promo code',
      promoInvalidDesc: 'Try START20 for 25 ₪ discount.',
      checkoutButton: 'Place Order',
      securePaymentNote: 'Pay with Bit, Apple Pay, or Credit Card after confirmation',
      paymentConfirmationNote: 'Payment processed after merchant confirmation',
      freeDeliveryProgress: 'For free delivery:',
      freeDeliveryUnlocked: 'Free delivery unlocked!',
      drawerTitle: 'Shopping Cart',
      itemWord1: 'item',
      itemWordFew: 'items',
      itemWordMany: 'items',
      drawerEmptyDesc: 'Add fresh farm groceries, bakery goods, or tech to get started.',
      goToCatalog: 'Go to catalog',
      orderNow: 'Checkout',
      demoPaymentSafety: 'Secure checkout (Bit, Apple Pay, Isracard)',
    },
    profile: {
      activeClient: 'Active Client',
      switchAccount: 'Switch Account',
      logout: 'Log Out',
      savedAddresses: 'Saved Addresses',
      deliveryAddresses: 'Saved Addresses',
      manage: 'Manage',
      defaultBadge: 'Default',
      appSettings: 'App Settings',
      languageSetting: 'Display Language',
      themeSetting: 'Theme',
      themeDark: 'Dark mode active',
      themeLight: 'Light mode active',
      switchTheme: 'Toggle',
      pwaSetting: 'Installable PWA',
      pwaDesc: 'Instant home-screen access and offline caching',
      partnerPortalsTitle: 'Partner Portals & Management',
      partnerPortalsDesc: 'Switch between specialized QIVENTRA workspaces:',
      vendorPortalTitle: 'Merchant Portal',
      vendorPortalDesc: 'Store orders, catalog, stock management',
      courierPortalTitle: 'Courier Hub',
      courierPortalDesc: 'Routes, active shifts, payout balance',
      adminPortalTitle: 'Admin Hub',
      adminPortalDesc: 'Platform analytics, store moderation',
      vendorTitle: 'Merchant Portal',
      vendorDesc: 'Store orders, catalog, stock management',
      courierTitle: 'Courier Hub',
      courierDesc: 'Routes, active shifts, payout balance',
      adminTitle: 'Admin Hub',
      adminDesc: 'Platform analytics, store moderation',
    },
    store: {
      backToCatalog: 'Back to catalog',
      ecoCertified: 'Eco-certified',
      shareStore: 'Share store',
      linkCopied: 'Link copied',
      ratingLabel: 'Rating',
      courierDeliveryLabel: 'Courier delivery',
      deliveryCostLabel: 'Delivery fee',
      minOrderPrefix: 'Min order',
      storeAssortment: 'Store Assortment',
    },
    vendor: {
      portalTitle: 'Merchant Hub',
      partnerSince: 'Partner since 2024',
      acceptanceOpenToast: 'Orders acceptance open',
      acceptancePausedToast: 'Store paused',
      acceptanceOpenMsg: 'Store is now visible to nearby customers.',
      acceptancePausedMsg: 'New orders are temporarily paused.',
      acceptanceActive: 'Accepting orders',
      acceptancePaused: 'Store paused',
      revenueToday: 'Today\'s Revenue',
      vsLastWeek: 'vs last week',
      ordersShift: 'Orders this shift',
      avgPrepTime: 'Avg. 2.8 min preparation',
      avgTicket: 'Average Order',
      optRange: 'Optimal range',
      ratingLabel: 'Merchant Rating',
      posReviews: 'positive reviews',
      liveOrdersQueue: 'Live Store Order Queue',
      autoRefresh: 'Auto updates every 15s',
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
      onTime: 'on time',
      batteryLevel: 'Battery Level',
      hoursLeft: 'hours of runtime',
      currentTask: 'Active Delivery Task',
      headingToStore: 'Heading to store',
      headingToClient: 'Heading to customer',
      pointAPickup: 'Point A: Store pickup',
      pointBDelivery: 'Point B: Dropoff customer',
      orderPickedUpTitle: 'Order picked up',
      orderPickedUpMsg: 'Route updated to customer address.',
      orderDeliveredTitle: 'Order delivered!',
      payoutCredited: 'Payout credited to your balance',
      findingNextOrderTitle: 'Searching for next order',
      findingNextOrderMsg: 'Assigned new nearby order.',
      confirmPickup: 'Confirm Store Pickup',
      confirmDelivery: 'Confirm Handover to Customer',
      acceptNewOrder: 'Accept Next Nearby Order',
    },
    admin: {
      adminHubTitle: 'QIVENTRA Israel Admin Hub',
      adminHubSubtitle: 'Real-time city commerce monitoring & courier fleet balance',
      monitoringCenter: 'Monitoring Center',
      allSystemsOperational: 'All systems operational (100% SLA)',
      platformGMV: 'Platform Volume (GMV)',
      todayLabel: 'today',
      activeMerchants: 'Active Merchants',
      storesCount: 'stores',
      inDistricts: 'across 4 city areas',
      couriersOnShift: 'Couriers on Shift',
      onLine: 'online',
      ecoFleet: 'eco-fleet',
      avgDeliveryTime: 'Average Delivery Time',
      minLabel: 'min',
      targetSLA: 'Target SLA: < 30 min',
      merchantApplications: 'Merchant Onboarding Requests',
      verificationQueue: 'Verification Queue',
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
      previewBeforeSave: 'Preview Before Saving',
      actualDimensions: 'Actual Dimensions',
      formatAndSizeCheck: 'Allowed Formats (PNG/WebP/SVG, up to 10MB)',
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
      newAddressTitle: 'Add New Address',
      inputPlaceholder: 'Tel Aviv, Dizengoff St 105, Apt 4',
      applyBtn: 'Apply address',
      cancelBtn: 'Cancel',
      otherAddressBtn: 'Enter another address',
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
      demoNotice: 'Demonstration access without SMS confirmation',
      roleSwitchedMsg: 'Logged in with role',
    },
    productCard: {
      addToCart: 'Add to cart',
      inCart: 'In cart',
      decrease: 'Decrease quantity',
      increase: 'Increase quantity',
      topBadge: 'Top',
      newBadge: 'New',
    },
    storeCard: {
      eco: 'Eco',
      promo: 'Promo',
      freeDelivery: 'Free Delivery',
      deliveryPrice: 'Delivery',
      minOrder: 'from',
    },
    footer: {
      brandStatement: 'Next-generation local commerce and express delivery platform in Israel. Connecting the best neighborhood markets, bakeries, pharmacies, and creators in one digital ecosystem.',
      deliveryTime: 'Delivery from 25 min',
      verifiedMerchants: 'Verified merchants',
      pwaReady: 'PWA Ready',
      forCustomers: 'Customers',
      categoriesCatalog: 'Category Catalog',
      productSearch: 'Product Search',
      activeOrdersTracker: 'Active Orders & Tracker',
      userProfile: 'User Profile',
      forBusiness: 'Business & Partners',
      vendorAccount: 'Merchant Portal',
      courierService: 'Courier Hub',
      adminHub: 'Admin Hub',
      connectIn24h: 'Store onboarding in 24 hours',
      ecosystemTitle: 'Ecosystem',
      ecosystemDesc: 'QIVENTRA is a modern offline-first PWA local commerce platform tailored for the Israeli market.',
      versionBadgeTitle: 'QIVENTRA 2.0:',
      versionBadgeDesc: 'Full Israeli localization (₪ ILS, Asia/Jerusalem, 3 languages, RTL support), Bit/Apple Pay readiness, and official brand assets.',
      allRightsReserved: 'All rights reserved.',
      privacy: 'Privacy',
      terms: 'Terms',
      systemStatus: 'Status: 100% Online',
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
      withCourier: 'Chat with Courier',
      backToList: 'Back to conversations',
    },
    common: {
      currencySymbol: '₪',
      currencyCode: 'ILS',
      minutes: 'min',
      km: 'km',
      items: 'pcs',
      pieces: 'pcs',
      save: 'Save',
      cancel: 'Cancel',
    },
  },
  ru: {
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
      deliveryTo: 'Доставка',
      delivery: 'Доставка',
      searchPlaceholder: 'Поиск магазинов, продуктов, блюд...',
      clear: 'Очистить',
      selectAddress: 'Выбрать адрес доставки',
      toggleThemeLight: 'Включить светлую тему',
      toggleThemeDark: 'Включить тёмную тему',
    },
    home: {
      heroTag: 'Экспресс-доставка от 25 минут в Тель-Авиве и Гуш-Дане',
      heroTitle: 'Локальные магазины, свежие продукты и деликатесы у вас дома',
      heroSubtitle: 'Фермерские лавки, ремесленные пекарни, аптеки и гаджеты в одном приложении с бережной экспресс-доставкой до двери.',
      deliveryAddress: 'Адрес доставки',
      searchPlaceholder: 'Что доставить: хала, оливки, авокадо, кофе, гаджеты...',
      searchButton: 'Найти',
      quickTagsTitle: 'Быстро:',
      promo1Code: 'Промокод: START20',
      promo1Title: 'Скидка 20 ₪ на первый заказ',
      promo1Desc: 'При заказе от 80 ₪ во всех магазинах',
      promo2Tag: 'Эко-инициатива',
      promo2Title: 'Бесплатная эко-доставка курьером',
      promo2Desc: 'На электробайках без шума и выбросов',
      promo3Tag: 'Пекарни района',
      promo3Title: 'Свежая выпечка к завтраку',
      promo3Desc: 'Хрустящий хлеб и круассаны из печи за 25 минут',
      categoriesTitle: 'Категории товаров',
      categoriesSubtitle: 'Всё необходимое от проверенных локальных мерчантов',
      viewAllCatalog: 'Весь каталог',
      expressTitle: 'Быстрая доставка за 15–25 минут',
      expressBadge: 'Экспресс',
      viewAll: 'Смотреть все',
      popularStoresTitle: 'Популярные магазины поблизости',
      radiusBadge: 'В радиусе 3 км',
      popularStoresSubtitle: 'Собственные курьеры QIVENTRA и проверенное качество',
      filterAll: 'Все',
      filterFarm: 'Ферма & Рынок',
      filterBakery: 'Пекарни & Кафе',
      filterGadgets: 'Гаджеты',
      bestsellersTitle: 'Хиты продаж и новинки',
      bestsellersBadge: 'Топ выбор',
      bestsellersSubtitle: 'Самые заказываемые позиции на этой неделе',
      toCatalog: 'В каталог',
      activeOrderPrefix: 'Активный заказ',
      simulateStep: 'Симуляция шага',
      openTracker: 'Открыть трекер →',
      smartTrackingTitle: 'Интеллектуальный трекинг в реальном времени',
      smartTrackingHeadline: 'Контроль доставки на каждом этапе',
      smartTrackingDesc: 'Следите за подтверждением, сборкой и перемещением курьера по городу с точностью до минуты. Все этапы синхронизируются в реальном времени.',
      statAvgTime: 'Среднее время',
      statEtaAccuracy: 'Точность ETA',
      statEcoFleet: 'Эко-транспорт',
      courierOnWay: 'Курьер в пути к адресу',
      timelinePacked: 'Заказ собран в лавке Carmel Fresh Market',
      timelineCourier: 'Курьер Томер на электробайке',
      timelineLocation: 'Движется по бул. Ротшильд, 900 м до вас',
    },
    hero: {
      badge: 'Экспресс-доставка от 25 минут в Тель-Авиве и Гуш-Дане',
      title: 'Локальные магазины, свежие продукты и деликатесы у вас дома',
      subtitle: 'Фермерские лавки, ремесленные пекарни, аптеки и гаджеты в одном приложении с бережной экспресс-доставкой до двери.',
      searchPlaceholder: 'Что доставить: хала, оливки, авокадо, кофе, гаджеты...',
      searchButton: 'Найти',
      quickTagsLabel: 'Быстро:',
      quickTags: ['Свежая хала', 'Авокадо Hass', 'Оливковое масло', 'Козий сыр', 'Спешелти кофе'],
      promo1Badge: 'Промокод: START20',
      promo1Title: 'Скидка 20 ₪ на первый заказ',
      promo1Subtitle: 'При заказе от 80 ₪ во всех магазинах',
      promo2Badge: 'Эко-инициатива',
      promo2Title: 'Бесплатная эко-доставка курьером',
      promo2Subtitle: 'На электробайках без шума и выбросов',
      promo3Badge: 'Пекарни района',
      promo3Title: 'Свежая выпечка к завтраку',
      promo3Subtitle: 'Хрустящий хлеб и круассаны из печи за 25 минут',
      categoriesTitle: 'Категории товаров',
      categoriesSubtitle: 'Всё необходимое от проверенных локальных мерчантов',
      allCatalog: 'Весь каталог',
      expressDeliveryTitle: 'Быстрая доставка за 15–25 минут',
      expressBadge: 'Экспресс',
      viewAll: 'Смотреть все',
      popularStoresTitle: 'Популярные магазины поблизости',
      radiusBadge: 'В радиусе 3 км',
      popularStoresSubtitle: 'Собственные курьеры QIVENTRA и проверенное качество',
      filterAll: 'Все',
      filterGrocery: 'Ферма & Рынок',
      filterBakery: 'Пекарни & Кафе',
      filterTech: 'Гаджеты',
      bestSellersTitle: 'Хиты продаж и новинки',
      topChoiceBadge: 'Топ выбор',
      bestSellersSubtitle: 'Самые заказываемые позиции на этой неделе',
      toCatalog: 'В каталог',
      activeOrderBadge: 'Активный заказ',
      orderSimulatorStep: 'Симуляция шага',
      orderTracker: 'Трекер заказа',
      liveTrackingBadge: 'Интеллектуальный трекинг в реальном времени',
      liveTrackingTitle: 'Контроль доставки на каждом этапе',
      liveTrackingSubtitle: 'Следите за подтверждением, сборкой и перемещением курьера по городу с точностью до минуты. Все этапы синхронизируются в реальном времени.',
      avgTime: 'Среднее время',
      avgTimeValue: '26 мин',
      etaAccuracy: 'Точность ETA',
      etaAccuracyValue: '99.4%',
      ecoTransport: 'Эко-транспорт',
      ecoTransportValue: '100%',
      courierEnRoute: 'Курьер в пути к адресу',
      orderAssembled: 'Заказ собран в лавке',
      orderAssembledStore: '14:15 • Carmel Fresh Market',
      courierNameEbike: 'Курьер Томер на электробайке',
      courierMovingOn: 'Движется по бул. Ротшильд, 900 м до вас',
      openTracker: 'Открыть трекер →',
    },
    catalog: {
      title: 'Каталог районов и магазинов',
      allPlaces: 'мест',
      defaultSubtitle: 'Все категории локальных магазинов, ферм и мастерских с доставкой',
      storesTab: 'Магазины',
      productsTab: 'Товары',
      tabStores: 'Магазины',
      tabProducts: 'Товары',
      allCategories: 'Все категории',
      allProducts: 'Все товары',
      freeDelivery: 'Бесплатная доставка',
      ecoFarm: 'Эко & Ферма',
      filterEco: 'Эко & Ферма',
      filterFreeDelivery: 'Бесплатная доставка',
      sortBy: 'Сортировка:',
      sortLabel: 'Сортировка',
      sortRating: 'По рейтингу',
      sortDeliverySpeed: 'По скорости',
      sortMinOrder: 'По мин. заказу',
      byRating: 'По рейтингу',
      byDeliveryTime: 'По скорости доставки',
      byMinOrder: 'По минимальному чеку',
      noStoresTitle: 'Магазины не найдены',
      noStoresDesc: 'Попробуйте сбросить выбранные фильтры или выберите другую категорию.',
      emptyStoresTitle: 'Магазины не найдены',
      emptyStoresDesc: 'Попробуйте сбросить выбранные фильтры или выберите другую категорию.',
      resetFilters: 'Сбросить фильтры',
      noProductsTitle: 'Товары не найдены',
      noProductsDesc: 'В этой категории пока нет товаров с указанными параметрами.',
      emptyProductsTitle: 'Товары не найдены',
      emptyProductsDesc: 'В этой категории пока нет товаров с указанными параметрами.',
      allProductsBtn: 'Все товары',
    },
    search: {
      title: 'Поиск по магазинам и товарам района',
      subtitle: 'Мгновенный поиск продуктов, выпечки, техники и локальных брендов',
      inputPlaceholder: 'Введите название товара, блюда или магазина...',
      popularSearches: 'Часто ищут:',
      trendingSearch: 'Часто ищут',
      allCategories: 'Все категории',
      onlyEco: '🍃 Только Эко',
      startTypingTitle: 'Начните вводить поисковый запрос',
      startTypingSubtitle: 'Мы найдём нужные товары в ближайших магазинах и рассчитаем точное время доставки.',
      startTypingDesc: 'Мы найдём нужные товары в ближайших магазинах и рассчитаем точное время доставки.',
      noResultsTitle: 'Ничего не найдено',
      noResultsSubtitle: 'Попробуйте изменить формулировку, проверить опечатки или выберите категорию в каталоге.',
      noResultsDesc: 'Попробуйте изменить формулировку, проверить опечатки или выберите категорию в каталоге.',
      openCatalog: 'Открыть каталог',
      storesFound: 'Магазины',
      productsFound: 'Товары',
    },
    orders: {
      title: 'Заказы и трекер доставки',
      subtitle: 'Отслеживание активных доставок в режиме реального времени и история покупок',
      deliveredBadge: 'Заказ доставлен',
      activeDeliveryBadge: 'Активная доставка',
      statusLabel: 'Статус',
      estimatedTimeLabel: 'Ориентировочное время',
      estTimeLabel: 'Ориентировочное время',
      completed: 'Завершено',
      statusCompleted: 'Завершено',
      statusDelivered: 'Заказ доставлен',
      stepReceived: 'Принят',
      stepPreparing: 'Сборка',
      stepOnTheWay: 'В пути',
      stepAtDoor: 'У двери',
      step1: '1. Принят',
      step2: '2. Сборка',
      step3: '3. В пути',
      step4: '4. У двери',
      deliveriesCount: 'доставок',
      callCourier: 'Позвонить',
      chatWithCourier: 'Чат с курьером',
      chat: 'Чат',
      chatSoon: 'Функция чата будет доступна на следующем этапе.',
      orderItemsTitle: 'Состав заказа',
      orderComposition: 'Состав заказа',
      total: 'Итого',
      simStepDesc: 'Интерактивная симуляция смены статуса',
      simulatorHint: 'Интерактивная симуляция смены статуса',
      nextStepBtn: 'Следующий шаг курьера',
      historyTitle: 'История предыдущих заказов',
      completedStatus: 'Выполнен',
      repeatOrder: 'Повторить',
      repeatOrderToastTitle: 'Позиции добавлены в корзину',
      repeatOrderToastMsg: 'Товары из заказа повторно загружены:',
      placedTitle: 'Заказ успешно создан!',
      placedMessage: 'Мы передали заказ курьеру и ресторанам.',
    },
    cart: {
      title: 'Оформление заказа',
      checkoutTitle: 'Оформление заказа',
      itemsCount: 'товаров в вашей корзине',
      itemsCountLabel: 'Товары',
      clearAll: 'Очистить всё',
      emptyTitle: 'В корзине пока пусто',
      emptyDesc: 'Добавьте свежие фермерские продукты, выпечку или технику из каталога районных магазинов.',
      goToShopping: 'Перейти к покупкам',
      exploreCatalog: 'Перейти в каталог',
      deliverTo: 'Куда доставить:',
      deliveryDestination: 'Куда доставить',
      changeAddress: 'Изменить',
      orderSummary: 'Итог заказа',
      itemsSubtotal: 'Товары',
      promoDiscount: 'Скидка по промокоду',
      promoDiscountDesc: 'Скидка начислена:',
      deliveryFee: 'Курьерская доставка',
      courierDelivery: 'Курьерская доставка',
      free: 'Бесплатно',
      totalToPay: 'К оплате',
      totalPayable: 'К оплате',
      payOrderPrefix: 'Оформить за',
      promoPlaceholder: 'Промокод (START20)',
      applyPromo: 'Применить',
      promoAppliedTitle: 'Промокод применён!',
      promoInvalidTitle: 'Неверный промокод',
      promoInvalidDesc: 'Попробуйте промокод START20 для скидки 25 ₪.',
      checkoutButton: 'Оформить заказ',
      securePaymentNote: 'Оплата Bit, Apple Pay или картой после подтверждения',
      paymentConfirmationNote: 'Оплата после подтверждения мерчантами',
      freeDeliveryProgress: 'До бесплатной доставки:',
      freeDeliveryUnlocked: 'Бесплатная доставка активна!',
      drawerTitle: 'Корзина покупок',
      itemWord1: 'товар',
      itemWordFew: 'товара',
      itemWordMany: 'товаров',
      drawerEmptyDesc: 'Выберите свежие продукты, ремесленный хлеб или гаджеты в каталоге.',
      goToCatalog: 'Перейти в каталог',
      orderNow: 'Оформить заказ',
      demoPaymentSafety: 'Безопасная оплата (Bit, Apple Pay, Isracard)',
    },
    profile: {
      activeClient: 'Активный клиент',
      switchAccount: 'Сменить аккаунт',
      logout: 'Выйти',
      savedAddresses: 'Адреса доставки',
      deliveryAddresses: 'Адреса доставки',
      manage: 'Управление',
      defaultBadge: 'По умолчанию',
      appSettings: 'Настройки приложения',
      languageSetting: 'Язык интерфейса',
      themeSetting: 'Тема оформления',
      themeDark: 'Тёмная тема активна',
      themeLight: 'Светлая тема активна',
      switchTheme: 'Переключить',
      pwaSetting: 'Устанавливаемое PWA',
      pwaDesc: 'Быстрый доступ с экрана "Домой" и офлайн кеш',
      partnerPortalsTitle: 'Партнёрские кабинеты и администрирование',
      partnerPortalsDesc: 'Переключение между специализированными рабочими пространствами платформы QIVENTRA:',
      vendorPortalTitle: 'Кабинет продавца',
      vendorPortalDesc: 'Заказы точки, каталог, стоп-лист',
      courierPortalTitle: 'Курьерский хаб',
      courierPortalDesc: 'Маршруты, смена, баланс выплат',
      adminPortalTitle: 'Администрация',
      adminPortalDesc: 'Статистика платформы, модерация',
      vendorTitle: 'Кабинет продавца',
      vendorDesc: 'Заказы точки, каталог, стоп-лист',
      courierTitle: 'Курьерский хаб',
      courierDesc: 'Маршруты, смена, баланс выплат',
      adminTitle: 'Администрация',
      adminDesc: 'Статистика платформы, модерация',
    },
    store: {
      backToCatalog: 'Вернуться в каталог',
      ecoCertified: 'Эко-сертифицирован',
      shareStore: 'Поделиться магазином',
      linkCopied: 'Ссылка скопирована',
      ratingLabel: 'Рейтинг',
      courierDeliveryLabel: 'Доставка курьером',
      deliveryCostLabel: 'Стоимость доставки',
      minOrderPrefix: 'Минимальный заказ',
      storeAssortment: 'Ассортимент магазина',
    },
    vendor: {
      portalTitle: 'Кабинет мерчанта',
      partnerSince: 'Партнёр с 2024',
      acceptanceOpenToast: 'Приём заказов открыт',
      acceptancePausedToast: 'Точка на паузе',
      acceptanceOpenMsg: 'Магазин снова виден покупателям района.',
      acceptancePausedMsg: 'Новые заказы временно приостановлены.',
      acceptanceActive: 'Приём заказов активен',
      acceptancePaused: 'Магазин на паузе',
      revenueToday: 'Выручка сегодня',
      vsLastWeek: 'к прошлой неделе',
      ordersShift: 'Заказов за смену',
      avgPrepTime: 'В среднем 2.8 мин на сборку',
      avgTicket: 'Средний чек',
      optRange: 'Оптимальный диапазон',
      ratingLabel: 'Рейтинг мерчанта',
      posReviews: 'положительных отзывов',
      liveOrdersQueue: 'Очередь текущих заказов точки',
      autoRefresh: 'Автоматическое обновление каждые 15 сек',
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
      onTime: 'вовремя',
      batteryLevel: 'Заряд батареи',
      hoursLeft: 'часа',
      currentTask: 'Текущий заказ в работе',
      headingToStore: 'Направляйтесь в магазин',
      headingToClient: 'Доставка клиенту',
      pointAPickup: 'Точка А: Забор заказа',
      pointBDelivery: 'Точка Б: Вручение клиенту',
      orderPickedUpTitle: 'Заказ получен в магазине',
      orderPickedUpMsg: 'Маршрут перестроен к адресу клиента.',
      orderDeliveredTitle: 'Заказ успешно вручен клиенту!',
      payoutCredited: 'Оплата начислена на ваш баланс',
      findingNextOrderTitle: 'Поиск следующего заказа',
      findingNextOrderMsg: 'Назначен новый заказ поблизости.',
      confirmPickup: 'Подтвердить забор заказа из магазина',
      confirmDelivery: 'Подтвердить передачу клиенту',
      acceptNewOrder: 'Принять новый заказ в районе',
    },
    admin: {
      adminHubTitle: 'Административный хаб QIVENTRA Израиль',
      adminHubSubtitle: 'Мониторинг торговой активности районов и логистического баланса',
      monitoringCenter: 'Центр мониторинга',
      allSystemsOperational: 'Все системы в норме (100% SLA)',
      platformGMV: 'Оборот платформы (GMV)',
      todayLabel: 'сегодня',
      activeMerchants: 'Активных мерчантов',
      storesCount: 'точек',
      inDistricts: 'в 4 районах города',
      couriersOnShift: 'Курьеров на смене',
      onLine: 'на линии',
      ecoFleet: 'эко-транспорт',
      avgDeliveryTime: 'Среднее время доставки',
      minLabel: 'мин',
      targetSLA: 'Целевой норматив: < 30 мин',
      merchantApplications: 'Заявки мерчантов на подключение',
      verificationQueue: 'Очередь верификации',
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
      previewBeforeSave: 'Предпросмотр до сохранения',
      actualDimensions: 'Реальные размеры',
      formatAndSizeCheck: 'Формат и размер (PNG/WebP/SVG, до 10 МБ)',
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
      newAddressTitle: 'Новый адрес',
      inputPlaceholder: 'Тель-Авив, ул. Дизенгоф, 105, кв. 4',
      applyBtn: 'Применить адрес',
      cancelBtn: 'Отмена',
      otherAddressBtn: 'Указать другой адрес',
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
      demoNotice: 'Демонстрационный доступ без SMS подтверждения',
      roleSwitchedMsg: 'Вы вошли как',
    },
    productCard: {
      addToCart: 'В корзину',
      inCart: 'В корзине',
      decrease: 'Уменьшить количество',
      increase: 'Увеличить количество',
      topBadge: 'Хит',
      newBadge: 'Новинка',
    },
    storeCard: {
      eco: 'Эко',
      promo: 'Акция',
      freeDelivery: 'Бесплатная доставка',
      deliveryPrice: 'Доставка',
      minOrder: 'от',
    },
    footer: {
      brandStatement: 'Современная платформа локальной торговли и экспресс-доставки в Израиле. Объединяем лучшие районные магазины, фермерские лавки, пекарни и производителей в единой цифровой экосистеме.',
      deliveryTime: 'Доставка от 25 мин',
      verifiedMerchants: 'Проверенные мерчанты',
      pwaReady: 'Работает как PWA',
      forCustomers: 'Покупателям',
      categoriesCatalog: 'Каталог категорий',
      productSearch: 'Поиск товаров',
      activeOrdersTracker: 'Активные заказы & Трекер',
      userProfile: 'Личный профиль',
      forBusiness: 'Бизнесу & Партнерам',
      vendorAccount: 'Кабинет продавца',
      courierService: 'Курьерская служба',
      adminHub: 'Административный хаб',
      connectIn24h: 'Подключение точки за 24 часа',
      ecosystemTitle: 'Экосистема',
      ecosystemDesc: 'QIVENTRA — это гибридная цифровая платформа локальной коммерции нового поколения по стандартам offline-first PWA в Израиле.',
      versionBadgeTitle: 'QIVENTRA 2.0:',
      versionBadgeDesc: 'Полная локализация для рынка Израиля (₪ ILS, Asia/Jerusalem, 3 языка, RTL), поддержка Bit/Apple Pay и официальные бренд-ассеты.',
      allRightsReserved: 'Все права защищены.',
      privacy: 'Конфиденциальность',
      terms: 'Условия',
      systemStatus: 'Статус: 100% Online',
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
      withCourier: 'Чат с курьером',
      backToList: 'Назад к списку',
    },
    common: {
      currencySymbol: '₪',
      currencyCode: 'ILS',
      minutes: 'мин',
      km: 'км',
      items: 'шт',
      pieces: 'шт',
      save: 'Сохранить',
      cancel: 'Отмена',
    },
  },
};
