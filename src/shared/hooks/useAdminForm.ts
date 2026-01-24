import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/lib/auth/AuthContext';
import { toast } from 'sonner';

interface UseAdminFormOptions<T> {
  tableName: string;
  selectColumns?: string;
  id: string;
  initialData: T;
  redirectPath: string;
  onBeforeSave?: (data: T) => any | Promise<any>;
  permissions?: {
    canCreate?: () => boolean;
    canEdit?: (authorId: string) => boolean;
  };
}

interface UseAdminFormResult<T> {
  formData: T;
  setFormData: React.Dispatch<React.SetStateAction<T>>;
  loading: boolean;
  fetching: boolean;
  isCreateMode: boolean;
  authorId: string;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  updateField: (field: keyof T, value: any) => void;
}

export function useAdminForm<T extends Record<string, any>>({
  tableName,
  selectColumns = '*',
  id,
  initialData,
  redirectPath,
  onBeforeSave,
  permissions,
}: UseAdminFormOptions<T>): UseAdminFormResult<T> {
  const router = useRouter();
  const { user, profile, hasPermission, canEditOwnContent } = useAuth();
  const [formData, setFormData] = useState<T>(initialData);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [authorId, setAuthorId] = useState<string>('');

  const isCreateMode = id === 'new';

  // Fetch existing data
  useEffect(() => {
    if (!isCreateMode && profile) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, profile?.id]);

  async function fetchData() {
    setFetching(true);
    try {
      const { data, error } = await supabase
        .from(tableName)
        .select(selectColumns)
        .eq('id', id)
        .single();

      if (error) throw error;

      if (!data) {
        toast.error('Data not found');
        router.push(redirectPath);
        return;
      }

      // Check permissions for edit
      const dataAuthorId = (data as any).author_id || (data as any).creator_id || '';
      setAuthorId(dataAuthorId);

      if (permissions?.canEdit) {
        if (!permissions.canEdit(dataAuthorId)) {
          toast.error('You do not have permission to edit this');
          router.push(redirectPath);
          return;
        }
      } else {
        // Default permission check
        if (!hasPermission(['super_admin', 'admin']) && !canEditOwnContent(dataAuthorId)) {
          toast.error('You do not have permission to edit this');
          router.push(redirectPath);
          return;
        }
      }

      setFormData(data as T);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load data';
      toast.error(message);
      router.push(redirectPath);
    } finally {
      setFetching(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Check create permissions
    if (isCreateMode && permissions?.canCreate) {
      if (!permissions.canCreate()) {
        toast.error('You do not have permission to create');
        return;
      }
    }

    setLoading(true);

    try {
      let dataToSave = { ...formData };

      // Run pre-save hook
      if (onBeforeSave) {
        dataToSave = await onBeforeSave(dataToSave);
      }

      if (isCreateMode) {
        // Create
        const { error } = await supabase
          .from(tableName)
          .insert([{ ...dataToSave, author_id: user?.id }] as never);

        if (error) throw error;

        toast.success('Created successfully');
      } else {
        // Update
        const { error } = await supabase
          .from(tableName)
          .update(dataToSave as never)
          .eq('id', id);

        if (error) throw error;

        toast.success('Updated successfully');
      }

      router.push(redirectPath);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  function updateField(field: keyof T, value: any) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  return {
    formData,
    setFormData,
    loading,
    fetching,
    isCreateMode,
    authorId,
    handleSubmit,
    updateField,
  };
}
