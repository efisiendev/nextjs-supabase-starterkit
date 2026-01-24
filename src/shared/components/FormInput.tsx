import { FormField } from './FormField';

interface FormInputProps {
  label: string;
  id: string;
  type?: string;
  value: string | number;
  onChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  error?: string;
}

export function FormInput({
  label,
  id,
  type = 'text',
  value,
  onChange,
  required = false,
  placeholder,
  disabled = false,
  error,
}: FormInputProps) {
  return (
    <FormField label={label} id={id} required={required} error={error}>
      <input
        type={type}
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </FormField>
  );
}
