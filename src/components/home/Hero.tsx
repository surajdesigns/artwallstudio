'use client';

import { useRef, useEffect } from 'react';
import styled from 'styled-components';
import Link from 'next/link';
import Image from 'next/image';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') gsap.registerPlugin(ScrollTrigger);

// ─── Layout ────────────────────────────────────────────────────────
const HeroSection = styled.section`
  position: relative;
  min-height: 100svh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  overflow: hidden;
  background: var(--off-black);
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const HeroLeft = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: clamp(80px, 10vw, 120px) 72px clamp(60px, 6vw, 80px);
  position: relative;
  z-index: 2;
  @media (max-width: 1200px) { padding: 100px 48px 60px; }
  @media (max-width: 900px)  { padding: 100px 32px 52px; }
`;

const HeroRight = styled.div`
  position: relative;
  overflow: hidden;
  @media (max-width: 900px) {
    position: absolute; inset: 0; opacity: 0.12; z-index: 1; pointer-events: none;
  }
`;

const EdgeGradient = styled.div`
  position: absolute; inset: 0; z-index: 10; pointer-events: none;
  background: linear-gradient(to right, var(--off-black) 0%, rgba(0,0,0,0.5) 25%, transparent 55%);
`;

// ─── Typography ───────────────────────────────────────────────────
const Eyebrow = styled.p`
  font-family: var(--font-body);
  font-size: 10px; letter-spacing: 0.3em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 24px;
`;

const TitleStatic = styled.p`
  font-family: var(--font-display);
  font-size: clamp(52px, 5.2vw, 82px);
  font-weight: 300; line-height: 1.08; color: var(--off-white); margin: 0;
`;

/* Fixed-height slot for the SVG word — matches one text line */
const WordSlot = styled.div`
  position: relative;
  height: clamp(56px, 5.8vw, 90px);
  margin: 6px 0;
  overflow: visible;
`;

/* Each SVG word — absolutely stacked */
const WordSvg = styled.svg`
  position: absolute;
  top: 0; left: 0;
  width: 100%; height: 100%;
  overflow: visible;
  opacity: 0;

  text {
    font-family: var(--font-display);
    font-weight: 300;
    font-style: italic;
  }
`;

const Subtitle = styled.p`
  font-family: var(--font-body);
  font-size: 15px; line-height: 1.85; color: var(--light-gray);
  max-width: 420px; margin: 24px 0 48px;
`;

const Buttons = styled.div`
  display: flex; gap: 16px; flex-wrap: wrap;
`;

const BtnPrimary = styled(Link)`
  display: inline-flex; align-items: center;
  padding: 15px 34px; background: var(--gold); color: #000;
  font-family: var(--font-body); font-size: 11px; font-weight: 500;
  letter-spacing: 0.14em; text-transform: uppercase; border-radius: 2px;
  transition: background 0.25s, transform 0.2s;
  &:hover { background: var(--gold-light); transform: translateY(-2px); }
`;

const BtnSecondary = styled(Link)`
  display: inline-flex; align-items: center;
  padding: 14px 34px; border: 1px solid rgba(201,168,76,0.4); color: var(--off-white);
  font-family: var(--font-body); font-size: 11px; font-weight: 400;
  letter-spacing: 0.14em; text-transform: uppercase; border-radius: 2px;
  transition: all 0.25s;
  &:hover { border-color: var(--gold); color: var(--gold-light); }
`;

const StatsRow = styled.div`
  display: flex; gap: 40px; margin-top: 52px;
  padding-top: 36px; border-top: 1px solid rgba(255,255,255,0.07);
  @media (max-width: 480px) { gap: 24px; }
`;

const Stat = styled.div`
  strong {
    display: block; font-family: var(--font-display);
    font-size: 28px; font-weight: 300; color: var(--off-white);
  }
  span {
    font-family: var(--font-body);
    font-size: 10px; letter-spacing: 0.12em; text-transform: uppercase; color: var(--mid-gray);
  }
`;

// ─── Image Columns ────────────────────────────────────────────────
const ColumnsWrapper = styled.div`
  position: absolute;
  top: -15%; left: -5%; width: 115%; height: 130%;
  display: flex; gap: 12px;
  transform: rotate(-6deg); transform-origin: center;
  @media (max-width: 900px) { transform: none; top: -5%; left: 0; width: 100%; height: 110%; }
`;

const ImgCol = styled.div`
  flex: 1; display: flex; flex-direction: column; gap: 12px; will-change: transform;
`;

const ImgCard = styled.div`
  position: relative; width: 100%; aspect-ratio: 3/4;
  border-radius: 4px; overflow: hidden; flex-shrink: 0;
  &::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 60%, rgba(0,0,0,0.25));
  }
`;

