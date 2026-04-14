'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Mail, Phone, MapPin, Clock, Send, MessageSquare } from 'lucide-react';
import toast from 'react-hot-toast';

const Page = styled.div`
  padding-top: var(--nav-height);
  min-height: 100vh;
  background: var(--cream);
`;

const Header = styled.div`
  background: var(--off-black);
  padding: 80px 40px 60px;
  @media (max-width: 768px) { padding: 60px 20px 40px; }
`;

const Eyebrow = styled.p`
  font-size: 11px; letter-spacing: 0.25em; text-transform: uppercase;
  color: var(--gold); margin-bottom: 16px;
`;

const Title = styled.h1`
  font-family: var(--font-display);
  font-size: clamp(40px, 6vw, 72px);
  font-weight: 300;
  color: var(--off-white);
  line-height: 1.08;
  max-width: 600px;
  em { font-style: italic; color: var(--gold-light); }
`;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 80px 40px;
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 80px;
  align-items: start;
  @media (max-width: 1024px) { grid-template-columns: 1fr; gap: 60px; }
  @media (max-width: 768px) { padding: 60px 20px; }
`;

const InfoSection = styled.div``;

const InfoTitle = styled.h2`
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 400;
  margin-bottom: 12px;
  em { font-style: italic; color: var(--gold-dark); }
`;

const InfoText = styled.p`
  font-size: 15px;
  color: var(--mid-gray);
  line-height: 1.8;
  margin-bottom: 40px;
`;

const ContactItems = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 48px;
`;

const ContactItem = styled.div`
  display: flex;
  gap: 16px;
  align-items: flex-start;
`;

const IconBox = styled.div`
  width: 44px; height: 44px;
  border-radius: 50%;
  background: rgba(201,168,76,0.1);
  display: flex; align-items: center; justify-content: center;
  color: var(--gold);
  flex-shrink: 0;
`;

const ContactText = styled.div`
  p:first-child {
    font-size: 12px;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--mid-gray);
    margin-bottom: 4px;
  }
  p:last-child {
    font-size: 15px;
    color: var(--black);
    line-height: 1.5;
  }
`;

const TopicsGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
`;

const TopicCard = styled.div`
  padding: 16px;
  background: var(--white);
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0,0,0,0.06);
  transition: border-color 0.2s, box-shadow 0.2s;

  &:hover {
    border-color: rgba(201,168,76,0.3);
    box-shadow: var(--shadow-sm);
  }

  p:first-child {
    font-size: 13px;
    font-weight: 500;
    color: var(--black);
    margin-bottom: 4px;
  }
  p:last-child {
    font-size: 12px;
    color: var(--mid-gray);
    line-height: 1.5;
  }
`;

const FormCard = styled(motion.div)`
  background: var(--white);
  border-radius: var(--radius-sm);
  padding: 40px;
  box-shadow: var(--shadow-md);
  @media (max-width: 480px) { padding: 28px 20px; }
`;

const FormTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 24px;
  font-weight: 400;
  margin-bottom: 28px;
  padding-bottom: 20px;
  border-bottom: 1px solid rgba(0,0,0,0.07);
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  @media (max-width: 480px) { grid-template-columns: 1fr; }
`;

const Full = styled.div` grid-column: 1/-1; `;

const FG = styled.div`
  display: flex; flex-direction: column; gap: 6px;
`;

const Lbl = styled.label`
  font-size: 12px; font-weight: 500; letter-spacing: 0.06em;
  text-transform: uppercase; color: var(--charcoal);
`;

const Inp = styled.input`
  padding: 13px 16px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: var(--radius-sm);
  font-size: 14px; font-family: var(--font-body);
  background: var(--cream); color: var(--black);
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  &:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
  &::placeholder { color: var(--light-gray); }
`;

const Textarea = styled.textarea`
  padding: 13px 16px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: var(--radius-sm);
  font-size: 14px; font-family: var(--font-body);
  background: var(--cream); color: var(--black);
  min-height: 140px; resize: vertical;
  outline: none; transition: border-color 0.2s, box-shadow 0.2s;
  &:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,0.1); }
  &::placeholder { color: var(--light-gray); }
`;

const Sel = styled.select`
  padding: 13px 16px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: var(--radius-sm);
  font-size: 14px; font-family: var(--font-body);
  background: var(--cream); color: var(--black);
  outline: none; cursor: pointer; appearance: none;
  &:focus { border-color: var(--gold); outline: none; }
`;

const SubmitBtn = styled(motion.button)`
  display: flex; align-items: center; justify-content: center; gap: 10px;
  width: 100%; padding: 16px;
  background: var(--black); color: var(--off-white);
  font-size: 13px; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase;
  border-radius: 2px; margin-top: 8px; transition: background 0.25s;
  &:hover { background: var(--gold-dark); }
`;

