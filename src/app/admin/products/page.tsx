'use client';

import { useState } from 'react';
import { Plus, Search, Edit, Eye, Trash2 } from 'lucide-react';
import styled from 'styled-components';
import { 
  PageHeader, PageTitle, CreateBtn, TableCard, TableHeader, TableTitle, Table, Th, Td, Badge, ActionBtn 
} from '@/components/admin/AdminSharedStyles';
import { DEMO_PRODUCTS } from '@/lib/admin-data';
import Image from 'next/image';

const SearchInput = styled.input`
  padding: 8px 12px 8px 36px;
  border: 1px solid rgba(0,0,0,0.08);
  border-radius: 4px;
  font-size: 13px;
  width: 240px;
  background: #fdfdfc;
  &:focus { outline: none; border-color: var(--gold); }
`;

const SearchContainer = styled.div`
  position: relative;
  svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--mid-gray); }
`;

export default function AdminProducts() {
  const [products, setProducts] = useState(DEMO_PRODUCTS);

  return (
    <>
      <PageHeader>
        <PageTitle>Gestion des <em>Produits</em></PageTitle>
        <CreateBtn>
          <Plus size={16} /> Ajouter un Produit
        </CreateBtn>
      </PageHeader>

      <TableCard>
        <TableHeader>
          <TableTitle>Tous les Produits</TableTitle>
          <SearchContainer>
            <Search size={14} />
            <SearchInput placeholder="Rechercher un produit..." />
          </SearchContainer>
        </TableHeader>
        <Table>
          <thead>
            <tr>
              <Th>Image</Th>
              <Th>Nom / SKU</Th>
              <Th>Catégorie</Th>
              <Th>Prix</Th>
              <Th>Stock</Th>
              <Th>Statut</Th>
              <Th>Actions</Th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id}>
                <Td>
                  <div style={{ position: 'relative', width: 44, height: 44, borderRadius: 4, overflow: 'hidden' }}>
                    <Image src={p.img} alt={p.name} fill style={{ objectFit: 'cover' }} />
                  </div>
                </Td>
                <Td>
                  <p style={{ fontWeight: 500 }}>{p.name}</p>
                  <p style={{ fontSize: 11, color: 'var(--mid-gray)' }}>{p.sku}</p>
                </Td>
                <Td>{p.category}</Td>
                <Td>{p.price} MAD</Td>
                <Td>
                  <span style={{ color: p.stock < 5 ? 'var(--error)' : 'inherit' }}>
                    {p.stock === 0 ? 'Épuisé' : p.stock < 5 ? `Faible (${p.stock})` : `${p.stock}`}
                  </span>
                </Td>
                <Td><Badge $status={p.active ? 'active' : 'pending'}>{p.active ? 'Actif' : 'Brouillon'}</Badge></Td>
                <Td>
                  <div style={{ display: 'flex', gap: 4 }}>
                    <ActionBtn><Eye size={15} /></ActionBtn>
                    <ActionBtn><Edit size={15} /></ActionBtn>
                    <ActionBtn><Trash2 size={15} /></ActionBtn>
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
