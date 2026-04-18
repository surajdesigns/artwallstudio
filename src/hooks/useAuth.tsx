'use client';

import { createContext, useContext } from 'react';

interface AuthState {
  user: null;
  session: null;
  profile: null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  profile: null,
  loading: false,
  signIn: async () => ({ error: null }),
  signUp: async () => ({ error: null }),
  signOut: async () => { },
  refreshProfile: async () => { },
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: null,
        session: null,
        profile: null,
        loading: false,
        signIn: async () => ({ error: null }),
        signUp: async () => ({ error: null }),
        signOut: async () => { },
        refreshProfile: async () => { },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);