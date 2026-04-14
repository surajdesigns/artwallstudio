'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Upload, Wand2, RotateCcw, Download, ZoomIn, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import toast from 'react-hot-toast';

const Page = styled.div`
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--off-black);
`;

const Hero = styled.div`
  background: var(--off-black);
  padding: 80px 40px 60px;
  text-align: center;
  border-bottom: 1px solid rgba(201,168,76,0.12);

  @media (max-width: 768px) { padding: 60px 20px 40px; }
`;

const Eyebrow = styled.p`
  font-size: 11px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: var(--gold);
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(36px, 5vw, 64px);
  font-weight: 400;
  color: var(--off-white);
  line-height: 1.1;
  margin-bottom: 20px;
  em { font-style: italic; color: var(--gold-light); }
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: var(--mid-gray);
  max-width: 520px;
  margin: 0 auto;
  line-height: 1.8;
`;

const MainArea = styled.div`
  max-width: 1400px;
  margin: 0 auto;
  padding: 60px 40px;
  display: grid;
  grid-template-columns: 1fr 360px;
  gap: 40px;

  @media (max-width: 1100px) { grid-template-columns: 1fr; }
  @media (max-width: 768px) { padding: 40px 20px; }
`;

const VisualizerArea = styled.div``;

const UploadZone = styled.div<{ $hasImage: boolean }>`
  position: relative;
  aspect-ratio: 16/9;
  border-radius: var(--radius-sm);
  overflow: hidden;
  background: var(--charcoal);
  border: 2px dashed ${({ $hasImage }) => ($hasImage ? 'transparent' : 'rgba(201,168,76,0.25)')};
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: border-color 0.3s;

  &:hover {
    border-color: ${({ $hasImage }) => ($hasImage ? 'transparent' : 'rgba(201,168,76,0.5)')};
  }
`;

const UploadPrompt = styled.div`
  text-align: center;
  padding: 40px;
  color: var(--mid-gray);

  svg { margin: 0 auto 16px; opacity: 0.5; display: block; }

  h3 {
    font-family: var(--font-display);
    font-size: 22px;
    font-weight: 400;
    color: var(--off-white);
    margin-bottom: 8px;
  }

  p { font-size: 14px; line-height: 1.7; }

  span {
    display: inline-block;
    margin-top: 20px;
    padding: 10px 24px;
    border: 1px solid rgba(201,168,76,0.4);
    border-radius: 2px;
    font-size: 13px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--gold-light);
    transition: all 0.2s;
  }

  &:hover span {
    background: rgba(201,168,76,0.1);
    border-color: var(--gold);
  }
`;

const RoomImage = styled.div`
  position: absolute;
  inset: 0;
`;

const ArtworkOverlay = styled(motion.div)<{ $x: number; $y: number; $w: number; $h: number }>`
  position: absolute;
  left: ${({ $x }) => $x}%;
  top: ${({ $y }) => $y}%;
  width: ${({ $w }) => $w}%;
  height: ${({ $h }) => $h}%;
  cursor: move;
  box-shadow: 0 8px 40px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.4);
`;

const ControlBar = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 16px;
  flex-wrap: wrap;
`;

const ControlBtn = styled.button<{ $variant?: 'gold' | 'danger' }>`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  border-radius: 2px;
  font-size: 12px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: all 0.2s;
  background: ${({ $variant }) =>
    $variant === 'gold' ? 'var(--gold)' :
    $variant === 'danger' ? 'rgba(201,76,76,0.1)' :
    'rgba(255,255,255,0.06)'};
  color: ${({ $variant }) =>
    $variant === 'gold' ? 'var(--black)' :
    $variant === 'danger' ? 'var(--error)' :
    'var(--light-gray)'};
  border: 1px solid ${({ $variant }) =>
    $variant === 'gold' ? 'transparent' :
    $variant === 'danger' ? 'rgba(201,76,76,0.3)' :
    'rgba(255,255,255,0.08)'};

  &:hover {
    background: ${({ $variant }) =>
      $variant === 'gold' ? 'var(--gold-light)' :
      $variant === 'danger' ? 'rgba(201,76,76,0.15)' :
      'rgba(255,255,255,0.1)'};
    color: ${({ $variant }) => $variant === 'gold' ? 'var(--black)' : 'var(--off-white)'};
  }
`;

const ScaleSlider = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  flex: 1;
  min-width: 160px;

  label {
    font-size: 11px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mid-gray);
    white-space: nowrap;
  }

  input {
    flex: 1;
    accent-color: var(--gold);
  }
`;

// Sidebar
const Sidebar = styled.div``;

const SideSection = styled.div`
  background: rgba(255,255,255,0.04);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: var(--radius-sm);
  padding: 24px;
  margin-bottom: 20px;
`;

const SideSectionTitle = styled.h3`
  font-size: 11px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--mid-gray);
  margin-bottom: 16px;
`;

const ArtworkGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 8px;
`;

const ArtworkThumb = styled.div<{ $selected: boolean }>`
  position: relative;
  aspect-ratio: 3/4;
  border-radius: var(--radius-sm);
  overflow: hidden;
  cursor: pointer;
  border: 2px solid ${({ $selected }) => ($selected ? 'var(--gold)' : 'transparent')};
  transition: all 0.2s;

  &:hover { border-color: rgba(201,168,76,0.5); transform: scale(1.03); }
`;

const RoomPresets = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
`;

const RoomPreset = styled.button<{ $selected: boolean }>`
  position: relative;
  aspect-ratio: 16/9;
  border-radius: var(--radius-sm);
  overflow: hidden;
  border: 2px solid ${({ $selected }) => ($selected ? 'var(--gold)' : 'transparent')};
  transition: all 0.2s;
  cursor: pointer;

  &:hover { border-color: rgba(201,168,76,0.5); }

  span {
    position: absolute;
    bottom: 4px;
    left: 0; right: 0;
    text-align: center;
    font-size: 9px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: rgba(255,255,255,0.8);
    text-shadow: 0 1px 4px rgba(0,0,0,0.8);
  }
`;

const ColorOptions = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
`;

const ColorChip = styled.button<{ $color: string; $selected: boolean }>`
  width: 32px; height: 32px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 3px solid ${({ $selected }) => ($selected ? 'var(--gold)' : 'transparent')};
  outline: 1px solid rgba(255,255,255,0.15);
  outline-offset: 2px;
  transition: all 0.2s;
  cursor: pointer;
  &:hover { transform: scale(1.1); }
`;

const ProductInfo = styled.div`
  margin-top: 20px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.06);
`;

const ArtName = styled.p`
  font-family: var(--font-display);
  font-size: 20px;
  font-weight: 400;
  color: var(--off-white);
  margin-bottom: 6px;
`;

const ArtPrice = styled.p`
  font-size: 18px;
  color: var(--gold-light);
  font-weight: 500;
  margin-bottom: 16px;
`;

const AddBtn = styled(Link)`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 14px;
  background: var(--gold);
  color: var(--black);
  border-radius: 2px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background 0.2s;
  &:hover { background: var(--gold-light); }
