import React from 'react';
import { Link } from 'react-router';
import { useApp } from '../context/AppContext';
import { useLanguage } from '../context/LanguageContext';
import { MOCK_STORES, MOCK_PRODUCTS } from '../data/mockData';
import { LinkButton } from '../components/ui/LinkButton';
import { pathFor } from '../router/paths';
import { StoreCard } from '../components/ui/StoreCard';
import { Tape } from '../components/collage/Tape';
import { HandArrow, HandUnderline } from '../components/collage/HandMarks';
import { ProductSticker } from '../components/collage/ProductSticker';
import { ComingSoon } from '../components/collage/ComingSoon';

/** Decorative collage around the desktop hero. `caption` indexes t.collage.landing.caps. */
const HERO_STICKERS: {
  photo: string;
  x: string;
  y: string;
  width: number;
  tilt: string;
  caption?: number;
  round?: boolean;
}[] = [
  { photo: 'challah', x: '62%', y: '2%', width: 210, tilt: '-6deg', caption: 0 },
  { photo: 'avocado', x: '82%', y: '18%', width: 170, tilt: '8deg', round: true },
  { photo: 'bouquet', x: '70%', y: '40%', width: 230, tilt: '4deg', caption: 1 },
  { photo: 'cold-brew', x: '88%', y: '62%', width: 150, tilt: '-10deg', round: true },
  { photo: 'labneh', x: '60%', y: '68%', width: 170, tilt: '-3deg', caption: 2 },
  { photo: 'lemons', x: '76%', y: '84%', width: 120, tilt: '12deg', round: true },
];

const BOARD_ORDER = ['store-3', 'store-1', 'store-4', 'store-6', 'store-5', 'store-2'];
const BOARD_TILTS = ['-3deg', '2deg', '-1deg', '3deg', '-2deg', '1.5deg'];

const PHONE_PRODUCTS: { id: string; tilt: string; tape: 'yellow' | 'blue' | 'red' }[] = [
  { id: 'prod-4', tilt: '-3deg', tape: 'blue' },
  { id: 'prod-5', tilt: '2deg', tape: 'yellow' },
  { id: 'prod-2', tilt: '-1.5deg', tape: 'red' },
  { id: 'prod-6', tilt: '3deg', tape: 'blue' },
  { id: 'prod-1', tilt: '-2deg', tape: 'yellow' },
];

const PHONE_BOARD: { store: string; tilt: string }[] = [
  { store: 'store-3', tilt: '-4deg' },
  { store: 'store-1', tilt: '3deg' },
  { store: 'store-4', tilt: '-2deg' },
  { store: 'store-6', tilt: '5deg' },
];

const STEP_STYLES = [
  { background: 'bg-card', number: 'text-link-text' },
  { background: 'bg-tint-food', number: 'text-action' },
  { background: 'bg-tint-health', number: 'text-link-text' },
];

