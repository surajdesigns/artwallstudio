'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';

const Page = styled.div`
  padding-top: var(--nav-height);
`;

/* ── Hero ── */
const Hero = styled.section`
  position: relative;
  height: 85vh;
  min-height: 600px;
  overflow: hidden;
  display: flex;
  align-items: center;
`;

const HeroBg = styled.div`
  position: absolute;
  inset: 0;
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      135deg,
      rgba(10,10,8,0.85) 0%,
      rgba(10,10,8,0.5) 60%,
      transparent 100%
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 40px;
  @media (max-width: 768px) { padding: 0 20px; }
`;

const Eyebrow = styled(motion.p)`
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 20px;
`;

const HeroTitle = styled(motion.h1)`
  font-family: var(--font-display);
  font-size: clamp(48px, 7vw, 96px);
  font-weight: 300;
  color: var(--off-white);
  line-height: 1.05;
  max-width: 700px;
  em { font-style: italic; color: var(--gold-light); }
`;

const HeroSub = styled(motion.p)`
  font-size: 16px;
  color: var(--light-gray);
  max-width: 480px;
  line-height: 1.8;
  margin-top: 24px;
`;

/* ── Story ── */
const StorySection = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 600px;
  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const StoryImage = styled.div`
  position: relative;
  min-height: 500px;
  @media (max-width: 900px) { min-height: 300px; }
`;

const StoryContent = styled.div`
  background: var(--off-black);
  padding: 80px 72px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  @media (max-width: 1200px) { padding: 60px 48px; }
  @media (max-width: 768px) { padding: 60px 24px; }
`;

const Tag = styled.p`
  font-size: 11px;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(28px, 3.5vw, 44px);
  font-weight: 300;
  margin-bottom: 24px;
  em { font-style: italic; color: var(--gold-light); }
`;

const BodyText = styled.p`
  font-size: 15px;
  line-height: 1.9;
  color: var(--mid-gray);
  margin-bottom: 20px;
`;

/* ── Values ── */
const ValuesSection = styled.section`
  background: var(--cream);
  padding: 100px 40px;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const ValuesInner = styled.div`
  max-width: 1200px;
  margin: 0 auto;
`;

const ValuesHeader = styled.div`
  text-align: center;
  margin-bottom: 64px;
`;

const ValuesTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 400;
  color: var(--black);
  em { font-style: italic; color: var(--gold-dark); }
`;

const ValuesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  @media (max-width: 768px) { grid-template-columns: 1fr; }
`;

const ValueCard = styled(motion.div)`
  background: var(--white);
  padding: 44px 36px;
  position: relative;
  overflow: hidden;
  transition: background 0.3s;

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: var(--gold);
    transform: scaleX(0);
    transition: transform 0.4s var(--ease-out);
    transform-origin: left;
  }

  &:hover {
    background: var(--off-black);
    h3, p { color-scheme: dark; }
    &::before { transform: scaleX(1); }
    h3 { color: var(--off-white); }
    p { color: var(--mid-gray); }
  }
`;

const ValueNum = styled.span`
  font-family: var(--font-display);
  font-size: 72px;
  font-weight: 300;
  color: rgba(201,168,76,0.12);
  position: absolute;
  top: 20px; right: 24px;
  line-height: 1;
`;

const ValueTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  color: var(--black);
  margin-bottom: 14px;
  transition: color 0.3s;
`;

const ValueText = styled.p`
  font-size: 14px;
  line-height: 1.8;
  color: var(--mid-gray);
  transition: color 0.3s;
`;

/* ── Team / Artists ── */
const ArtistsSection = styled.section`
  background: var(--off-black);
  padding: 100px 40px;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const ArtistsInner = styled.div`
  max-width: 1400px;
  margin: 0 auto;
`;

const ArtistsHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 56px;
  flex-wrap: wrap;
  gap: 20px;
`;

const ArtistsTitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 400;
  color: var(--off-white);
  em { font-style: italic; color: var(--gold-light); }
`;

const ArtistsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
  @media (max-width: 1024px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const ArtistCard = styled(motion.div)`
  cursor: pointer;
`;

const ArtistImage = styled.div`
  position: relative;
  aspect-ratio: 3/4;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--charcoal);
  margin-bottom: 16px;

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(10,10,8,0.7) 0%, transparent 60%);
  }

  img { transition: transform 0.6s var(--ease-out); }
  &:hover img { transform: scale(1.06); }
`;

const ArtistName = styled.p`
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: var(--off-white);
  margin-bottom: 4px;
`;

const ArtistSpec = styled.p`
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 8px;
`;

const ArtistBio = styled.p`
  font-size: 13px;
  color: var(--mid-gray);
  line-height: 1.6;
`;

/* ── CTA ── */
const CTASection = styled.section`
  background: var(--cream);
  padding: 100px 40px;
  text-align: center;
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const CTATitle = styled.h2`
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 300;
  color: var(--black);
  margin-bottom: 20px;
  em { font-style: italic; color: var(--gold-dark); }
`;

const CTASub = styled.p`
  font-size: 15px;
  color: var(--mid-gray);
  max-width: 480px;
  margin: 0 auto 40px;
  line-height: 1.8;
`;

const CTABtns = styled.div`
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryBtn = styled(Link)`
  padding: 16px 40px;
  background: var(--black);
  color: var(--off-white);
  border-radius: 2px;
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: background 0.25s;
  &:hover { background: var(--gold-dark); }
`;

const SecBtn = styled(Link)`
  padding: 15px 40px;
  border: 1px solid rgba(0,0,0,0.2);
  color: var(--charcoal);
  border-radius: 2px;
  font-size: 13px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  transition: all 0.25s;
  &:hover { border-color: var(--black); background: var(--white); }
