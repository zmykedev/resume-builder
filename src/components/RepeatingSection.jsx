let nextId = 100;
const uid = () => ++nextId;

export default function RepeatingSection({ title, items, onAdd, onRemove, renderItem, emptyItem }) {
  return (
    <div className="field-group">
      <div className="group-title">{title}</div>
      {items.map((item, i) => (
        <div className="repeating-item" key={item.id}>
          <div className="item-header">
            <span className="item-label">{item.title || item.name || `Item ${i+1}`}</span>
            <button className="remove-btn" onClick={() => onRemove(item.id)}>×</button>
          </div>
          {renderItem(item, i)}
        </div>
      ))}
      <button className="add-btn" onClick={() => onAdd({ id: uid(), ...emptyItem })}>+ Agregar {title.toLowerCase()}</button>
    </div>
  );
}