// ─── Data ────────────────────────────────────────────────────────
// Inline SVG paths for each icon (24×24 Lucide icons, scaled in SVG)
const WORDS = [
  {
    text: 'Transforme',
    // Palette icon
    icon: 'M12 22a10 10 0 1 1 10-10c0 1.5-1.5 2-2.5 2h-1c-1.5 0-2 1-2 2v1c0 1.5-1.5 3-4.5 3Z M7.5 10.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z M10.5 7.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z M14.5 7.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z M17.5 10.5a.5.5 0 1 0-1 0 .5.5 0 0 0 1 0Z',
    anim: 'spin',
  },
  {
    text: 'Sublime',
    // Sparkle icon
    icon: 'M9.937 15.5A2 2 0 0 0 8.5 14.063l-6.135-1.582a.5.5 0 0 1 0-.962L8.5 9.937A2 2 0 0 0 9.937 8.5l1.582-6.135a.5.5 0 0 1 .963 0L14.063 8.5A2 2 0 0 0 15.5 9.937l6.135 1.581a.5.5 0 0 1 0 .964L15.5 14.063a2 2 0 0 0-1.437 1.437l-1.582 6.135a.5.5 0 0 1-.963 0z',
    anim: 'pulse',
  },
  {
    text: 'Illumine',
    // Sun icon (rays as lines)
    icon: 'M12 2v2 M12 20v2 M4.93 4.93l1.41 1.41 M17.66 17.66l1.41 1.41 M2 12h2 M20 12h2 M6.34 17.66l-1.41 1.41 M19.07 4.93l-1.41 1.41',
    iconExtra: 'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z',
    anim: 'spin',
  },
  {
    text: 'Élève',
    // Arrow up icon
    icon: 'M12 19V5 M5 12l7-7 7 7',
    anim: 'bounce',
  },
];

// 5 local + col-* downloads across 3 columns (varied order per column)
const COL1_IMGS = [
  '/images/home/abstract.webp',
  '/images/home/col-1.webp',
  '/images/home/cultural.webp',
  '/images/home/col-3.webp',
  '/images/home/minimalist.webp',
  '/images/home/col-8.webp',
];
const COL2_IMGS = [
  '/images/home/col-2.webp',
  '/images/home/cultural.webp',
  '/images/home/col-4.webp',
  '/images/home/abstract.webp',
  '/images/home/col-8.webp',
  '/images/home/minimalist.webp',
];
const COL3_IMGS = [
  '/images/home/col-3.webp',
  '/images/home/minimalist.webp',
  '/images/home/col-1.webp',
  '/images/home/col-8.webp',
  '/images/home/abstract.webp',
  '/images/home/cultural.webp',
];

