interface FormFieldProps {
  label: string;
  id: string;
  required?: boolean;
  children: React.ReactNode;
  error?: string;
}

export function FormField({ label, id, required = false, children, error }: FormFieldProps) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-red-600">{error}</p>}
    </div>
  );
}
