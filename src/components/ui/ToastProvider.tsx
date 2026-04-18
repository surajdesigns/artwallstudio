'use client';

import styled, { keyframes, css } from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useCallback } from 'react';
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react';
import { createContext, useContext } from 'react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastCtx {
  show: (message: string, type?: ToastType, duration?: number) => void;
  success: (message: string) => void;
  error: (message: string) => void;
  info: (message: string) => void;
}

const ToastContext = createContext<ToastCtx>({
  show: () => {},
  success: () => {},
  error: () => {},
  info: () => {},
});

export const useToast = () => useContext(ToastContext);

const Container = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;
`;

const ToastItem = styled(motion.div)<{ $type: ToastType }>`
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 14px 16px;
  border-radius: var(--radius-sm);
  background: var(--off-black);
  border-left: 3px solid ${({ $type }) =>
    $type === 'success' ? 'var(--success)' :
    $type === 'error' ? 'var(--error)' :
    $type === 'warning' ? 'var(--gold)' :
    'rgba(201,168,76,0.6)'};
  box-shadow: var(--shadow-xl);
  pointer-events: all;
  max-width: 360px;
  min-width: 280px;
`;

const IconWrap = styled.div<{ $type: ToastType }>`
  flex-shrink: 0;
  margin-top: 1px;
  color: ${({ $type }) =>
    $type === 'success' ? 'var(--success)' :
    $type === 'error' ? 'var(--error)' :
    $type === 'warning' ? 'var(--gold)' :
    'var(--light-gray)'};
`;

const Msg = styled.p`
  flex: 1;
  font-size: 14px;
  color: var(--off-white);
  line-height: 1.5;
`;

const CloseBtn = styled.button`
  color: var(--mid-gray);
  flex-shrink: 0;
  display: flex;
  align-items: center;
  transition: color 0.2s;
  &:hover { color: var(--off-white); }
`;

const ICONS = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const remove = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const show = useCallback((message: string, type: ToastType = 'info', duration = 4000) => {
    const id = Date.now().toString();
    setToasts(prev => [...prev, { id, message, type, duration }]);
    if (duration > 0) {
      setTimeout(() => remove(id), duration);
    }
  }, [remove]);

  const ctx: ToastCtx = {
    show,
    success: (msg) => show(msg, 'success'),
    error: (msg) => show(msg, 'error'),
    info: (msg) => show(msg, 'info'),
  };

  return (
    <ToastContext.Provider value={ctx}>
      {children}
      <Container>
        <AnimatePresence>
          {toasts.map(toast => {
            const Icon = ICONS[toast.type];
            return (
              <ToastItem
                key={toast.id}
                $type={toast.type}
                initial={{ opacity: 0, x: 60, scale: 0.95 }}
                animate={{ opacity: 1, x: 0, scale: 1 }}
                exit={{ opacity: 0, x: 60, scale: 0.95 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <IconWrap $type={toast.type}><Icon size={18} /></IconWrap>
                <Msg>{toast.message}</Msg>
                <CloseBtn onClick={() => remove(toast.id)}>
                  <X size={14} />
                </CloseBtn>
              </ToastItem>
            );
          })}
        </AnimatePresence>
      </Container>
    </ToastContext.Provider>
  );
}