const SuccessMsg = styled(motion.div)`
  text-align: center;
  padding: 40px 20px;
  svg { margin: 0 auto 16px; display: block; color: var(--success); }
  h3 { font-family: var(--font-display); font-size: 28px; font-weight: 400; margin-bottom: 8px; }
  p { color: var(--mid-gray); font-size: 14px; }
`;

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.email || !form.message) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    await new Promise(r => setTimeout(r, 1500));
    setLoading(false);
    setSent(true);
  };

  return (
    <Page>
      <Header>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          <Eyebrow>Service Client</Eyebrow>
          <Title>Comment pouvons-nous<br />vous <em>aider</em> ?</Title>
        </div>
      </Header>

      <Container>
        <InfoSection>
          <InfoTitle>Nous sommes <em>disponibles</em></InfoTitle>
          <InfoText>
            Notre equipe est a votre disposition pour repondre a toutes vos questions
            sur nos produits, commandes et livraisons.
          </InfoText>

          <ContactItems>
            {[
              { icon: Mail, label: 'Email', value: 'contact@artwallstudio.ma' },
              { icon: Phone, label: 'Telephone', value: '+212 522 XX XX XX' },
              { icon: MapPin, label: 'Adresse', value: 'Boulevard Mohammed V\nCasablanca 20000, Maroc' },
              { icon: Clock, label: 'Horaires', value: 'Lun–Ven: 9h–18h\nSam: 10h–14h' },
            ].map((item, i) => (
              <ContactItem key={i}>
                <IconBox><item.icon size={20} /></IconBox>
                <ContactText>
                  <p>{item.label}</p>
                  <p style={{ whiteSpace: 'pre-line' }}>{item.value}</p>
                </ContactText>
              </ContactItem>
            ))}
          </ContactItems>

          <p style={{ fontSize: 12, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--mid-gray)', marginBottom: 16 }}>
            Sujets frequents
          </p>
          <TopicsGrid>
            {[
              { title: 'Suivi commande', desc: 'Etat et livraison' },
              { title: 'Retours', desc: '30 jours offerts' },
              { title: 'Dimensions', desc: 'Conseil sur mesure' },
              { title: 'Paiement', desc: 'Modes acceptes' },
            ].map((t, i) => (
              <TopicCard key={i}>
                <p>{t.title}</p>
                <p>{t.desc}</p>
              </TopicCard>
            ))}
          </TopicsGrid>
        </InfoSection>

        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {sent ? (
            <SuccessMsg initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <MessageSquare size={48} />
              <h3>Message envoye !</h3>
              <p style={{ marginBottom: 24 }}>
                Merci pour votre message. Notre equipe vous repondra dans les 24h.
              </p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', subject: '', message: '' }); }}
                style={{ fontSize: 13, color: 'var(--gold-dark)', textDecoration: 'underline', cursor: 'pointer' }}
              >
                Envoyer un autre message
              </button>
            </SuccessMsg>
          ) : (
            <>
              <FormTitle>Envoyer un message</FormTitle>
              <FormGrid>
                <FG>
                  <Lbl>Nom *</Lbl>
                  <Inp placeholder="Mohammed Alami" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                </FG>
                <FG>
                  <Lbl>Email *</Lbl>
                  <Inp type="email" placeholder="votre@email.com" value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
                </FG>
                <Full>
                  <FG>
                    <Lbl>Sujet</Lbl>
                    <Sel value={form.subject} onChange={e => setForm({...form, subject: e.target.value})}>
                      <option value="">Choisir un sujet</option>
                      <option>Suivi de commande</option>
                      <option>Retour / Echange</option>
                      <option>Question produit</option>
                      <option>Probleme de paiement</option>
                      <option>Commande sur mesure</option>
                      <option>Autre</option>
                    </Sel>
                  </FG>
                </Full>
                <Full>
                  <FG>
                    <Lbl>Message *</Lbl>
                    <Textarea
                      placeholder="Decrivez votre demande en detail..."
                      value={form.message}
                      onChange={e => setForm({...form, message: e.target.value})}
                    />
                  </FG>
                </Full>
              </FormGrid>
              <SubmitBtn onClick={handleSubmit} disabled={loading} whileTap={{ scale: 0.99 }}>
                {loading ? 'Envoi en cours...' : <><Send size={15} />Envoyer le message</>}
              </SubmitBtn>
              <p style={{ fontSize: 12, color: 'var(--mid-gray)', textAlign: 'center', marginTop: 16 }}>
                Reponse garantie sous 24h (jours ouvres)
              </p>
            </>
          )}
        </FormCard>
      </Container>

    </Page>
  );
}
