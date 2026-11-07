import { PromotionError, PromotionStatus, PromotionType, ProductLabel } from '../data/promotions';

/**
 * Copy for shop promotions and product labels, exposed as `t.promotions`.
 * The Hebrew text was not written by a native speaker and needs proofreading.
 */
export interface PromotionStrings {
  labels: Record<ProductLabel, string>;
  types: Record<PromotionType, string>;
  statuses: Record<PromotionStatus, string>;
  errors: Record<PromotionError, string>;
  badge: {
    /** {n} is the percent. */
    percent: string;
    /** {amount} is the discount. */
    amount: string;
    freeDelivery: string;
    gift: string;
    productPrice: string;
  };
  conditions: {
    /** {amount} is the threshold. */
    from: string;
    /** {items} lists the goods. */
    on: string;
    /** {date} is the last day. */
    until: string;
    /** {from} and {to} are times. */
    hours: string;
    /** {to} is a time. */
    hoursUntil: string;
    /** {from} is a time. */
    hoursFrom: string;
    /** {gift} is the product. */
    gift: string;
    /** {price} is the new price. */
    price: string;
    notNow: string;
  };
  shop: {
    note: string;
    title: string;
  };
  order: {
    promotion: string;
    gift: string;
    /** {n} is the missing amount. */
    hintFree: string;
    /** {n} is the missing amount, {x} the discount. */
    hintDiscount: string;
    /** {n} is the missing amount, {gift} the product. */
    hintGift: string;
    /** {n} is the missing amount, {product} the product, {price} its new price. */
    hintPrice: string;
    /** {code} and {promo} are values. */
    codeWins: string;
    /** {code} and {promo} are values. */
    promoWins: string;
  };
  seller: {
    tabOrders: string;
    tabPromotions: string;
    tabLabels: string;
    store: string;
    storeNote: string;
    listNote: string;
    listTitle: string;
    labelsNote: string;
    labelsTitle: string;
    labelsHint: string;
    create: string;
    edit: string;
    pause: string;
    resume: string;
    remove: string;
    empty: string;
    emptyHint: string;
    resetDemo: string;
    resetLabels: string;
    resetTitle: string;
    resetBody: string;
    deleteTitle: string;
    /** {title} is the promotion's title. */
    deleteBody: string;
    savedTitle: string;
    deletedTitle: string;
    resetDoneTitle: string;
    formNew: string;
    formEdit: string;
    language: string;
    fieldTitle: string;
    fieldDescription: string;
    titleHint: string;
    fieldType: string;
    fieldPercent: string;
    fieldAmount: string;
    fieldGift: string;
    fieldProduct: string;
    fieldNewPrice: string;
    fieldMin: string;
    fieldScope: string;
    scopeHint: string;
    fieldStart: string;
    fieldEnd: string;
    fieldHoursFrom: string;
    fieldHoursTo: string;
    hoursHint: string;
    choose: string;
    preview: string;
    previewEmpty: string;
    save: string;
    fixErrors: string;
  };
}

