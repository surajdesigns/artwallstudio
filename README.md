# ArtWall Studio - E-Commerce Complet

Store de tableaux et papiers peints de luxe — Next.js 14 + Styled-Components + Supabase.

## Stack
- Next.js 14 App Router
- Styled-Components v6 (SSR)
- Supabase (PostgreSQL + Auth + Storage)
- Zustand (cart + wishlist persist)
- Framer Motion
- Lucide React

## Routes

| Route | Description |
|-------|-------------|
| / | Accueil |
| /products | Listing + filtres avances |
| /products/[slug] | Produit detail |
| /checkout | Checkout 3 etapes |
| /wishlist | Favoris |
| /account | Mon compte |
| /login | Auth |
| /admin | Dashboard admin |
| /visualizer | Visualiseur dans votre piece |
| /track | Suivi commande |
| /contact | Contact |
| /about | A propos |
| /api/products | API produits |
| /api/orders | API commandes |
| /api/reviews | API avis |
| /api/wishlist | API favoris |
| /api/newsletter | API newsletter |
| /api/admin/stats | Statistiques admin |

## Installation

1. npm install
2. Creer projet Supabase → exécuter supabase-schema.sql puis supabase-schema-extra.sql
3. cp .env.local.example .env.local (remplir les cles)
4. npm run dev

## Fonctionnalites

- Mega menu navigation
- Search palette globale (Cmd+K)
- Filtres avances (categorie, prix, taille, couleur, style)
- Multi-variations produits
- Galerie zoom produit
- Checkout 3 etapes avec barre progres
- 3 modes livraison + 3 modes paiement
- Visualiseur AR (upload photo de piece)
- Recommandations personnalisees (scoring)
- Dashboard admin complet (CRUD produits, commandes, clients)
- Auth Supabase avec middleware protection routes
- Historique commandes
- Suivi commande temps reel
- Formulaire avis avec validation admin
- Codes promo
- Newsletter
