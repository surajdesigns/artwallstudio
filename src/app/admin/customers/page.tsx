'use client';

import { 
  PageHeader, PageTitle, TableCard, TableHeader, TableTitle, Table, Th, Td, ActionBtn 
} from '@/components/admin/AdminSharedStyles';
import { DEMO_CUSTOMERS } from '@/lib/admin-data';
import { Mail, Search, UserMinus } from 'lucide-react';
import styled from 'styled-components';

const CustomerName = styled.p`
  font-weight: 500;
  color: var(--black);
`;

const CustomerEmail = styled.p`
  font-size: 12px;
  color: var(--mid-gray);
`;

export default function AdminCustomers() {
  return (
    <>
      <PageHeader>
        <PageTitle>Base <em>Clients</em></PageTitle>
      </PageHeader>

      <TableCard>
        <TableHeader>
          <TableTitle>Clients Enregistrés</TableTitle>
          <ActionBtn title="Exporter"><Search size={14} /></ActionBtn>
        </TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Client</Th>
              <Th>Commandes</Th>
              <Th>Total Dépensé</Th>
              <Th>Membre Depuis</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {DEMO_CUSTOMERS.map((c) => (
              <tr key={c.id}>
                <Td>
                  <CustomerName>{c.name}</CustomerName>
                  <CustomerEmail>{c.email}</CustomerEmail>
                </Td>
                <Td>{c.orders} commandes</Td>
                <Td style={{ fontWeight: 500 }}>{c.total} MAD</Td>
                <Td style={{ color: 'var(--mid-gray)' }}>{c.joined}</Td>
                <Td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <ActionBtn title="Envoyer Email"><Mail size={15} /></ActionBtn>
                    <ActionBtn title="Suspendre"><UserMinus size={15} /></ActionBtn>
                  </div>
                </Td>
              </tr>
            ))}
          </tbody>
        </Table>
      </TableCard>
    </>
  );
}