`;

// Data
const ARTWORKS = [
  { id: '1', name: 'Harmonie Abstraite', slug: 'harmonie-abstraite-3', price: 1890, img: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&q=80' },
  { id: '2', name: 'Foret Tropicale', slug: 'foret-tropicale', price: 2450, img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400&q=80' },
  { id: '3', name: 'Geometrie Doree', slug: 'geometrie-doree', price: 980, img: 'https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=400&q=80' },
  { id: '4', name: 'Portrait', slug: 'portrait-minimaliste', price: 1450, img: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?w=400&q=80' },
  { id: '5', name: 'Botanique', slug: 'botanique-exotique', price: 2100, img: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=400&q=80' },
  { id: '6', name: 'Coucher de Soleil', slug: 'coucher-soleil', price: 1750, img: 'https://images.unsplash.com/photo-1504805572947-34fad45aed93?w=400&q=80' },
];

const ROOM_PRESETS = [
  { id: 'salon', label: 'Salon', img: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&q=70' },
  { id: 'bureau', label: 'Bureau', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&q=70' },
  { id: 'chambre', label: 'Chambre', img: 'https://images.unsplash.com/photo-1540518614846-7eded433c457?w=800&q=70' },
  { id: 'couloir', label: 'Couloir', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=70' },
];

const WALL_COLORS = [
  { name: 'Blanc', hex: '#f5f3ee' },
  { name: 'Gris', hex: '#d4d0c8' },
  { name: 'Beige', hex: '#e8dcc8' },
  { name: 'Sage', hex: '#c8d4c0' },
  { name: 'Anthracite', hex: '#3a3a36' },
  { name: 'Nuit', hex: '#1a1a2e' },
];

// Art placement positions per room
const PLACEMENTS: Record<string, { x: number; y: number; w: number; h: number }> = {
  salon: { x: 30, y: 12, w: 22, h: 42 },
  bureau: { x: 55, y: 8, w: 18, h: 38 },
  chambre: { x: 38, y: 10, w: 24, h: 40 },
  couloir: { x: 36, y: 15, w: 20, h: 50 },
};

export default function VisualizerPage() {
  const [roomImage, setRoomImage] = useState(ROOM_PRESETS[0].img);
  const [selectedRoom, setSelectedRoom] = useState('salon');
  const [selectedArt, setSelectedArt] = useState(ARTWORKS[0]);
  const [wallColor, setWallColor] = useState('#f5f3ee');
  const [artScale, setArtScale] = useState(100);
  const [showArt, setShowArt] = useState(true);
  const fileRef = useRef<HTMLInputElement>(null);

  const placement = PLACEMENTS[selectedRoom] || PLACEMENTS.salon;
  const scaledW = (placement.w * artScale) / 100;
  const scaledH = (placement.h * artScale) / 100;
  const scaledX = placement.x + (placement.w - scaledW) / 2;
  const scaledY = placement.y + (placement.h - scaledH) / 2;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setRoomImage(url);
    setSelectedRoom('custom');
    toast.success('Photo chargee !');
  };

  const handleRoomPreset = (preset: typeof ROOM_PRESETS[0]) => {
    setRoomImage(preset.img);
    setSelectedRoom(preset.id);
  };

  return (
    <Page>
      <Hero>
        <Eyebrow><Sparkles size={14} />Nouveau</Eyebrow>
        <Title>Visualisez l&apos;Art<br />dans votre <em>Espace</em></Title>
        <Subtitle>
          Uploadez une photo de votre pièce ou choisissez un preset,
          puis positionnez nos oeuvres sur vos murs avant d&apos;acheter.
        </Subtitle>
      </Hero>

      <MainArea>
        <VisualizerArea>
          <input
            ref={fileRef}
            type="file"
            accept="image/*"
            style={{ display: 'none' }}
            onChange={handleFileUpload}
          />

          <UploadZone $hasImage={!!roomImage} onClick={() => !roomImage && fileRef.current?.click()}>
            {!roomImage ? (
              <UploadPrompt>
                <Upload size={48} />
                <h3>Uploadez votre pièce</h3>
                <p>Glissez une photo ou cliquez pour parcourir.<br />JPG, PNG jusqu&apos;à 10 MB.</p>
                <span>Choisir une photo</span>
              </UploadPrompt>
            ) : (
              <>
                <RoomImage>
                  <Image src={roomImage} alt="Room" fill style={{ objectFit: 'cover' }} />
                </RoomImage>

                <AnimatePresence>
                  {showArt && (
                    <ArtworkOverlay
                      $x={scaledX}
                      $y={scaledY}
                      $w={scaledW}
                      $h={scaledH}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <Image
                        src={selectedArt.img}
                        alt={selectedArt.name}
                        fill
                        style={{ objectFit: 'cover' }}
                      />
                    </ArtworkOverlay>
                  )}
                </AnimatePresence>
              </>
            )}
          </UploadZone>

          <ControlBar>
            <ControlBtn $variant="gold" onClick={() => fileRef.current?.click()}>
              <Upload size={15} />
              Changer la photo
            </ControlBtn>

            <ControlBtn onClick={() => setShowArt(!showArt)}>
              <ZoomIn size={15} />
              {showArt ? 'Masquer' : 'Afficher'} l&apos;oeuvre
            </ControlBtn>

            <ControlBtn onClick={() => { setRoomImage(''); setSelectedRoom(''); }} $variant="danger">
              <RotateCcw size={15} />
              Réinitialiser
            </ControlBtn>

            <ScaleSlider>
              <label>Taille</label>
              <input
                type="range"
                min={40}
                max={180}
                value={artScale}
                onChange={(e) => setArtScale(+e.target.value)}
              />
              <span style={{ fontSize: 12, color: 'var(--mid-gray)', width: 36 }}>{artScale}%</span>
            </ScaleSlider>
          </ControlBar>
        </VisualizerArea>

        {/* Sidebar */}
        <Sidebar>
          {/* Room presets */}
          <SideSection>
            <SideSectionTitle>Choisir une pièce</SideSectionTitle>
            <RoomPresets>
              {ROOM_PRESETS.map((room) => (
                <RoomPreset
                  key={room.id}
                  $selected={selectedRoom === room.id}
                  onClick={() => handleRoomPreset(room)}
                >
                  <Image src={room.img} alt={room.label} fill style={{ objectFit: 'cover' }} />
                  <span>{room.label}</span>
                </RoomPreset>
              ))}
            </RoomPresets>
          </SideSection>

          {/* Wall colors */}
          <SideSection>
            <SideSectionTitle>Couleur des murs</SideSectionTitle>
            <ColorOptions>
              {WALL_COLORS.map((c) => (
                <ColorChip
                  key={c.name}
                  $color={c.hex}
                  $selected={wallColor === c.hex}
                  onClick={() => setWallColor(c.hex)}
                  title={c.name}
                />
              ))}
            </ColorOptions>
          </SideSection>

          {/* Artwork selection */}
          <SideSection>
            <SideSectionTitle>Choisir une oeuvre</SideSectionTitle>
            <ArtworkGrid>
              {ARTWORKS.map((art) => (
                <ArtworkThumb
                  key={art.id}
                  $selected={selectedArt.id === art.id}
                  onClick={() => setSelectedArt(art)}
                >
                  <Image src={art.img} alt={art.name} fill style={{ objectFit: 'cover' }} />
                </ArtworkThumb>
              ))}
            </ArtworkGrid>

            <ProductInfo>
              <ArtName>{selectedArt.name}</ArtName>
              <ArtPrice>{selectedArt.price.toFixed(2)} MAD</ArtPrice>
              <AddBtn href={"/products/" + selectedArt.slug}>
                Voir le produit
              </AddBtn>
            </ProductInfo>
          </SideSection>
        </Sidebar>
      </MainArea>
    </Page>
  );
}
