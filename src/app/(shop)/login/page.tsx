'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Suspense } from 'react';

const Page = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;

  @media (max-width: 900px) { grid-template-columns: 1fr; }
`;

const LeftPanel = styled.div`
  background: var(--off-black);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px;
  position: relative;
  overflow: hidden;

  @media (max-width: 900px) { display: none; }

  &::before {
    content: '';
    position: absolute;
    top: -200px; left: -200px;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(201,168,76,0.08) 0%, transparent 70%);
  }
`;

const LeftContent = styled.div`
  position: relative;
  z-index: 1;
  max-width: 400px;
`;

const LeftLogo = styled(Link)`
  font-family: var(--font-display);
  font-size: 28px;
  font-weight: 500;
  color: var(--off-white);
  letter-spacing: 0.08em;
  text-transform: uppercase;
  display: block;
  margin-bottom: 60px;
  span { color: var(--gold); }
`;

const LeftQuote = styled.blockquote`
  font-family: var(--font-display);
  font-size: 36px;
  font-weight: 300;
  font-style: italic;
  color: var(--off-white);
  line-height: 1.2;
  margin-bottom: 24px;

  em { color: var(--gold-light); }
`;

const LeftSub = styled.p`
  font-size: 14px;
  color: var(--mid-gray);
  line-height: 1.7;
`;

const Decoration = styled.div`
  position: absolute;
  bottom: 60px;
  right: 60px;
  width: 200px;
  height: 200px;
  border: 1px solid rgba(201,168,76,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;

  &::after {
    content: '';
    width: 140px;
    height: 140px;
    border: 1px solid rgba(201,168,76,0.1);
    border-radius: 50%;
  }
`;

const RightPanel = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 60px 40px;
  background: var(--cream);

  @media (max-width: 480px) { padding: 40px 24px; }
`;

const FormCard = styled(motion.div)`
  width: 100%;
  max-width: 420px;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: var(--mid-gray);
  margin-bottom: 40px;
  transition: color 0.2s;

  &:hover { color: var(--black); }
`;

const FormTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 40px;
  font-weight: 400;
  color: var(--black);
  margin-bottom: 8px;
  em { font-style: italic; color: var(--gold-dark); }
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: var(--mid-gray);
  margin-bottom: 40px;
`;

const TabRow = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(0,0,0,0.1);
  margin-bottom: 36px;
`;

const Tab = styled.button<{ $active: boolean }>`
  padding: 12px 24px;
  font-size: 13px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: ${({ $active }) => ($active ? 'var(--black)' : 'var(--mid-gray)')};
  border-bottom: 2px solid ${({ $active }) => ($active ? 'var(--gold)' : 'transparent')};
  transition: all 0.2s;

  &:hover { color: var(--black); }
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const Label = styled.label`
  display: block;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--charcoal);
  margin-bottom: 8px;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const Input = styled.input`
  width: 100%;
  padding: 14px 16px;
  border: 1px solid rgba(0,0,0,0.12);
  border-radius: var(--radius-sm);
  font-size: 15px;
  font-family: var(--font-body);
  background: var(--white);
  color: var(--black);
  outline: none;
  transition: border-color 0.2s, box-shadow 0.2s;

  &:focus {
    border-color: var(--gold);
    box-shadow: 0 0 0 3px rgba(201,168,76,0.12);
  }

  &::placeholder { color: var(--light-gray); }
`;

const ShowPwdBtn = styled.button`
  position: absolute;
  right: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--mid-gray);
  display: flex;
  align-items: center;
  transition: color 0.2s;

  &:hover { color: var(--black); }
`;

const SubmitBtn = styled(motion.button)`
  width: 100%;
  padding: 16px;
  background: var(--black);
  color: var(--off-white);
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  border-radius: 2px;
  margin-top: 8px;
  transition: background 0.25s;

  &:hover { background: var(--gold-dark); }
  &:disabled { opacity: 0.6; cursor: not-allowed; }
`;

const Divider = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 24px 0;
  font-size: 12px;
  color: var(--light-gray);

  &::before, &::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(0,0,0,0.1);
  }
`;

const ForgotLink = styled(Link)`
  font-size: 13px;
  color: var(--mid-gray);
  float: right;
  transition: color 0.2s;
  &:hover { color: var(--gold-dark); }
`;

const ErrorMsg = styled.p`
  font-size: 13px;
  color: var(--error);
  margin-top: 4px;