// ─── Component ───────────────────────────────────────────────────
export default function Hero() {
  const col1Ref = useRef<HTMLDivElement>(null);
  const col2Ref = useRef<HTMLDivElement>(null);
  const col3Ref = useRef<HTMLDivElement>(null);
  const svgRefs  = useRef<(SVGSVGElement | null)[]>([]);
  const textRefs = useRef<(SVGTextElement | null)[]>([]);
  const iconRefs = useRef<(SVGGElement | null)[]>([]);

  useEffect(() => {
    // ── Column scroll (wait for images to set their heights) ──────
    const initCols = () => {
      const scrollUp = (el: HTMLDivElement | null, dur: number) => {
        if (!el) return;
        const half = el.scrollHeight / 2;
        if (half <= 10) { setTimeout(() => scrollUp(el, dur), 150); return; }
        gsap.to(el, {
          y: -half, duration: dur, ease: 'none', repeat: -1,
          modifiers: { y: gsap.utils.unitize(v => parseFloat(v) % half) },
        });
      };

      const scrollDown = (el: HTMLDivElement | null, dur: number) => {
        if (!el) return;
        const half = el.scrollHeight / 2;
        if (half <= 10) { setTimeout(() => scrollDown(el, dur), 150); return; }
        // Tween y from 0 → +half, modifier maps to -half → 0 (seamless)
        gsap.to(el, {
          y: half, duration: dur, ease: 'none', repeat: -1,
          modifiers: { y: gsap.utils.unitize(v => parseFloat(v) % half - half) },
        });
      };

      scrollUp(col1Ref.current, 32);
      scrollDown(col2Ref.current, 42);
      scrollUp(col3Ref.current, 36);
    };

    // Give images a moment to determine their sizes
    setTimeout(initCols, 200);

    // ── SVG stroke-draw word rotator ──────────────────────────────
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const DRAW = 0.9, FILL = 0.25, HOLD = 2.2, ERASE = 0.5;
      const master = gsap.timeline({ repeat: -1 });

      WORDS.forEach((w, i) => {
        const svg  = svgRefs.current[i];
        const txt  = textRefs.current[i];
        const icon = iconRefs.current[i];
        if (!svg || !txt) return;

        const len = txt.getComputedTextLength?.() ?? 380;

        // Initial state
        gsap.set(svg,  { opacity: 0 });
        gsap.set(txt,  { strokeDasharray: len, strokeDashoffset: len, fillOpacity: 0 });
        if (icon) gsap.set(icon, { opacity: 0, scale: 0.5, transformOrigin: '50% 50%' });

        const wTl = gsap.timeline();
        wTl
          .set(svg, { opacity: 1 })
          // Draw the word stroke left → right
          .to(txt, { strokeDashoffset: 0, duration: DRAW, ease: 'power2.inOut' })
          // Simultaneously pop in the icon
          .to(icon ?? {}, { opacity: 1, scale: 1, duration: 0.4, ease: 'back.out(2)' }, '-=0.6')
          // Fade fill on top of stroke (solid gold)
          .to(txt, { fillOpacity: 1, duration: FILL, ease: 'none' })
          // Icon micro-animation during hold
          .to(icon ?? {}, {
            rotation: w.anim === 'spin' ? 360 : 0,
            y: w.anim === 'bounce' ? -6 : 0,
            yoyo: w.anim === 'bounce', repeat: w.anim === 'bounce' ? 3 : 0,
            duration: HOLD / (w.anim === 'bounce' ? 4 : 1),
            ease: w.anim === 'spin' ? 'none' : 'power1.inOut',
            transformOrigin: '50% 50%',
          })
          // Wait remaining hold
          .to({}, { duration: w.anim === 'bounce' ? 0 : HOLD })
          // Erase: wipe stroke backward
          .to(txt, { strokeDashoffset: -len, fillOpacity: 0, duration: ERASE, ease: 'power2.in' })
          .to(icon ?? {}, { opacity: 0, scale: 0.5, duration: ERASE * 0.6, ease: 'power2.in' }, '<')
          .set(svg, { opacity: 0 });

        master.add(wTl, '>');
      });
    }));

    return () => { gsap.globalTimeline.clear(); };
  }, []);

  const fontSize = 'clamp(52px, 5.2vw, 82px)';

  return (
    <HeroSection>
      {/* LEFT */}
      <HeroLeft>
        <Eyebrow>Collection 2025 — Art & Décoration</Eyebrow>

        <div>
          <TitleStatic>L&apos;Art qui</TitleStatic>

          <WordSlot>
            {WORDS.map((w, i) => (
              <WordSvg
                key={i}
                ref={el => { svgRefs.current[i] = el; }}
                viewBox="0 0 660 90"
                preserveAspectRatio="xMinYMid meet"
              >
                {/* Icon — positioned left of the word */}
                <g
                  ref={el => { iconRefs.current[i] = el; }}
                  transform="translate(0, 18) scale(2.0)"
                  fill="none"
                  stroke="#D4AF37"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={w.icon} />
                  {w.iconExtra && <path d={w.iconExtra} />}
                </g>

                {/* Stroke-draw text — starts after the icon (52px = 2×24 icon + 4px gap) */}
                <text
                  ref={el => { textRefs.current[i] = el; }}
                  x="56"
                  y="78"
                  fontSize="76"
                  fill="#D4AF37"
                  fillOpacity="0"
                  stroke="#D4AF37"
                  strokeWidth="0.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  {w.text}
                </text>
              </WordSvg>
            ))}
          </WordSlot>

          <TitleStatic>vos Espaces</TitleStatic>
        </div>

        <Subtitle>
          Des tableaux d&apos;exception et des papiers peints de luxe
          pour sublimer chaque mur de votre intérieur.
        </Subtitle>

        <Buttons>
          <BtnPrimary href="/products?category=tableaux">Explorer les Tableaux</BtnPrimary>
          <BtnSecondary href="/products?category=papier-peint">Papiers Peints</BtnSecondary>
        </Buttons>

        <StatsRow>
          <Stat><strong>500+</strong><span>Œuvres</span></Stat>
          <Stat><strong>50+</strong><span>Artistes</span></Stat>
          <Stat><strong>98%</strong><span>Satisfaits</span></Stat>
        </StatsRow>
      </HeroLeft>

      {/* RIGHT */}
      <HeroRight>
        <EdgeGradient />
        <ColumnsWrapper>
          <ImgCol ref={col1Ref}>
            {[...COL1_IMGS, ...COL1_IMGS].map((src, i) => (
              <ImgCard key={i}><Image src={src} alt="Art" fill sizes="18vw" /></ImgCard>
            ))}
          </ImgCol>
          <ImgCol ref={col2Ref}>
            {[...COL2_IMGS, ...COL2_IMGS].map((src, i) => (
              <ImgCard key={i}><Image src={src} alt="Art" fill sizes="18vw" /></ImgCard>
            ))}
          </ImgCol>
          <ImgCol ref={col3Ref}>
            {[...COL3_IMGS, ...COL3_IMGS].map((src, i) => (
              <ImgCard key={i}><Image src={src} alt="Art" fill sizes="18vw" /></ImgCard>
            ))}
          </ImgCol>
        </ColumnsWrapper>
      </HeroRight>
    </HeroSection>
  );
}
