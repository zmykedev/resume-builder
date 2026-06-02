import { useState } from 'react';
import TextField from './TextField';
import BulletList from './BulletList';
import RepeatingSection from './RepeatingSection';
import KeywordAnalyzer from './KeywordAnalyzer';

let nextId = 200;
const uid = () => ++nextId;

export default function Editor({ data, setData }) {
  const upd = (k, v) => setData(d => ({ ...d, [k]: v }));
  const updItem = (key, id, field, val) =>
    setData(d => ({ ...d, [key]: d[key].map(it => it.id === id ? { ...it, [field]: val } : it) }));
  const addItem = (key, item) => setData(d => ({ ...d, [key]: [...d[key], item] }));
  const removeItem = (key, id) => setData(d => ({ ...d, [key]: d[key].filter(it => it.id !== id) }));
  const updBullets = (key, id, bullets) =>
    setData(d => ({ ...d, [key]: d[key].map(it => it.id === id ? { ...it, bullets } : it) }));

  const [skillInput, setSkillInput] = useState("");

  return (
    <div className="editor-body">
      <div className="field-group">
        <div className="group-title">Datos Personales</div>
        <TextField label="Nombre completo" value={data.name} onChange={v => upd("name", v)} />
        <TextField label="Rol / Título profesional" value={data.role} onChange={v => upd("role", v)} />
        <div className="two-col">
          <TextField label="Email" value={data.email} onChange={v => upd("email", v)} />
          <TextField label="Teléfono" value={data.phone} onChange={v => upd("phone", v)} />
        </div>
        <div className="two-col">
          <TextField label="Ubicación" value={data.location} onChange={v => upd("location", v)} />
          <TextField label="Nacionalidad" value={data.nationality} onChange={v => upd("nationality", v)} />
        </div>
        <TextField label="Fecha de nacimiento" value={data.birth} onChange={v => upd("birth", v)} />
        <TextField
          label="Resumen Profesional (keywords)"
          value={data.professionalSummary}
          onChange={v => upd("professionalSummary", v)}
          multiline
          placeholder="Resumen profesional optimizado para ATS y búsquedas. Ej: Desarrollador FullStack con experiencia en..."
        />
        <TextField
          label="Lema personal (solo modo Bonito)"
          value={data.personalMotto}
          onChange={v => upd("personalMotto", v)}
          multiline
          placeholder="Cita o lema personal que aparece en la barra lateral del diseño bonito"
        />
      </div>

      <div className="field-group">
        <div className="group-title">Idiomas</div>
        {data.languages.map(l => (
          <div className="repeating-item" key={l.id}>
            <div className="item-header">
              <span className="item-label">{l.name || "Idioma"}</span>
              <button className="remove-btn" onClick={() => removeItem("languages", l.id)}>×</button>
            </div>
            <div className="two-col">
              <input type="text" placeholder="Idioma" value={l.name} onChange={e => updItem("languages", l.id, "name", e.target.value)} />
              <input type="text" placeholder="Nivel" value={l.level} onChange={e => updItem("languages", l.id, "level", e.target.value)} />
            </div>
          </div>
        ))}
        <button className="add-btn" onClick={() => addItem("languages", { id: uid(), name: "", level: "" })}>+ Agregar idioma</button>
      </div>

      <RepeatingSection
        title="Experiencia"
        items={data.experience}
        emptyItem={{ title: "", company: "", date: "", bullets: [""] }}
        onAdd={item => addItem("experience", item)}
        onRemove={id => removeItem("experience", id)}
        renderItem={(item) => (
          <>
            <TextField label="Cargo" value={item.title} onChange={v => updItem("experience", item.id, "title", v)} />
            <div className="two-col">
              <TextField label="Empresa" value={item.company} onChange={v => updItem("experience", item.id, "company", v)} />
              <TextField label="Período" value={item.date} onChange={v => updItem("experience", item.id, "date", v)} />
            </div>
            <BulletList bullets={item.bullets} onChange={b => updBullets("experience", item.id, b)} />
          </>
        )}
      />

      <RepeatingSection
        title="Educación"
        items={data.education}
        emptyItem={{ title: "", school: "", date: "", bullets: [] }}
        onAdd={item => addItem("education", item)}
        onRemove={id => removeItem("education", id)}
        renderItem={(item) => (
          <>
            <TextField label="Título / Curso" value={item.title} onChange={v => updItem("education", item.id, "title", v)} />
            <div className="two-col">
              <TextField label="Institución" value={item.school} onChange={v => updItem("education", item.id, "school", v)} />
              <TextField label="Fecha" value={item.date} onChange={v => updItem("education", item.id, "date", v)} />
            </div>
            <BulletList bullets={item.bullets} onChange={b => updBullets("education", item.id, b)} />
          </>
        )}
      />

      <div className="field-group">
        <div className="group-title">Habilidades</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginBottom: 8 }}>
          {data.skills.map((sk, i) => (
            <span key={i} style={{ background: "#E6F1FB", color: "#0C447C", borderRadius: 100, padding: "3px 10px", fontSize: 11, display: "flex", alignItems: "center", gap: 5, border: "0.5px solid #B5D4F4" }}>
              {sk}
              <span onClick={() => upd("skills", data.skills.filter((_, j) => j !== i))} style={{ cursor: "pointer", color: "#888", fontSize: 13 }}>✕</span>
            </span>
          ))}
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          <input type="text" value={skillInput} onChange={e => setSkillInput(e.target.value)}
            placeholder="Agregar habilidad y presionar Enter..."
            style={{ marginBottom: 0 }}
            onKeyDown={e => {
              if (e.key === "Enter" && skillInput.trim()) {
                upd("skills", [...data.skills, skillInput.trim()]);
                setSkillInput("");
              }
            }} />
        </div>
      </div>
      <KeywordAnalyzer data={data} />
    </div>
  );
}
