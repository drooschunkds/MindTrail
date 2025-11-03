import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { User, Lock, Save } from 'lucide-react';

const SettingsView: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isProfileSaving, setProfileSaving] = useState(false);
  const [isPasswordSaving, setPasswordSaving] = useState(false);

  useEffect(() => {
    if (user?.user_metadata?.full_name) {
      setFullName(user.user_metadata.full_name);
    } else {
      setFullName('');
    }
  }, [user]);

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;

    setProfileSaving(true);
    const { error } = await supabase.auth.updateUser({
      data: { full_name: fullName }
    });
    setProfileSaving(false);

    if (error) {
      toast.error('Error updating profile:', { description: error.message });
    } else {
      toast.success('Profile updated successfully!');
      await refreshUser();
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !supabase) return;

    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setPasswordSaving(true);
    const { error } = await supabase.auth.updateUser({ password });
    setPasswordSaving(false);

    if (error) {
      toast.error('Error changing password:', { description: error.message });
    } else {
      toast.success('Password changed successfully!');
      setPassword('');
      setConfirmPassword('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-effect rounded-2xl p-6 md:p-8 border"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center border-2 border-primary/40">
            <User className="w-6 h-6 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Profile Information</h2>
            <p className="text-text-muted">Update your personal details.</p>
          </div>
        </div>
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Email</label>
            <input type="email" value={user?.email || ''} disabled className="w-full px-4 py-3 bg-surface rounded-xl focus:outline-none cursor-not-allowed text-text-muted" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Full Name</label>
            <input type="text" value={fullName} onChange={e => setFullName(e.target.value)} placeholder="Your full name" className="w-full px-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-primary" />
          </div>
          <div className="flex justify-end pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isProfileSaving}
              className="px-6 py-2.5 bg-primary hover:bg-primary-light rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isProfileSaving ? 'Saving...' : 'Save Profile'}
            </motion.button>
          </div>
        </form>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-effect rounded-2xl p-6 md:p-8 border"
      >
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center border-2 border-accent/40">
            <Lock className="w-6 h-6 text-accent" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text-primary">Change Password</h2>
            <p className="text-text-muted">Choose a new, strong password.</p>
          </div>
        </div>
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">New Password</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-secondary mb-2">Confirm New Password</label>
            <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} placeholder="••••••••" className="w-full px-4 py-3 bg-surface-light rounded-xl focus:outline-none focus:ring-2 focus:ring-accent" />
          </div>
          <div className="flex justify-end pt-2">
            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isPasswordSaving || !password}
              className="px-6 py-2.5 bg-accent hover:bg-accent-light rounded-xl font-medium transition-colors disabled:opacity-50 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              {isPasswordSaving ? 'Saving...' : 'Change Password'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default SettingsView;
