import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../client.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check active sessions and sets the user
    const session = supabase.auth.getSession()
    
    setUser(session?.user ?? null)
    setLoading(false)
    
    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  // Will be passed down to Signup, Login components
  const value = {
    signUp: (data) => supabase.auth.signUp({
      email: data.email,
      password: data.password,
      // Remove any options related to email redirect
    }),
    signIn: (data) => supabase.auth.signInWithPassword(data),
    signOut: () => supabase.auth.signOut(),
    user,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
};

export function useAuth() {
  return useContext(AuthContext)
};