import { FormField } from './FormField';

interface FormTextareaProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  rows?: number;
  error?: string;
}

export function FormTextarea({
  label,
  id,
  value,
  onChange,
  required = false,
  placeholder,
  rows = 4,
  error,
}: FormTextareaProps) {
  return (
    <FormField label={label} id={id} required={required} error={error}>
      <textarea
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        rows={rows}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      />
    </FormField>
  );
}
