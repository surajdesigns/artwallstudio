'use client';

import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import toast from 'react-hot-toast';

const Wrap = styled.div`
  margin-top: 32px;
  padding-top: 32px;
  border-top: 1px solid rgba(0,0,0,0.07);
`;

const Title = styled.h4`
  font-family: var(--font-display);
  font-size: 22px;
  font-weight: 400;
  margin-bottom: 20px;
`;

const StarRow = styled.div`
  display: flex;
  gap: 6px;
  margin-bottom: 20px;
`;

const StarBtn = styled.button<{ $active: boolean }>`
  color: ${({ $active }) => ($active ? 'var(--gold)' : 'var(--light-gray)')};
  transition: color 0.15s, transform 0.15s;
  &:hover { color: var(--gold); transform: scale(1.2); }
`;

const FG = styled.div`
  display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px;
`;

const Lbl = styled.label`
  font-size: 12px; font-weight: 500; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--charcoal);
`;

const Inp = styled.input`
  padding: 12px 14px;
  border: 1px solid rgba(0,0,0,0.12); border-radius: var(--radius-sm);
  font-size: 14px; font-family: var(--font-body);
  background: var(--cream); color: var(--black); outline: none;
  transition: border-color 0.2s;
  &:focus { border-color: var(--gold); }
  &::placeholder { color: var(--light-gray); }
`;

const Textarea = styled.textarea`
  padding: 12px 14px;
  border: 1px solid rgba(0,0,0,0.12); border-radius: var(--radius-sm);
  font-size: 14px; font-family: var(--font-body);
  background: var(--cream); color: var(--black); outline: none;
  min-height: 100px; resize: vertical;
  transition: border-color 0.2s;
  &:focus { border-color: var(--gold); }
  &::placeholder { color: var(--light-gray); }
`;

const SubmitBtn = styled(motion.button)`
  display: flex; align-items: center; gap: 8px;
  padding: 13px 28px;
  background: var(--black); color: var(--off-white);
  border-radius: 2px; font-size: 13px; letter-spacing: 0.1em; text-transform: uppercase;
  transition: background 0.2s;
  &:hover { background: var(--gold-dark); }
`;

const SuccessNote = styled(motion.p)`
  font-size: 14px;
  color: var(--success);
  padding: 12px 16px;
  background: rgba(76,170,112,0.08);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(76,170,112,0.2);
`;

interface Props {
  productId: string;
  onSuccess?: () => void;
}

export default function ReviewForm({ productId, onSuccess }: Props) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async () => {
    if (rating === 0) { toast.error('Veuillez choisir une note'); return; }
    if (!body.trim()) { toast.error('Veuillez ecrire votre avis'); return; }

    setLoading(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, rating, title, body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setSubmitted(true);
      onSuccess?.();
    } catch (e: unknown) {
      toast.error(e instanceof Error ? e.message : 'Erreur');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <Wrap>
        <SuccessNote
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Merci pour votre avis ! Il sera publie apres validation par notre equipe.
        </SuccessNote>
      </Wrap>
    );
  }

  return (
    <Wrap>
      <Title>Laisser un avis</Title>

      <FG>
        <Lbl>Votre note *</Lbl>
        <StarRow>
          {[1, 2, 3, 4, 5].map((n) => (
            <StarBtn
              key={n}
              $active={n <= (hover || rating)}
              onClick={() => setRating(n)}
              onMouseEnter={() => setHover(n)}
              onMouseLeave={() => setHover(0)}
            >
              <Star size={28} fill={n <= (hover || rating) ? 'currentColor' : 'none'} />
            </StarBtn>
          ))}
        </StarRow>
      </FG>

      <FG>
        <Lbl>Titre (optionnel)</Lbl>
        <Inp
          placeholder="Resumez votre experience"
          value={title}
          onChange={e => setTitle(e.target.value)}
          maxLength={80}
        />
      </FG>

      <FG>
        <Lbl>Votre avis *</Lbl>
        <Textarea
          placeholder="Partagez votre experience avec ce produit..."
          value={body}
          onChange={e => setBody(e.target.value)}
          maxLength={1000}
        />
        <p style={{ fontSize: 11, color: 'var(--light-gray)', textAlign: 'right' }}>{body.length}/1000</p>
      </FG>

      <SubmitBtn onClick={handleSubmit} disabled={loading} whileTap={{ scale: 0.99 }}>
        {loading ? 'Envoi...' : <><Send size={14} />Publier mon avis</>}
      </SubmitBtn>
      <p style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 10 }}>
        Les avis sont verifies avant publication.
      </p>
    </Wrap>
  );
}
