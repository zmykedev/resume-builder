import type { ReactNode } from 'react';

interface RepeatableItem {
  id: number;
  title?: string;
  name?: string;
}

interface RepeatingSectionProps<T extends RepeatableItem> {
  title: string;
  sectionId?: string;
  items: T[];
  onAdd: (item: T) => void;
  onRemove: (id: number) => void;
  renderItem: (item: T, index: number) => ReactNode;
  emptyItem: Omit<T, 'id'>;
}

let nextId = 100;
const uid = () => ++nextId;

export default function RepeatingSection<T extends RepeatableItem>({
  title, sectionId, items, onAdd, onRemove, renderItem, emptyItem,
}: RepeatingSectionProps<T>) {
  return (
    <div id={sectionId} className="field-group">
      <div className="group-title">{title}</div>
      {items.map((item, i) => (
        <div className="repeating-item" key={item.id}>
          <div className="item-header">
            <span className="item-label">{item.title || item.name || `Item ${i + 1}`}</span>
            <button className="remove-btn" onClick={() => onRemove(item.id)}>×</button>
          </div>
          {renderItem(item, i)}
        </div>
      ))}
      <button className="add-btn" onClick={() => onAdd({ id: uid(), ...emptyItem } as T)}>
        + Agregar {title.toLowerCase()}
      </button>
    </div>
  );
}
