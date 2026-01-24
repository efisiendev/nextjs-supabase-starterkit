interface FormCheckboxProps {
  label: string;
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  description?: string;
}

export function FormCheckbox({ label, id, checked, onChange, description }: FormCheckboxProps) {
  return (
    <div className="flex items-start">
      <div className="flex items-center h-5">
        <input
          type="checkbox"
          id={id}
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
        />
      </div>
      <div className="ml-3">
        <label htmlFor={id} className="text-sm font-medium text-gray-700">
          {label}
        </label>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
    </div>
  );
}