export const HomePage: React.FC = () => {
  const { navigateTo, pickStore, addToCart, cart } = useApp();
  const { t } = useLanguage();

  const landing = t.collage.landing;
  const phone = t.collage.mobileHome;
  const storeCount = String(MOCK_STORES.length);

  const boardStores = BOARD_ORDER.map((id) => MOCK_STORES.find((s) => s.id === id)).filter(
    (s): s is (typeof MOCK_STORES)[number] => Boolean(s)
  );

  return (
    <>
      {/* ---------- Phone: M9-Home ---------- */}
      <div className="desk:hidden pb-5">
        <section className="px-4 pt-2 pb-4">
          <p className="hand anim-in inline-block text-[26px] text-link-text -rotate-2">{phone.today}</p>
          <h1 className="anim-in text-[40px] font-black leading-[0.98] tracking-[-0.03em]" style={{ animationDelay: '0.1s' }}>
            {phone.h1a}
            <span className="relative inline-block">
              {phone.h1b}
              <HandUnderline compact delay="0.5s" />
            </span>
            {phone.h1c}
          </h1>
        </section>

        <section aria-labelledby="home-stickers" className="pb-[18px]">
          <div className="flex items-baseline justify-between px-4 pb-2">
            <h2 id="home-stickers" className="text-xl font-black">
              {phone.stickers}
            </h2>
            <span className="hand text-[22px] text-action">{phone.swipe}</span>
          </div>
          <ul className="scroll-row flex gap-4 overflow-x-auto px-4 pt-3.5 pb-2.5">
            {PHONE_PRODUCTS.map((item, index) => {
              const product = MOCK_PRODUCTS.find((p) => p.id === item.id);
              if (!product) return null;
              return (
                <ProductSticker
                  key={product.id}
                  product={product}
                  inCart={cart.some((line) => line.product.id === product.id)}
                  tilt={item.tilt}
                  tape={item.tape}
                  delay={`${(0.15 + index * 0.1).toFixed(2)}s`}
                  onAdd={() => addToCart(product)}
                />
              );
            })}
          </ul>
        </section>

        <section aria-labelledby="home-shops" className="px-4 pb-[18px]">
          <div className="flex items-baseline justify-between mb-2.5">
            <h2 id="home-shops" className="text-xl font-black">
              {phone.near}{' '}
              <span className="hand font-bold text-link-text">{phone.count.replace('{n}', storeCount)}</span>
            </h2>
            <Link
              to={pathFor('catalog')}
              className="inline-grid place-items-center min-w-11 min-h-11 text-sm font-extrabold underline cursor-pointer"
            >
              {phone.all}
            </Link>
          </div>
          <Link
            to={pathFor('catalog')}
            className="on-blue block w-full p-4 bg-link text-white text-start border-[3px] border-ink rounded-[22px] shadow-hard-5 overflow-hidden cursor-pointer chip-tilt"
          >
            <span className="flex gap-2 mb-3">
              {PHONE_BOARD.map(({ store, tilt }) => (
                <span key={store} className="w-[62px] h-[62px] p-1 bg-card shrink-0" style={{ rotate: tilt }}>
                  <img
                    src={MOCK_STORES.find((s) => s.id === store)?.coverUrl}
                    alt=""
                    loading="lazy"
                    className="block w-full h-full object-cover"
                  />
                </span>
              ))}
            </span>
            <span className="block text-[22px] font-black leading-tight">{phone.kinds}</span>
            <span className="hand block mt-1 text-2xl text-accent">{phone.pick}</span>
          </Link>
        </section>

        <section className="px-4">
          <div className="px-4 py-3.5 bg-card border-2 border-ink rounded-[18px]" style={{ rotate: '-1deg' }}>
            <p className="hand text-2xl text-action">{phone.howT}</p>
            <p className="mt-1 font-bold leading-normal">{phone.howD}</p>
          </div>
          <ComingSoon className="mt-4" />
        </section>

        <section className="px-4 pt-7">
          <Link
            to={pathFor('catalog')}
            className="card-tilt relative block w-full p-2 pb-2.5 bg-card text-start shadow-polaroid cursor-pointer"
            style={{ '--tilt': '1.5deg' } as React.CSSProperties}
          >
            <Tape tone="red" />
            <img
              src="/photos/hero-grocery-bag.webp"
              alt=""
              loading="lazy"
              className="block w-full aspect-[16/9] object-cover"
            />
            <span className="hand block mt-2 text-[26px] leading-none">{landing.wait}</span>
          </Link>
        </section>
      </div>

      {/* ---------- Desktop: N9-Landing ---------- */}
      <div className="hidden desk:block overflow-hidden">
        <section className="relative max-w-[1360px] min-h-[760px] mx-auto px-10 pt-[30px] pb-20">
          <div className="relative z-[2] max-w-[56%] xl:max-w-[760px]">
            <p className="hand anim-in inline-block mb-1.5 text-[32px] text-link-text -rotate-3">{landing.hello}</p>
            <h1
              className="anim-in font-black leading-[0.98] tracking-[-0.03em] text-[clamp(54px,7vw,112px)]"
              style={{ animationDelay: '0.1s' }}
            >
              {landing.h1a}
              <span className="relative inline-block">
                {landing.h1b}
                <HandUnderline />
              </span>
              {landing.h1c}
            </h1>
            <p
              className="anim-in my-[30px] max-w-[30em] text-[21px] font-semibold leading-normal"
              style={{ animationDelay: '0.25s' }}
            >
              {landing.lead}
            </p>
            <div className="anim-in flex flex-wrap items-center gap-3.5" style={{ animationDelay: '0.35s' }}>
              <LinkButton to={pathFor('catalog')} variant="secondary" size="lg" className="shadow-hard-4 min-h-[60px]">
                {landing.start}
              </LinkButton>
              <span className="hand text-[28px] text-action -rotate-[4deg]">{landing.quick}</span>
            </div>
          </div>

          <div aria-hidden="true" className="absolute inset-0 pointer-events-none">
            {HERO_STICKERS.map((sticker, index) => {
              const caption = sticker.caption !== undefined ? landing.caps[sticker.caption] : undefined;
              return (
                <div
                  key={sticker.photo}
                  className="anim-stick absolute pointer-events-auto"
                  style={
                    {
                      '--r': sticker.tilt,
                      insetInlineStart: sticker.x,
                      top: sticker.y,
                      width: `clamp(${Math.round(sticker.width * 0.7)}px, ${(sticker.width / 14.4).toFixed(1)}vw, ${sticker.width}px)`,
                      animationDelay: `${(0.4 + index * 0.12).toFixed(2)}s`,
                    } as React.CSSProperties
                  }
                >
                  <div
                    className={`relative bg-card p-2.5 shadow-sticker ${
                      sticker.round ? 'rounded-full' : caption ? 'rounded-md pb-1.5' : 'rounded-md'
                    }`}
                  >
                    <Tape tone="blue" />
                    <img
                      src={`/photos/${sticker.photo}.webp`}
                      alt=""
                      className={`block w-full aspect-square object-cover ${sticker.round ? 'rounded-full' : 'rounded-sm'}`}
                    />
                    {caption && <p className="hand mt-1.5 text-center text-2xl">{caption}</p>}
                  </div>
                </div>
              );
            })}
            <HandArrow className="absolute w-[180px]" style={{ insetInlineStart: '50%', top: '62%' }} />
          </div>
        </section>

        <section aria-labelledby="landing-board" className="on-blue py-20 px-10 bg-link text-white border-y-[3px] border-ink">
          <div className="max-w-[1360px] mx-auto">
            <h2
              id="landing-board"
              className="anim-reveal mb-10 font-black tracking-[-0.02em] text-[clamp(40px,4.8vw,72px)]"
            >
              {landing.boardTitle}{' '}
              <span className="hand font-bold text-accent">{landing.boardNote.replace('{n}', storeCount)}</span>
            </h2>
            <ul className="grid gap-x-[26px] gap-y-9 grid-cols-3 min-[1280px]:grid-cols-6">
              {boardStores.map((store, index) => (
                <li key={store.id} className="anim-reveal">
                  <StoreCard
                    store={store}
                    detail="board"
                    tilt={BOARD_TILTS[index]}
                    onClick={() => {
                      pickStore(store.id);
                      navigateTo('catalog');
                    }}
                  />
                </li>
              ))}
            </ul>
            <ComingSoon className="mt-10 text-ink" />
          </div>
        </section>

        <section aria-labelledby="landing-how" className="max-w-[1360px] mx-auto py-[90px] px-10">
          <h2 id="landing-how" className="anim-reveal mb-10 font-black tracking-[-0.02em] text-[clamp(40px,4.8vw,72px)]">
            {landing.how}
          </h2>
          <ol className="grid gap-6 grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))]">
            {landing.steps.map(([title, description], index) => (
              <li
                key={title}
                className={`anim-reveal relative p-7 border-[3px] border-ink rounded-[26px] shadow-hard-6 ${STEP_STYLES[index].background}`}
              >
                {index === 0 && (
                  <div aria-hidden="true" className="absolute -top-7 end-6 w-[132px] p-1.5 pb-2 bg-card rotate-3 shadow-polaroid">
                    <Tape tone="blue" small />
                    <img
                      src="/photos/aerial-tel-aviv.webp"
                      alt=""
                      loading="lazy"
                      className="block w-full aspect-[4/3] object-cover"
                    />
                  </div>
                )}
                <p className={`hand mb-1.5 text-[54px] leading-none ${STEP_STYLES[index].number}`}>{index + 1}</p>
                <h3 className="mb-2.5 text-[28px] font-black">{title}</h3>
                <p className="text-lg font-semibold leading-normal">{description}</p>
              </li>
            ))}
          </ol>
        </section>

        <section className="max-w-[1360px] mx-auto px-10 pb-[90px]">
          <div className="anim-reveal flex flex-wrap items-center justify-between gap-6 px-[50px] py-[60px] bg-accent border-[3px] border-ink rounded-[32px] shadow-hard-8">
            <h2 className="max-w-[12em] font-black tracking-[-0.02em] text-[clamp(36px,4.4vw,64px)]">
              {landing.wait}{' '}
              <span aria-hidden="true" className="hand">
                :)
              </span>
            </h2>
            <div aria-hidden="true" className="hidden min-[1200px]:block relative w-[300px] p-2 pb-3 bg-card -rotate-2 shadow-polaroid">
              <Tape tone="blue" />
              <img
                src="/photos/hero-grocery-bag.webp"
                alt=""
                loading="lazy"
                className="block w-full aspect-[16/10] object-cover"
              />
            </div>
            <LinkButton to={pathFor('catalog')} size="lg" className="shadow-hard-4 text-xl min-h-[64px]">
              {landing.toShops}
            </LinkButton>
          </div>
        </section>
      </div>
    </>
  );
};