`;

const ARTISTS = [
  { name: 'Leila Benali', spec: 'Art Abstrait', bio: 'Diplômee des Beaux-Arts de Casablanca, specialisee dans les grandes compositions expressionnistes.', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=80' },
  { name: 'Karim Tahiri', spec: 'Papier Peint', bio: 'Designer textile avec 15 ans d\'experience, cree des motifs botaniques et geometriques uniques.', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80' },
  { name: 'Sara Idrissi', spec: 'Portrait & Figure', bio: 'Portraitiste contemporaine inspiree par la fusion des cultures mediterraneennes et africaines.', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80' },
  { name: 'Youssef Alami', spec: 'Minimalisme', bio: 'Architecte de formation, explore la geometrie pure et les espaces negatifs dans ses toiles.', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=400&q=80' },
];

const VALUES = [
  { num: '01', title: 'Authenticite', text: 'Chaque oeuvre est originale, signee par son artiste et accompagnee d\'un certificat d\'authenticite numerote.' },
  { num: '02', title: 'Artisanat', text: 'Nous privilegions les materiaux nobles — toiles de coton, chassis en bois massif, pigments de haute qualite.' },
  { num: '03', title: 'Durabilite', text: 'Nos emballages sont ecologiques et nos partenariats de livraison optimises pour reduire notre empreinte carbone.' },
];

export default function AboutPage() {
  return (
    <Page>
      <Hero>
        <HeroBg>
          <Image
            src="https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=1600&q=80"
            alt="Atelier"
            fill
            style={{ objectFit: 'cover' }}
            priority
          />
        </HeroBg>
        <HeroContent>
          <Eyebrow
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            Notre Histoire
          </Eyebrow>
          <HeroTitle
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          >
            L&apos;Art au<br />service de <em>votre vie</em>
          </HeroTitle>
          <HeroSub
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.25 }}
          >
            Depuis 2018, nous connectons des artistes marocains et
            internationaux avec des amateurs d&apos;art qui souhaitent
            transformer leur interieur.
          </HeroSub>
        </HeroContent>
      </Hero>

      <StorySection>
        <StoryImage>
          <Image
            src="https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=900&q=80"
            alt="Notre fondation"
            fill
            style={{ objectFit: 'cover' }}
          />
        </StoryImage>
        <StoryContent>
          <Tag>Notre Mission</Tag>
          <SectionTitle style={{ color: 'var(--off-white)' }}>
            Rendre l&apos;art<br /><em>accessible</em> a tous
          </SectionTitle>
          <BodyText>
            ArtWall Studio est ne d&apos;une conviction simple : l&apos;art
            transforme les espaces, et chaque interieur merite une oeuvre qui
            lui ressemble. Nous avons cree une plateforme qui met en valeur
            des createurs locaux et internationaux.
          </BodyText>
          <BodyText>
            Chaque tableau, chaque papier peint dans notre catalogue a ete
            selectionne avec soin pour sa qualite artistique, son caractere
            unique et sa capacite a s&apos;integrer harmonieusement dans
            differents styles d&apos;interieur.
          </BodyText>
          <div style={{ display: 'flex', gap: 40, marginTop: 8 }}>
            {[{ num: '500+', lbl: 'Oeuvres' }, { num: '50+', lbl: 'Artistes' }, { num: '2 000+', lbl: 'Clients' }].map((s, i) => (
              <div key={i}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 300, color: 'var(--off-white)' }}>{s.num}</p>
                <p style={{ fontSize: 11, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--mid-gray)', marginTop: 4 }}>{s.lbl}</p>
              </div>
            ))}
          </div>
        </StoryContent>
      </StorySection>

      <ValuesSection>
        <ValuesInner>
          <ValuesHeader>
            <Tag style={{ color: 'var(--gold)', fontSize: 11, letterSpacing: '0.25em', textTransform: 'uppercase', marginBottom: 12, display: 'block' }}>
              Ce qui nous definit
            </Tag>
            <ValuesTitle>Nos <em>Engagements</em></ValuesTitle>
          </ValuesHeader>
          <ValuesGrid>
            {VALUES.map((v, i) => (
              <ValueCard
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ValueNum>{v.num}</ValueNum>
                <ValueTitle>{v.title}</ValueTitle>
                <ValueText>{v.text}</ValueText>
              </ValueCard>
            ))}
          </ValuesGrid>
        </ValuesInner>
      </ValuesSection>

      <ArtistsSection>
        <ArtistsInner>
          <ArtistsHeader>
            <ArtistsTitle>Nos <em>Artistes</em></ArtistsTitle>
            <Link href="/products" style={{ fontSize: 13, color: 'var(--gold-light)', letterSpacing: '0.08em' }}>
              Voir toutes les oeuvres →
            </Link>
          </ArtistsHeader>
          <ArtistsGrid>
            {ARTISTS.map((artist, i) => (
              <ArtistCard
                key={i}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <ArtistImage>
                  <Image src={artist.img} alt={artist.name} fill style={{ objectFit: 'cover' }} />
                </ArtistImage>
                <ArtistName>{artist.name}</ArtistName>
                <ArtistSpec>{artist.spec}</ArtistSpec>
                <ArtistBio>{artist.bio}</ArtistBio>
              </ArtistCard>
            ))}
          </ArtistsGrid>
        </ArtistsInner>
      </ArtistsSection>

      <CTASection>
        <CTATitle>Pret a <em>transformer</em><br />votre espace ?</CTATitle>
        <CTASub>
          Decouvrez notre collection et trouvez l&apos;oeuvre
          qui donnera une nouvelle dimension a votre interieur.
        </CTASub>
        <CTABtns>
          <PrimaryBtn href="/products">Explorer la boutique</PrimaryBtn>
          <SecBtn href="/visualizer">Visualiser dans mon espace</SecBtn>
        </CTABtns>
      </CTASection>


    </Page>
  );
}
