'use client';

import { TrendingUp, ArrowUpRight } from 'lucide-react';
import { 
  PageHeader, PageTitle, StatsGrid, StatCard, StatLabel, StatValue, StatDelta, 
  TableCard, TableHeader, TableTitle, Table, Th, Td, Badge, ActionBtn 
} from '@/components/admin/AdminSharedStyles';
import { DEMO_ORDERS } from '@/lib/admin-data';
import { Eye } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    { label: 'Chiffre d\'affaires', value: '48 290 MAD', delta: '+12.4%', positive: true, accent: 'var(--gold)' },
    { label: 'Commandes', value: '156', delta: '+8.2%', positive: true, accent: 'var(--black)' },
    { label: 'Clients', value: '1,240', delta: '+5.1%', positive: true, accent: 'var(--gold-dark)' },
    { label: 'Conversion', value: '3.2%', delta: '-0.4%', positive: false, accent: 'var(--error)' },
  ];

  return (
    <>
      <PageHeader>
        <PageTitle>Tableau de <em>Bord</em></PageTitle>
      </PageHeader>

      <StatsGrid>
        {stats.map((s, i) => (
          <StatCard key={s.label} $accent={s.accent} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <StatLabel>{s.label}</StatLabel>
            <StatValue>{s.value}</StatValue>
            <StatDelta $positive={s.positive}>
              <TrendingUp size={14} style={{ transform: s.positive ? '' : 'rotate(180deg)' }} />
              {s.delta} ce mois
            </StatDelta>
          </StatCard>
        ))}
      </StatsGrid>

      <TableCard>
        <TableHeader>
          <TableTitle>Commandes Récentes</TableTitle>
          <ActionBtn>Voir tout</ActionBtn>
        </TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>ID</Th>
              <Th>Client</Th>
              <Th>Total</Th>
              <Th>Statut</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ORDERS.slice(0, 5).map((order) => (
              <tr key={order.id}>
                <Td style={{ fontWeight: 500 }}>{order.id}</Td>
                <Td>{order.customer}</Td>
                <Td>{order.total} MAD</Td>
                <Td><Badge $status={order.status}>{order.status}</Badge></Td>
                <Td style={{ color: 'var(--mid-gray)' }}>{order.date}</Td>
                <Td>
                  <ActionBtn title="Voir détails"><Eye size={15} /></ActionBtn>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </>
  );
}
