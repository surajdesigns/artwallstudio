'use client';

import styled from 'styled-components';
import { motion } from 'framer-motion';

export const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 36px;
  flex-wrap: wrap;
  gap: 16px;
`;

export const PageTitle = styled.h1`
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 400;
  em { font-style: italic; color: var(--gold-dark); }
`;

export const CreateBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: var(--black);
  color: var(--off-white);
  border-radius: 2px;
  font-size: 13px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  transition: background 0.2s;
  &:hover { background: var(--gold-dark); }
`;

export const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  margin-bottom: 36px;

  @media (max-width: 1200px) { grid-template-columns: repeat(2, 1fr); }
  @media (max-width: 600px) { grid-template-columns: 1fr; }
`;

export const StatCard = styled(motion.div)<{ $accent?: string }>`
  background: var(--white);
  border-radius: var(--radius-sm);
  padding: 24px;
  position: relative;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);

  &::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 3px;
    background: ${({ $accent }) => $accent || 'var(--gold)'};
  }
`;

export const StatLabel = styled.p`
  font-size: 11px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--mid-gray);
  margin-bottom: 12px;
`;

export const StatValue = styled.p`
  font-family: var(--font-display);
  font-size: 32px;
  font-weight: 400;
  color: var(--black);
  margin-bottom: 8px;
`;

export const StatDelta = styled.p<{ $positive: boolean }>`
  font-size: 13px;
  color: ${({ $positive }) => ($positive ? 'var(--success)' : 'var(--error)')};
  display: flex;
  align-items: center;
  gap: 4px;
`;

export const TableCard = styled.div`
  background: var(--white);
  border-radius: var(--radius-sm);
  overflow: hidden;
  margin-bottom: 24px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.03);
`;

export const TableHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  flex-wrap: wrap;
  gap: 12px;
`;

export const TableTitle = styled.h3`
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

export const Th = styled.th`
  text-align: left;
  padding: 16px 24px;
  font-size: 11px;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: var(--mid-gray);
  background: #faf9f6;
  border-bottom: 1px solid rgba(0,0,0,0.06);
`;

export const Td = styled.td`
  padding: 16px 24px;
  font-size: 14px;
  border-bottom: 1px solid rgba(0,0,0,0.04);
`;

export const Badge = styled.span<{ $status?: string }>`
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 11px;
  font-weight: 500;
  text-transform: capitalize;
  
  ${({ $status }) => {
    switch ($status) {
      case 'delivered': case 'active': case 'confirmed': return 'background: #e6f4ea; color: #1e7e34;';
      case 'shipped': case 'processing': return 'background: #fff4e5; color: #b25e09;';
      case 'pending': return 'background: #f1f3f4; color: #5f6368;';
      case 'error': case 'cancelled': return 'background: #fce8e6; color: #d93025;';
      default: return 'background: #f1f3f4; color: #5f6368;';
    }
  }}
`;

export const ActionBtn = styled.button`
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  color: var(--mid-gray);
  transition: all 0.2s;
  &:hover { background: #f1f3f4; color: var(--gold-dark); }
`;
