'use client';

import { 
  PageHeader, PageTitle, TableCard, TableHeader, TableTitle, Table, Th, Td, Badge, ActionBtn 
} from '@/components/admin/AdminSharedStyles';
import { DEMO_ORDERS } from '@/lib/admin-data';
import { Eye, Search, Filter } from 'lucide-react';
import styled from 'styled-components';

const FilterBar = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`;

const FilterBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 4px;
  font-size: 13px;
  background: white;
  color: var(--mid-gray);
  &:hover { border-color: var(--gold); color: var(--gold-dark); }
`;

export default function AdminOrders() {
  return (
    <>
      <PageHeader>
        <PageTitle>Suivi des <em>Commandes</em></PageTitle>
      </PageHeader>

      <TableCard>
        <TableHeader>
          <TableTitle>Toutes les Commandes</TableTitle>
          <FilterBar>
            <FilterBtn><Filter size={14} /> Filtrer</FilterBtn>
            <FilterBtn><Search size={14} /> Rechercher</FilterBtn>
          </FilterBar>
        </TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>ID Commande</Th>
              <Th>Client</Th>
              <Th>Articles</Th>
              <Th>Total</Th>
              <Th>Statut</Th>
              <Th>Date</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {DEMO_ORDERS.map((order) => (
              <tr key={order.id}>
                <Td style={{ fontWeight: 600 }}>{order.id}</Td>
                <Td>
                  <p style={{ fontWeight: 500 }}>{order.customer}</p>
                  <p style={{ fontSize: 12, color: 'var(--mid-gray)' }}>{order.email}</p>
                </Td>
                <Td>{order.items} items</Td>
                <Td style={{ fontWeight: 500 }}>{order.total} MAD</Td>
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
