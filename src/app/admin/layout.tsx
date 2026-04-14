'use client';

import styled from 'styled-components';
import AdminSidebar from '@/components/admin/AdminSidebar';

const AdminLayoutWrapper = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 100vh;
  background: #f4f2ed;

  @media (max-width: 1024px) { grid-template-columns: 1fr; }
`;

const MainArea = styled.main`
  padding: 40px;
  overflow-y: auto;

  @media (max-width: 768px) { padding: 24px 20px; }
`;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AdminLayoutWrapper>
      <AdminSidebar />
      <MainArea>
        {children}
      </MainArea>
    </AdminLayoutWrapper>
  );
}
