'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '../../../components/auth/AuthProvider';
import { supabaseBrowser } from '../../../components/auth/AuthProvider';
import { Save, User, Lock, Mail } from 'lucide-react';

export default function SettingsPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  
  const [profile, setProfile] = useState({
    display_name: '',
    email: '',
    role: '',
    current_password: '',
    new_password: '',
    confirm_password: ''
  });

  useEffect(() => {
    async function loadUserProfile() {
      if (!user) return;

      try {
        setLoading(true);
        
        // Fetch user profile
        const { data, error } = await supabaseBrowser
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "not found" error
          throw error;
        }
        
        setProfile({
          ...profile,
          display_name: data?.display_name || '',
          email: user.email || '',
          role: user.user_metadata?.role || 'teacher'
        });
      } catch (error) {
        console.error('Error loading profile:', error);
        setErrorMessage('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }

    loadUserProfile();
  }, [user?.id]); // Only depend on user.id to avoid infinite loops

  const updateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      setSaving(true);
      setSuccessMessage('');
      setErrorMessage('');
      
      // Update user profile - use upsert to handle cases where profile doesn't exist
      const { error } = await supabaseBrowser
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          display_name: profile.display_name,
          updated_at: new Date().toISOString()
        }, {
          onConflict: 'user_id'
        });

      if (error) {
        console.error('Profile update error:', error);
        throw error;
      }

      if (error) throw error;
      
      // Update password if provided
      if (profile.new_password) {
        if (profile.new_password !== profile.confirm_password) {
          throw new Error('New passwords do not match');
        }
        
        const { error: passwordError } = await supabaseBrowser.auth.updateUser({
          password: profile.new_password
        });
        
        if (passwordError) throw passwordError;
        
        // Clear password fields
        setProfile({
          ...profile,
          current_password: '',
          new_password: '',
          confirm_password: ''
        });
      }
      
      setSuccessMessage('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage(error instanceof Error ? error.message : 'An error occurred while updating your profile');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">Account Settings</h1>
        <p className="text-gray-300">Manage your profile and account preferences</p>
      </div>

      <div className="bg-indigo-900/30 backdrop-blur-sm rounded-lg p-6">
        {successMessage && (
          <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-md text-green-200">
            {successMessage}
          </div>
        )}
        
        {errorMessage && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-md text-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={updateProfile} className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold text-white mb-4">Profile Information</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="display_name" className="block text-sm font-medium text-gray-300 mb-1">
                  Display Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="display_name"
                    type="text"
                    value={profile.display_name}
                    onChange={(e) => setProfile({ ...profile, display_name: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Your display name"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={profile.email}
                    disabled
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-gray-400 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Email cannot be changed directly. Please contact support for assistance.</p>
              </div>

              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-300 mb-1">
                  Account Type
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="role"
                    type="text"
                    value={profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    disabled
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-gray-400 focus:outline-none cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-xs text-gray-400">Account type cannot be changed. Contact support if you need to change your role.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-indigo-800">
            <h2 className="text-xl font-semibold text-white mb-4">Change Password</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="new_password" className="block text-sm font-medium text-gray-300 mb-1">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="new_password"
                    type="password"
                    value={profile.new_password}
                    onChange={(e) => setProfile({ ...profile, new_password: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Enter new password"
                  />
                </div>
              </div>
              
              <div>
                <label htmlFor="confirm_password" className="block text-sm font-medium text-gray-300 mb-1">
                  Confirm New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="confirm_password"
                    type="password"
                    value={profile.confirm_password}
                    onChange={(e) => setProfile({ ...profile, confirm_password: e.target.value })}
                    className="block w-full pl-10 pr-3 py-2 border border-indigo-700 rounded-md bg-indigo-800/40 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
                    placeholder="Confirm new password"
                  />
                </div>
                {profile.new_password && profile.confirm_password && profile.new_password !== profile.confirm_password && (
                  <p className="mt-1 text-xs text-red-400">Passwords do not match</p>
                )}
              </div>
              
              <p className="text-xs text-gray-400">
                Leave password fields empty if you don't want to change your password.
              </p>
            </div>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={saving}
              className={`flex items-center px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {saving ? (
                <>
                  <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                  Saving...
                </>
              ) : (
                <>
                  <Save className="h-5 w-5 mr-2" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
} 