`;

function LoginContent() {
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [showPwd, setShowPwd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [registerForm, setRegisterForm] = useState({ fullName: '', email: '', password: '', confirm: '' });

  const { signIn, signUp } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const handleLogin = async () => {
    if (!loginForm.email || !loginForm.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signIn(loginForm.email, loginForm.password);
    setLoading(false);
    if (error) {
      setError('Email ou mot de passe incorrect');
    } else {
      toast.success('Bienvenue !');
      router.push(redirect);
    }
  };

  const handleRegister = async () => {
    if (!registerForm.fullName || !registerForm.email || !registerForm.password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    if (registerForm.password !== registerForm.confirm) {
      setError('Les mots de passe ne correspondent pas');
      return;
    }
    if (registerForm.password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères');
      return;
    }
    setLoading(true);
    setError('');
    const { error } = await signUp(registerForm.email, registerForm.password, registerForm.fullName);
    setLoading(false);
    if (error) {
      setError(error);
    } else {
      toast.success('Compte créé ! Vérifiez votre email.');
    }
  };

  return (
    <Page>
      <LeftPanel>
        <LeftContent>
          <LeftLogo href="/">Art<span>Wall</span> Studio</LeftLogo>
          <LeftQuote>
            L&apos;art transforme <em>chaque espace</em> en une œuvre vivante
          </LeftQuote>
          <LeftSub>
            Rejoignez notre communauté de passionnés d&apos;art et de décoration. 
            Accédez à des collections exclusives et des offres réservées à nos membres.
          </LeftSub>
        </LeftContent>
        <Decoration />
      </LeftPanel>

      <RightPanel>
        <FormCard
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <BackLink href="/">
            <ArrowLeft size={16} />
            Retour à la boutique
          </BackLink>

          <FormTitle>
            {tab === 'login' ? <>Bon <em>retour</em></> : <>Créer un <em>compte</em></>}
          </FormTitle>
          <FormSubtitle>
            {tab === 'login'
              ? 'Connectez-vous pour accéder à vos commandes et favoris'
              : 'Rejoignez ArtWall Studio dès aujourd\'hui'}
          </FormSubtitle>

          <TabRow>
            <Tab $active={tab === 'login'} onClick={() => { setTab('login'); setError(''); }}>
              Connexion
            </Tab>
            <Tab $active={tab === 'register'} onClick={() => { setTab('register'); setError(''); }}>
              Inscription
            </Tab>
          </TabRow>

          {tab === 'login' ? (
            <>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                  <Label style={{ margin: 0 }}>Mot de passe</Label>
                  <ForgotLink href="/forgot-password">Oublié ?</ForgotLink>
                </div>
                <InputWrapper>
                  <Input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="••••••••"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                    style={{ paddingRight: 44 }}
                  />
                  <ShowPwdBtn type="button" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </ShowPwdBtn>
                </InputWrapper>
              </FormGroup>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <SubmitBtn onClick={handleLogin} disabled={loading} whileTap={{ scale: 0.99 }}>
                {loading ? 'Connexion...' : 'Se connecter'}
              </SubmitBtn>
            </>
          ) : (
            <>
              <FormGroup>
                <Label>Nom complet</Label>
                <Input
                  placeholder="Mohammed Alami"
                  value={registerForm.fullName}
                  onChange={(e) => setRegisterForm({ ...registerForm, fullName: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Email</Label>
                <Input
                  type="email"
                  placeholder="votre@email.com"
                  value={registerForm.email}
                  onChange={(e) => setRegisterForm({ ...registerForm, email: e.target.value })}
                />
              </FormGroup>
              <FormGroup>
                <Label>Mot de passe</Label>
                <InputWrapper>
                  <Input
                    type={showPwd ? 'text' : 'password'}
                    placeholder="Min. 8 caractères"
                    value={registerForm.password}
                    onChange={(e) => setRegisterForm({ ...registerForm, password: e.target.value })}
                    style={{ paddingRight: 44 }}
                  />
                  <ShowPwdBtn type="button" onClick={() => setShowPwd(!showPwd)}>
                    {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
                  </ShowPwdBtn>
                </InputWrapper>
              </FormGroup>
              <FormGroup>
                <Label>Confirmer le mot de passe</Label>
                <Input
                  type="password"
                  placeholder="••••••••"
                  value={registerForm.confirm}
                  onChange={(e) => setRegisterForm({ ...registerForm, confirm: e.target.value })}
                  onKeyDown={(e) => e.key === 'Enter' && handleRegister()}
                />
              </FormGroup>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <SubmitBtn onClick={handleRegister} disabled={loading} whileTap={{ scale: 0.99 }}>
                {loading ? 'Création...' : 'Créer mon compte'}
              </SubmitBtn>
              <p style={{ fontSize: 12, color: 'var(--mid-gray)', marginTop: 16, textAlign: 'center', lineHeight: 1.6 }}>
                En créant un compte, vous acceptez nos{' '}
                <Link href="/terms" style={{ color: 'var(--gold-dark)' }}>CGV</Link>{' '}
                et notre{' '}
                <Link href="/privacy" style={{ color: 'var(--gold-dark)' }}>Politique de confidentialité</Link>
              </p>
            </>
          )}
        </FormCard>
      </RightPanel>
    </Page>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', background: 'var(--cream)' }} />}>
      <LoginContent />
    </Suspense>
  );
}
