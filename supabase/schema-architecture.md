# QIVENTRA: Архитектура Supabase Backend & План Миграций

В данном документе описана архитектура единого backend на базе Supabase для гиперлокального маркетплейса **QIVENTRA** (Тель-Авив), этапы внедрения, схема таблиц, роли пользователей и модель безопасности Row Level Security (RLS).

---

## 1. Ролевая модель и аутентификация (RBAC)

Система поддерживает 4 роли пользователей:
1. **customer** — Покупатель: создание заказов, выбор адресов, избранное, чат с поддержкой/курьером.
2. **vendor** — Продавец: управление профилем магазина, каталогом продуктов, инвентарем и статусами заказов своего заведения.
3. **courier** — Курьер: прием заказов на доставку, обновление геолокации, отчеты по выполненным рейсам.
4. **admin** — Администратор платформы: мониторинг, аудит, верификация мерчантов, управление официальными бренд-ассетами и глобальными настройками.

---

## 2. Реализованный Этап 1: Инфраструктура и Бренд-Ассеты

Файл миграции: `supabase/migrations/20260907000000_brand_assets_and_storage.sql`

- **Storage Bucket:** `brand-assets` (Public Read, Admin-only Write, лимит 10 МБ, форматы: PNG, WebP, SVG).
- **Каноничные пути:**
  - `qiventra/v1/mark.png` — официальный знак без текста (512×512, SHA-256: `9934440ea66c09ace5a53c444108f56ca53434ba98cda646022d3b25db759962`)
  - `qiventra/v1/lockup.png` — полный официальный логотип (1060×280, SHA-256: `dd633f99f7a2166df709d0ac7f8a1b5dc346603a22c312193bc131f0a3a38d98`)
- **Таблица `brand_assets`:**
  - Поля: `id`, `asset_key`, `storage_path`, `variant`, `mime_type`, `width`, `height`, `sha256`, `version`, `is_active`, `created_at`, `updated_at`, `created_by`.
  - RLS: Публичный доступ только к `is_active = true`. Операции `INSERT`, `UPDATE`, `DELETE` доступны исключительно администраторам (`is_admin()`).
- **Клиентский слой:**
  - `BrandLogo` с защитой от деформации, едиными стилями, светлой подложкой для темной надписи и fallback на оригинальные локальные файлы.
  - Административный раздел с предпросмотром, расчетом SHA-256, заменой и возможностью отката версий.

---

## 3. Будущая Схема Данных (Roadmap последующих миграций)

### 3.1. Модуль Auth & Профили (`profiles`, `addresses`)
```sql
-- Таблица профилей, привязанная к auth.users
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role TEXT NOT NULL DEFAULT 'customer' CHECK (role IN ('customer', 'vendor', 'courier', 'admin')),
    preferred_language TEXT NOT NULL DEFAULT 'he' CHECK (preferred_language IN ('he', 'en', 'ru')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Адресная книга пользователей для точного расчета SLA доставки
CREATE TABLE public.addresses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL, -- e.g. "Дом", "Офис"
    full_address TEXT NOT NULL,
    district TEXT NOT NULL, -- "Lev HaIr", "Florentin", "Neve Tzedek", etc.
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    entrance TEXT,
    floor TEXT,
    apartment TEXT,
    door_code TEXT,
    is_primary BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.2. Модуль Продавцов и Заведений (`stores`, `store_hours`)
```sql
CREATE TABLE public.stores (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    slug TEXT UNIQUE NOT NULL,
    name_he TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    category TEXT NOT NULL,
    district TEXT NOT NULL,
    address TEXT NOT NULL,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    phone TEXT NOT NULL,
    cover_image TEXT,
    logo_image TEXT,
    rating NUMERIC(2,1) NOT NULL DEFAULT 5.0,
    review_count INTEGER NOT NULL DEFAULT 0,
    avg_prep_time_minutes INTEGER NOT NULL DEFAULT 15,
    min_order_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    is_verified BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.store_hours (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    day_of_week SMALLINT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    is_closed BOOLEAN NOT NULL DEFAULT false
);
```

### 3.3. Модуль Каталога и Товаров (`categories`, `products`, `product_variants`)
```sql
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID REFERENCES public.stores(id) ON DELETE CASCADE,
    title_he TEXT NOT NULL,
    title_en TEXT NOT NULL,
    title_ru TEXT NOT NULL,
    sort_order INTEGER NOT NULL DEFAULT 0
);

