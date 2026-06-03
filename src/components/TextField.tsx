import { useId } from 'react';

interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export default function TextField({ label, value, onChange, multiline, placeholder }: Readonly<TextFieldProps>) {
  const id = useId();
  return (
    <div>
      {label && <label htmlFor={id}>{label}</label>}
      {multiline
        ? <textarea id={id} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input id={id} type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}
