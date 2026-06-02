interface TextFieldProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}

export default function TextField({ label, value, onChange, multiline, placeholder }: TextFieldProps) {
  return (
    <div>
      {label && <label>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}
