import { useRef } from 'react';
import { useLang } from '../contexts/LangContext';

interface BulletListProps {
  bullets: string[];
  onChange: (bullets: string[]) => void;
}

let counter = 0;
const nextId = () => ++counter;

export default function BulletList({ bullets, onChange }: Readonly<BulletListProps>) {
  const { t } = useLang();
  const ids = useRef<number[]>(bullets.map(() => nextId()));

  // Keep stable ID list in sync with bullets length
  while (ids.current.length < bullets.length) ids.current.push(nextId());
  if (ids.current.length > bullets.length) ids.current.length = bullets.length;

  const update = (i: number, v: string) => { const b = [...bullets]; b[i] = v; onChange(b); };

  const remove = (i: number) => {
    ids.current.splice(i, 1);
    onChange(bullets.filter((_, j) => j !== i));
  };

  const add = () => {
    ids.current.push(nextId());
    onChange([...bullets, '']);
  };

  return (
    <div>
      {bullets.map((b, i) => (
        <div className="bullet-row" key={ids.current[i]}>
          <input
            type="text"
            value={b}
            onChange={e => update(i, e.target.value)}
            placeholder={t.bulletPlaceholder}
            aria-label={`${t.keyPoints} ${i + 1}`}
          />
          <button
            className="bullet-remove"
            onClick={() => remove(i)}
            aria-label={t.removeBullet}
          >✕</button>
        </div>
      ))}
      <button className="bullet-add" onClick={add}>{t.addBullet}</button>
    </div>
  );
}