export const promotionTranslations: Record<'ru' | 'en' | 'he', PromotionStrings> = {
  ru: {
    labels: {
      new: 'Новинка',
      hot: 'С пылу с жару',
      storePick: 'Выбор лавки',
      eco: 'Эко',
      seasonal: 'Сезонное',
      limited: 'Ограниченное количество',
    },
    types: {
      percent: 'Скидка, %',
      amount: 'Скидка, ₪',
      freeDelivery: 'Бесплатная доставка',
      gift: 'Подарок',
      productPrice: 'Цена на товар',
    },
    statuses: { active: 'Активна', scheduled: 'Ещё не началась', paused: 'На паузе', ended: 'Закончилась' },
    errors: {
      titleRequired: 'Заполните заголовок хотя бы на одном языке.',
      percentRange: 'Скидка должна быть от 1 до 90 %.',
      amountRange: 'Скидка должна быть больше 0 ₪ и меньше минимальной суммы заказа.',
      giftRequired: 'Выберите товар в подарок.',
      giftForeign: 'В подарок можно дать только товар этой лавки.',
      productRequired: 'Выберите товар.',
      newPriceRange: 'Новая цена должна быть больше 0 ₪ и меньше обычной цены товара.',
      minInvalid: 'Сумма не может быть отрицательной.',
      startRequired: 'Укажите дату начала.',
      endRequired: 'Укажите дату окончания.',
      endBeforeStart: 'Дата окончания должна быть позже даты начала.',
      hoursOrder: 'Время окончания должно быть позже времени начала.',
    },
    badge: {
      percent: '−{n}%',
      amount: '−{amount}',
      freeDelivery: 'Доставка бесплатно',
      gift: 'Подарок',
      productPrice: 'Цена ниже',
    },
    conditions: {
      from: 'при заказе от {amount}',
      on: 'на: {items}',
      until: 'по {date}',
      hours: 'ежедневно {from}–{to}',
      hoursUntil: 'ежедневно до {to}',
      hoursFrom: 'ежедневно с {from}',
      gift: 'в подарок: {gift}',
      price: 'новая цена: {price}',
      notNow: 'сейчас не действует',
    },
    shop: { note: 'выгодно', title: 'Акции лавки' },
    order: {
      promotion: 'Акция',
      gift: 'Подарок',
      hintFree: 'Добавьте ещё {n}, и доставка будет бесплатной.',
      hintDiscount: 'Добавьте ещё {n}, и получите скидку {x}.',
      hintGift: 'Добавьте ещё {n}, и получите подарок: {gift}.',
      hintPrice: 'Добавьте ещё {n}, и {product} будет по {price}.',
      codeWins: 'Применён промокод: он выгоднее акций ({code} против {promo}). Промокод и акции не суммируются.',
      promoWins: 'Промокод не применён: акции выгоднее или равны ему ({promo} против {code}). Промокод и акции не суммируются.',
    },
    seller: {
      tabOrders: 'Заказы',
      tabPromotions: 'Акции',
      tabLabels: 'Метки товаров',
      store: 'Лавка',
      storeNote: 'Демо: можно управлять любой лавкой',
      listNote: 'витрина',
      listTitle: 'Акции лавки',
      labelsNote: 'на карточках',
      labelsTitle: 'Метки товаров',
      labelsHint: 'Метки отражают мнение продавца, это не статистика продаж.',
      create: 'Новая акция',
      edit: 'Изменить',
      pause: 'На паузу',
      resume: 'Возобновить',
      remove: 'Удалить',
      empty: 'пока пусто',
      emptyHint: 'У этой лавки нет акций. Создайте первую или верните демо-акции.',
      resetDemo: 'Вернуть демо-акции',
      resetLabels: 'Вернуть демо-метки',
      resetTitle: 'Вернуть демо-акции?',
      resetBody: 'Все акции всех лавок будут заменены исходными демо-акциями.',
      deleteTitle: 'Удалить акцию?',
      deleteBody: 'Акция «{title}» исчезнет из витрины. Это нельзя отменить.',
      savedTitle: 'Акция сохранена',
      deletedTitle: 'Акция удалена',
      resetDoneTitle: 'Демо-данные возвращены',
      formNew: 'Новая акция',
      formEdit: 'Изменить акцию',
      language: 'Язык текста',
      fieldTitle: 'Заголовок',
      fieldDescription: 'Короткое описание',
      titleHint: 'Достаточно одного языка: на остальных покажем заполненный.',
      fieldType: 'Тип акции',
      fieldPercent: 'Скидка, %',
      fieldAmount: 'Скидка, ₪',
      fieldGift: 'Товар в подарок',
      fieldProduct: 'Товар',
      fieldNewPrice: 'Новая цена, ₪',
      fieldMin: 'Минимальная сумма заказа в лавке, ₪',
      fieldScope: 'К каким товарам относится',
      scopeHint: 'Ничего не выбрано: ко всем товарам лавки.',
      fieldStart: 'Начало',
      fieldEnd: 'Окончание',
      fieldHoursFrom: 'Часы: с',
      fieldHoursTo: 'Часы: до',
      hoursHint: 'Время Израиля. Оставьте пустым, если акция действует весь день.',
      choose: 'Выберите…',
      preview: 'Так увидит покупатель',
      previewEmpty: 'Заполните заголовок, чтобы увидеть акцию.',
      save: 'Сохранить акцию',
      fixErrors: 'Проверьте поля с ошибками.',
    },
  },
  en: {
    labels: {
      new: 'New',
      hot: 'Fresh from the oven',
      storePick: "Shop's pick",
      eco: 'Eco',
      seasonal: 'Seasonal',
      limited: 'Limited quantity',
    },
    types: {
      percent: 'Discount, %',
      amount: 'Discount, ₪',
      freeDelivery: 'Free delivery',
      gift: 'Gift',
      productPrice: 'Product price',
    },
    statuses: { active: 'Active', scheduled: 'Not started', paused: 'Paused', ended: 'Ended' },
    errors: {
      titleRequired: 'Enter a title in at least one language.',
      percentRange: 'The discount must be from 1 to 90%.',
      amountRange: 'The discount must be above 0 ₪ and below the minimum order.',
      giftRequired: 'Choose a product as the gift.',
      giftForeign: "The gift must be one of this shop's products.",
      productRequired: 'Choose a product.',
      newPriceRange: "The new price must be above 0 ₪ and below the product's regular price.",
      minInvalid: 'The amount cannot be negative.',
      startRequired: 'Enter a start date.',
      endRequired: 'Enter an end date.',
      endBeforeStart: 'The end date must be after the start date.',
      hoursOrder: 'The end time must be after the start time.',
    },
    badge: {
      percent: '−{n}%',
      amount: '−{amount}',
      freeDelivery: 'Free delivery',
      gift: 'Gift',
      productPrice: 'Lower price',
    },
    conditions: {
      from: 'on orders from {amount}',
      on: 'on: {items}',
      until: 'until {date}',
      hours: 'daily {from}–{to}',
      hoursUntil: 'daily until {to}',
      hoursFrom: 'daily from {from}',
      gift: 'free: {gift}',
      price: 'new price: {price}',
      notNow: 'not available right now',
    },
    shop: { note: 'good deals', title: 'Shop promotions' },
    order: {
      promotion: 'Promotion',
      gift: 'Gift',
      hintFree: 'Add {n} more for free delivery.',
      hintDiscount: 'Add {n} more for {x} off.',
      hintGift: 'Add {n} more to get a gift: {gift}.',
      hintPrice: 'Add {n} more and {product} costs {price}.',
      codeWins: 'Promo code applied: it beats the promotions ({code} vs {promo}). Promo codes and promotions do not add up.',
      promoWins: 'Promo code not applied: the promotions are worth as much or more ({promo} vs {code}). Promo codes and promotions do not add up.',
    },
    seller: {
      tabOrders: 'Orders',
      tabPromotions: 'Promotions',
      tabLabels: 'Product labels',
      store: 'Shop',
      storeNote: 'Demo: you can manage any shop',
      listNote: 'storefront',
      listTitle: 'Shop promotions',
      labelsNote: 'on the cards',
      labelsTitle: 'Product labels',
      labelsHint: "Labels are the seller's opinion, not sales statistics.",
      create: 'New promotion',
      edit: 'Edit',
      pause: 'Pause',
      resume: 'Resume',
      remove: 'Delete',
      empty: 'nothing yet',
      emptyHint: 'This shop has no promotions. Create the first one or bring back the demo ones.',
      resetDemo: 'Bring back demo promotions',
      resetLabels: 'Bring back demo labels',
      resetTitle: 'Bring back demo promotions?',
      resetBody: "All promotions of all shops will be replaced with the original demo ones.",
      deleteTitle: 'Delete this promotion?',
      deleteBody: '“{title}” will disappear from the storefront. This cannot be undone.',
      savedTitle: 'Promotion saved',
      deletedTitle: 'Promotion deleted',
      resetDoneTitle: 'Demo data is back',
      formNew: 'New promotion',
      formEdit: 'Edit promotion',
      language: 'Text language',
      fieldTitle: 'Title',
      fieldDescription: 'Short description',
      titleHint: 'One language is enough: the others show the one filled in.',
      fieldType: 'Promotion type',
      fieldPercent: 'Discount, %',
      fieldAmount: 'Discount, ₪',
      fieldGift: 'Gift product',
      fieldProduct: 'Product',
      fieldNewPrice: 'New price, ₪',
      fieldMin: 'Minimum order in this shop, ₪',
      fieldScope: 'Which goods it applies to',
      scopeHint: "Nothing selected: all of the shop's goods.",
      fieldStart: 'Start',
      fieldEnd: 'End',
      fieldHoursFrom: 'Hours: from',
      fieldHoursTo: 'Hours: until',
      hoursHint: 'Israel time. Leave empty if it runs all day.',
      choose: 'Choose…',
      preview: 'What the buyer sees',
      previewEmpty: 'Enter a title to see the promotion.',
      save: 'Save promotion',
      fixErrors: 'Check the fields with errors.',
    },
  },
  he: {
    labels: {
      new: 'חדש',
      hot: 'טרי מהתנור',
      storePick: 'בחירת החנות',
      eco: 'אקו',
      seasonal: 'עונתי',
      limited: 'כמות מוגבלת',
    },
    types: {
      percent: 'הנחה, %',
      amount: 'הנחה, ₪',
      freeDelivery: 'משלוח חינם',
      gift: 'מתנה',
      productPrice: 'מחיר למוצר',
    },
    statuses: { active: 'פעיל', scheduled: 'טרם החל', paused: 'מושהה', ended: 'הסתיים' },
    errors: {
      titleRequired: 'יש למלא כותרת לפחות בשפה אחת.',
      percentRange: 'ההנחה חייבת להיות בין 1 ל-90%.',
      amountRange: 'ההנחה חייבת להיות מעל 0 ₪ ומתחת לסכום ההזמנה המינימלי.',
      giftRequired: 'יש לבחור מוצר למתנה.',
      giftForeign: 'אפשר לתת במתנה רק מוצר של חנות זו.',
      productRequired: 'יש לבחור מוצר.',
      newPriceRange: 'המחיר החדש חייב להיות מעל 0 ₪ ומתחת למחיר הרגיל.',
      minInvalid: 'הסכום לא יכול להיות שלילי.',
      startRequired: 'יש להזין תאריך התחלה.',
      endRequired: 'יש להזין תאריך סיום.',
      endBeforeStart: 'תאריך הסיום חייב להיות אחרי תאריך ההתחלה.',
      hoursOrder: 'שעת הסיום חייבת להיות אחרי שעת ההתחלה.',
    },
    badge: {
      percent: '{n}% הנחה',
      amount: 'הנחה {amount}',
      freeDelivery: 'משלוח חינם',
      gift: 'מתנה',
      productPrice: 'מחיר נמוך יותר',
    },
    conditions: {
      from: 'בהזמנה מ-{amount}',
      on: 'על: {items}',
      until: 'עד {date}',
      hours: 'מדי יום {from}–{to}',
      hoursUntil: 'מדי יום עד {to}',
      hoursFrom: 'מדי יום מ-{from}',
      gift: 'במתנה: {gift}',
      price: 'מחיר חדש: {price}',
      notNow: 'לא בתוקף כרגע',
    },
    shop: { note: 'משתלם', title: 'מבצעי החנות' },
    order: {
      promotion: 'מבצע',
      gift: 'מתנה',
      hintFree: 'הוסיפו עוד {n} והמשלוח יהיה חינם.',
      hintDiscount: 'הוסיפו עוד {n} וקבלו הנחה של {x}.',
      hintGift: 'הוסיפו עוד {n} וקבלו מתנה: {gift}.',
      hintPrice: 'הוסיפו עוד {n} ו{product} יעלה {price}.',
      codeWins: 'הקופון הופעל: הוא משתלם יותר מהמבצעים ({code} מול {promo}). קופון ומבצעים אינם מצטברים.',
      promoWins: 'הקופון לא הופעל: המבצעים משתלמים לפחות באותה מידה ({promo} מול {code}). קופון ומבצעים אינם מצטברים.',
    },
    seller: {
      tabOrders: 'הזמנות',
      tabPromotions: 'מבצעים',
      tabLabels: 'תוויות מוצרים',
      store: 'חנות',
      storeNote: 'הדגמה: אפשר לנהל כל חנות',
      listNote: 'בחנות',
      listTitle: 'מבצעי החנות',
      labelsNote: 'על הכרטיסים',
      labelsTitle: 'תוויות מוצרים',
      labelsHint: 'התוויות משקפות את דעת המוכר, הן אינן נתוני מכירות.',
      create: 'מבצע חדש',
      edit: 'עריכה',
      pause: 'השהיה',
      resume: 'חידוש',
      remove: 'מחיקה',
      empty: 'עדיין ריק',
      emptyHint: 'לחנות זו אין מבצעים. צרו את הראשון או החזירו את מבצעי ההדגמה.',
      resetDemo: 'החזרת מבצעי ההדגמה',
      resetLabels: 'החזרת תוויות ההדגמה',
      resetTitle: 'להחזיר את מבצעי ההדגמה?',
      resetBody: 'כל המבצעים של כל החנויות יוחלפו במבצעי ההדגמה המקוריים.',
      deleteTitle: 'למחוק את המבצע?',
      deleteBody: 'המבצע „{title}” ייעלם מהחנות. אי אפשר לבטל זאת.',
      savedTitle: 'המבצע נשמר',
      deletedTitle: 'המבצע נמחק',
      resetDoneTitle: 'נתוני ההדגמה הוחזרו',
      formNew: 'מבצע חדש',
      formEdit: 'עריכת מבצע',
      language: 'שפת הטקסט',
      fieldTitle: 'כותרת',
      fieldDescription: 'תיאור קצר',
      titleHint: 'מספיקה שפה אחת: בשאר יוצג מה שמולא.',
      fieldType: 'סוג המבצע',
      fieldPercent: 'הנחה, %',
      fieldAmount: 'הנחה, ₪',
      fieldGift: 'מוצר במתנה',
      fieldProduct: 'מוצר',
      fieldNewPrice: 'מחיר חדש, ₪',
      fieldMin: 'סכום הזמנה מינימלי בחנות, ₪',
      fieldScope: 'על אילו מוצרים',
      scopeHint: 'לא נבחר דבר: על כל מוצרי החנות.',
      fieldStart: 'התחלה',
      fieldEnd: 'סיום',
      fieldHoursFrom: 'שעות: מ-',
      fieldHoursTo: 'שעות: עד',
      hoursHint: 'שעון ישראל. השאירו ריק אם המבצע תקף כל היום.',
      choose: 'בחרו…',
      preview: 'כך יראה הקונה',
      previewEmpty: 'מלאו כותרת כדי לראות את המבצע.',
      save: 'שמירת המבצע',
      fixErrors: 'בדקו את השדות עם השגיאות.',
    },
  },
};
