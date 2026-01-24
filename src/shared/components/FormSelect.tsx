import { FormField } from './FormField';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps {
  label: string;
  id: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  required?: boolean;
  error?: string;
}

export function FormSelect({
  label,
  id,
  value,
  onChange,
  options,
  required = false,
  error,
}: FormSelectProps) {
  return (
    <FormField label={label} id={id} required={required} error={error}>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}
