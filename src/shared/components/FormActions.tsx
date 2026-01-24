import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';

interface FormActionsProps {
  backUrl: string;
  loading: boolean;
  isCreateMode: boolean;
}

export function FormActions({ backUrl, loading, isCreateMode }: FormActionsProps) {
  return (
    <div className="flex items-center justify-between">
      <Link
        href={backUrl}
        className="flex items-center gap-2 px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </Link>
      <button
        type="submit"
        disabled={loading}
        className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <Save className="w-4 h-4" />
        {loading ? 'Saving...' : isCreateMode ? 'Create' : 'Update'}
      </button>
    </div>
  );
}
