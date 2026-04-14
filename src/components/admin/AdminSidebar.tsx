'use client';

import styled from 'styled-components';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Package, ShoppingBag, Users, ArrowUpRight } from 'lucide-react';

const SidebarWrapper = styled.aside`
  background: var(--off-black);
  padding: 0;
  position: sticky;
  top: 0;
  height: 100vh;
  overflow-y: auto;
  border-right: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: 1024px) { display: none; }
`;

const AdminLogoLink = styled(Link)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 28px 24px;
  font-family: var(--font-display);
  font-size: 18px;
  font-weight: 500;
  color: var(--off-white);
  letter-spacing: 0.06em;
  border-bottom: 1px solid rgba(255,255,255,0.06);
  margin-bottom: 8px;
  span { color: var(--gold); }
`;

const AdminBadge = styled.span`
  font-size: 9px;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  padding: 2px 8px;
  background: rgba(201,168,76,0.2);
  color: var(--gold);
  border-radius: 2px;
  font-family: var(--font-body);
`;

const SideNav = styled.nav`
  padding: 8px 0;
`;

const SideNavGroup = styled.div`
  margin-bottom: 4px;
`;

const SideNavLabel = styled.p`
  font-size: 10px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: rgba(255,255,255,0.2);
  padding: 12px 24px 6px;
`;

const SideNavItemLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 24px;
  font-size: 14px;
  color: ${({ $active }) => ($active ? 'var(--off-white)' : 'var(--mid-gray)')};
  background: ${({ $active }) => ($active ? 'rgba(201,168,76,0.1)' : 'transparent')};
  border-left: 3px solid ${({ $active }) => ($active ? 'var(--gold)' : 'transparent')};
  transition: all 0.2s;
  text-align: left;
  text-decoration: none;

  svg { color: ${({ $active }) => ($active ? 'var(--gold)' : 'inherit')}; }

  &:hover { background: rgba(255,255,255,0.05); color: var(--off-white); }
`;

const SideNavItemExternal = styled.a`
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 24px;
  font-size: 14px;
  color: var(--mid-gray);
  background: transparent;
  border-left: 3px solid transparent;
  transition: all 0.2s;
  text-align: left;
  text-decoration: none;

  &:hover { background: rgba(255,255,255,0.05); color: var(--off-white); }
`;

export default function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/products', label: 'Produits', icon: Package },
    { href: '/admin/orders', label: 'Commandes', icon: ShoppingBag },
    { href: '/admin/customers', label: 'Clients', icon: Users },
  ];

  return (
    <SidebarWrapper>
      <AdminLogoLink href="/admin">
        Art<span>Wall</span> <AdminBadge>Admin</AdminBadge>
      </AdminLogoLink>
      
      <SideNav>
        <SideNavGroup>
          <SideNavLabel>Navigation</SideNavLabel>
          {navItems.map((item) => (
            <SideNavItemLink 
              key={item.href} 
              href={item.href} 
              $active={pathname === item.href}
            >
              <item.icon size={18} />
              {item.label}
            </SideNavItemLink>
          ))}
        </SideNavGroup>

        <SideNavGroup>
          <SideNavLabel>Liens rapides</SideNavLabel>
          <SideNavItemExternal href="/" target="_blank">
            <ArrowUpRight size={18} />
            Voir la boutique
          </SideNavItemExternal>
        </SideNavGroup>
      </SideNav>
    </SidebarWrapper>
  );
}