CREATE TABLE public.products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE CASCADE,
    category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
    name_he TEXT NOT NULL,
    name_en TEXT NOT NULL,
    name_ru TEXT NOT NULL,
    description_he TEXT,
    description_en TEXT,
    description_ru TEXT,
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    compare_at_price NUMERIC(10,2),
    image_url TEXT,
    is_available BOOLEAN NOT NULL DEFAULT true,
    stock_quantity INTEGER DEFAULT NULL,
    is_organic BOOLEAN NOT NULL DEFAULT false,
    is_vegan BOOLEAN NOT NULL DEFAULT false,
    is_kosher BOOLEAN NOT NULL DEFAULT false,
    allergens TEXT[] DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

### 3.4. Модуль Заказов и Оплаты (`orders`, `order_items`)
```sql
CREATE TABLE public.orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_number TEXT UNIQUE NOT NULL,
    customer_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE RESTRICT,
    store_id UUID NOT NULL REFERENCES public.stores(id) ON DELETE RESTRICT,
    courier_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    delivery_address_id UUID REFERENCES public.addresses(id) ON DELETE SET NULL,
    delivery_address_snapshot JSONB NOT NULL,
    
    subtotal NUMERIC(10,2) NOT NULL,
    delivery_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    service_fee NUMERIC(10,2) NOT NULL DEFAULT 0,
    tip NUMERIC(10,2) NOT NULL DEFAULT 0,
    total NUMERIC(10,2) NOT NULL,
    
    status TEXT NOT NULL DEFAULT 'created' CHECK (
        status IN ('created', 'paid', 'accepted_by_store', 'preparing', 'ready_for_pickup', 'picked_up', 'in_transit', 'delivered', 'cancelled')
    ),
    payment_status TEXT NOT NULL DEFAULT 'pending' CHECK (payment_status IN ('pending', 'authorized', 'captured', 'refunded', 'failed')),
    payment_method TEXT NOT NULL CHECK (payment_method IN ('credit_card', 'apple_pay', 'google_pay', 'bit')),
    
    estimated_delivery_at TIMESTAMPTZ,
    actual_delivery_at TIMESTAMPTZ,
    cancellation_reason TEXT,
    customer_note TEXT,
    
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE RESTRICT,
    product_snapshot JSONB NOT NULL,
    quantity INTEGER NOT NULL CHECK (quantity > 0),
    unit_price NUMERIC(10,2) NOT NULL,
    total_price NUMERIC(10,2) NOT NULL
);
```

### 3.5. Модуль Отслеживания Доставки в Реальном Времени (`delivery_tracking`)
```sql
CREATE TABLE public.delivery_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
    courier_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    latitude DOUBLE PRECISION NOT NULL,
    longitude DOUBLE PRECISION NOT NULL,
    heading REAL,
    speed REAL,
    battery_level SMALLINT,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Индекс для получения последней известной локации курьера по заказу
CREATE INDEX idx_delivery_tracking_order_time ON public.delivery_tracking(order_id, recorded_at DESC);
```

---

## 4. План Поэтапных Проверяемых Миграций

1. **Миграция 1 (Завершена):** `20260907000000_brand_assets_and_storage.sql`
   - Инициализация `brand-assets` бакета и таблицы версионирования.
   - Защита RLS и права администратора.
2. **Миграция 2 (Следующая):** `20260907000100_auth_and_profiles.sql`
   - Создание таблицы `profiles`, триггера авто-создания профиля при регистрации в `auth.users`, адресной книги и RLS.
3. **Миграция 3:** `20260907000200_stores_and_products.sql`
   - Таблицы `stores`, `categories`, `products`. RLS: публичное чтение активных товаров, изменение только мерчантом-владельцем.
4. **Миграция 4:** `20260907000300_orders_and_checkout.sql`
   - Таблицы `orders`, `order_items`. RLS: покупатель видит свои заказы, магазин видит свои, курьер — назначенные.
5. **Миграция 5:** `20260907000400_delivery_and_realtime.sql`
   - Таблица `delivery_tracking` с подключением Supabase Realtime Channels (Broadcast & Postgres Changes) для отображения курьера на карте покупателя.
