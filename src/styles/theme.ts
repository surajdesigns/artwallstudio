'use client';

import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  *, *::before, *::after {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  :root {
    --black: #0a0a08;
    --off-black: #141410;
    --charcoal: #1e1e18;
    --dark-gray: #2a2a22;
    --mid-gray: #5a5a50;
    --light-gray: #a8a89a;
    --off-white: #f5f3ee;
    --cream: #faf8f3;
    --white: #ffffff;
    --gold: #c9a84c;
    --gold-light: #e8c97a;
    --gold-dark: #9a7a30;
    --accent: #c9a84c;
    --error: #c94c4c;
    --success: #4caa70;

    --font-display: var(--font-cormorant), Georgia, serif;
    --font-body: var(--font-dm-sans), -apple-system, sans-serif;

    --radius-sm: 4px;
    --radius-md: 8px;
    --radius-lg: 16px;
    --radius-full: 9999px;

    --shadow-sm: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04);
    --shadow-md: 0 4px 16px rgba(0,0,0,0.12);
    --shadow-lg: 0 16px 40px rgba(0,0,0,0.16);
    --shadow-xl: 0 32px 64px rgba(0,0,0,0.24);

    --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
    --ease-in-out: cubic-bezier(0.65, 0, 0.35, 1);
    --spring: cubic-bezier(0.34, 1.56, 0.64, 1);

    --nav-height: 80px;
  }

  html {
    scroll-behavior: smooth;
    font-size: 16px;
  }

  body {
    font-family: var(--font-body);
    background-color: var(--cream);
    color: var(--black);
    line-height: 1.6;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    overflow-x: hidden;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: var(--font-display);
    font-weight: 400;
    line-height: 1.15;
    letter-spacing: -0.01em;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  button {
    cursor: pointer;
    border: none;
    background: none;
    font-family: inherit;
  }

  img {
    max-width: 100%;
    display: block;
  }

  input, textarea, select {
    font-family: var(--font-body);
  }

  ::selection {
    background: var(--gold);
    color: var(--white);
  }

  ::-webkit-scrollbar {
    width: 6px;
  }
  ::-webkit-scrollbar-track {
    background: var(--cream);
  }
  ::-webkit-scrollbar-thumb {
    background: var(--light-gray);
    border-radius: 3px;
  }
  ::-webkit-scrollbar-thumb:hover {
    background: var(--mid-gray);
  }
`;

export const theme = {
  colors: {
    black: '#0a0a08',
    offBlack: '#141410',
    charcoal: '#1e1e18',
    darkGray: '#2a2a22',
    midGray: '#5a5a50',
    lightGray: '#a8a89a',
    offWhite: '#f5f3ee',
    cream: '#faf8f3',
    white: '#ffffff',
    gold: '#c9a84c',
    goldLight: '#e8c97a',
    goldDark: '#9a7a30',
    error: '#c94c4c',
    success: '#4caa70',
  },
  fonts: {
    display: "'Cormorant Garamond', Georgia, serif",
    body: "'DM Sans', -apple-system, sans-serif",
  },
};

export type Theme = typeof theme;
