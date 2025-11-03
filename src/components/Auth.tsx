import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { AtSign, Lock, Brain, AlertCircle, Github } from 'lucide-react';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    if (!supabase) {
      setError("Supabase client is not available. Please check your configuration.");
      setLoading(false);
      return;
    }

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      } else {
        const { error } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            emailRedirectTo: window.location.origin
          }
        });
        if (error) throw error;
        setMessage("Check your email for the confirmation link!");
      }
    } catch (err: any) {
      setError(err.error_description || err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthLogin = async (provider: 'github') => {
    if (!supabase) return;
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: window.location.origin,
      },
    });
    if (error) {
      setError(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md"
      >
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center glow-effect">
              <Brain className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-light to-accent bg-clip-text text-transparent">
                MindTrail
              </h1>
              <p className="text-sm text-text-muted">Organize your creative journey</p>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-2xl p-8 border">
          <div className="flex justify-center mb-6">
            <div className="glass-effect p-1 rounded-xl inline-flex gap-1">
              <button onClick={() => setIsLogin(true)} className={`px-6 py-2 rounded-lg text-sm font-medium ${isLogin ? 'bg-surface-light text-text-primary' : 'text-text-muted'}`}>Login</button>
              <button onClick={() => setIsLogin(false)} className={`px-6 py-2 rounded-lg text-sm font-medium ${!isLogin ? 'bg-surface-light text-text-primary' : 'text-text-muted'}`}>Sign Up</button>
            </div>
          </div>
          
          <AnimatePresence mode="wait">
            <motion.h2
              key={isLogin ? 'login' : 'signup'}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="text-xl font-semibold text-center mb-6 text-text-primary"
            >
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </motion.h2>
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition" />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-muted" />
              <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full pl-10 pr-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition" />
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-primary to-accent rounded-xl font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Processing...' : (isLogin ? 'Login' : 'Sign Up')}
            </motion.button>
          </form>

          <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-surface-light"></div>
            <span className="flex-shrink mx-4 text-text-muted text-sm">OR</span>
            <div className="flex-grow border-t border-surface-light"></div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleOAuthLogin('github')}
            className="w-full py-3 bg-[#333] hover:bg-[#444] rounded-xl font-semibold text-white transition flex items-center justify-center gap-2"
          >
            <Github className="w-5 h-5" />
            Continue with GitHub
          </motion.button>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-warning/20 text-warning text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{error}</span>
            </motion.div>
          )}
          {message && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 p-3 bg-success/20 text-success text-sm rounded-lg flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              <span>{message}</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default Auth;
