export default function TextField({ label, value, onChange, multiline, placeholder }) {
  return (
    <div>
      {label && <label>{label}</label>}
      {multiline
        ? <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
        : <input type="text" value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />}
    </div>
  );
}
