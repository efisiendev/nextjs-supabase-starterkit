'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth, UserRole } from '@/lib/auth/AuthContext';
import { Eye, EyeOff } from 'lucide-react';
import { FormInput } from '@/shared/components/FormInput';
import { FormSelect } from '@/shared/components/FormSelect';
import { FormActions } from '@/shared/components/FormActions';
import { CreateUserFormData } from '@/types/forms';
import { toast } from 'sonner';

const ROLES: { value: UserRole; label: string }[] = [
  { value: 'super_admin', label: 'Super Admin' },
  { value: 'admin', label: 'Admin' },
  { value: 'kontributor', label: 'Kontributor' },
];

export default function UserFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;
  const isEditMode = id !== 'new';
  const { profile, hasPermission, session } = useAuth();

  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(isEditMode);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState<CreateUserFormData>({
    email: '',
    password: '',
    full_name: '',
    role: 'kontributor',
    avatar_url: '',
  });

  useEffect(() => {
    if (!hasPermission(['super_admin'])) {
      router.push('/admin/dashboard');
      return;
    }

    if (isEditMode) {
      fetchUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  async function fetchUser() {
    try {
      const { data: { session: currentSession } } = await supabase.auth.getSession();
      if (!currentSession) {
        toast.error('Not authenticated');
        router.push('/admin/users');
        return;
      }

      const response = await fetch(`/api/admin/users/${id}`, {
        headers: { 'Authorization': `Bearer ${currentSession.access_token}` },
      });

      if (!response.ok) {
        throw new Error('Failed to load user');
      }

      const result = await response.json();
      const userData = result.user;

      if (!userData) {
        toast.error('User not found');
        router.push('/admin/users');
        return;
      }

      setFormData({
        email: userData.email || '',
        password: '',
        full_name: userData.full_name || '',
        role: userData.role || 'kontributor',
        avatar_url: userData.avatar_url || '',
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load user';
      toast.error(message);
      router.push('/admin/users');
    } finally {
      setFetching(false);
    }
  }

  function generatePassword() {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    setFormData({ ...formData, password });
    setShowPassword(true);
    toast.success('Password generated');
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (isEditMode && id === profile?.id) {
      toast.error('You cannot change your own role');
      return;
    }

    if (!formData.full_name || !formData.role) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!isEditMode) {
      if (!formData.email || !formData.password) {
        toast.error('Email and password are required for new users');
        return;
      }

      if (formData.password.length < 6) {
        toast.error('Password must be at least 6 characters');
        return;
      }
    }

    try {
      setLoading(true);

      if (!session) {
        toast.error('Not authenticated');
        return;
      }

      if (isEditMode) {
        const response = await fetch(`/api/admin/users/${id}`, {
          method: 'PATCH',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            full_name: formData.full_name,
            role: formData.role,
            avatar_url: formData.avatar_url || null,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to update user');
        }

        toast.success('User updated successfully');
      } else {
        const response = await fetch('/api/admin/create-user', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            full_name: formData.full_name,
            role: formData.role,
          }),
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Failed to create user');
        }

        toast.success('User created successfully');
      }

      router.push('/admin/users');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save user';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  if (fetching) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          {isEditMode ? 'Edit User' : 'Create New User'}
        </h1>
        <p className="text-gray-600 mt-1">
          {isEditMode ? 'Update user information and role' : 'Add a new user to the system'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="space-y-6">
          <FormInput
            label="Full Name"
            id="full_name"
            value={formData.full_name}
            onChange={(value) => setFormData({ ...formData, full_name: value })}
            required
          />

          <FormInput
            label="Email"
            id="email"
            type="email"
            value={formData.email}
            onChange={(value) => setFormData({ ...formData, email: value })}
            required={!isEditMode}
            disabled={isEditMode}
          />

          {!isEditMode && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="Enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors whitespace-nowrap"
                >
                  Generate
                </button>
              </div>
              <p className="text-sm text-gray-500 mt-1">Minimum 6 characters</p>
            </div>
          )}

          <FormSelect
            label="Role"
            id="role"
            value={formData.role}
            onChange={(value) => setFormData({ ...formData, role: value as UserRole })}
            options={ROLES}
            required
          />

          <FormInput
            label="Avatar URL"
            id="avatar_url"
            type="url"
            value={formData.avatar_url}
            onChange={(value) => setFormData({ ...formData, avatar_url: value })}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <FormActions backUrl="/admin/users" loading={loading} isCreateMode={!isEditMode} />
        </div>
      </form>
    </div>
  );
}
