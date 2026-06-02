export default function BulletList({ bullets, onChange }) {
  const update = (i, v) => { const b = [...bullets]; b[i] = v; onChange(b); };
  const remove = (i) => onChange(bullets.filter((_, j) => j !== i));
  const add = () => onChange([...bullets, ""]);
  return (
    <div>
      <label>Puntos clave</label>
      {bullets.map((b, i) => (
        <div className="bullet-row" key={i}>
          <input type="text" value={b} onChange={e => update(i, e.target.value)} placeholder="Describe un logro o responsabilidad..." />
          <button className="bullet-remove" onClick={() => remove(i)}>✕</button>
        </div>
      ))}
      <button className="bullet-add" onClick={add}>+ agregar punto</button>
    </div>
  );
}
