import { useState } from 'react';
import TextField from './TextField';
import BulletList from './BulletList';
import RepeatingSection from './RepeatingSection';
import KeywordAnalyzer from './KeywordAnalyzer';
import { useLang } from '../contexts/LangContext';
import type { CVData, ExperienceItem, EducationItem, LanguageItem } from '../types';

interface EditorProps {
  data: CVData;
  setData: (updater: (d: CVData) => CVData) => void;
}

let nextId = 200;
const uid = () => ++nextId;

export default function Editor({ data, setData }: EditorProps) {
  const { t } = useLang();

  const upd = <K extends keyof CVData>(k: K, v: CVData[K]) =>
    setData(d => ({ ...d, [k]: v }));

  const updItem = <T extends { id: number }>(key: keyof CVData, id: number, field: keyof T, val: unknown) =>
    setData(d => ({
      ...d,
      [key]: (d[key] as unknown as T[]).map(it => it.id === id ? { ...it, [field]: val } : it),
    }));

  const addItem = <T,>(key: keyof CVData, item: T) =>
    setData(d => ({ ...d, [key]: [...(d[key] as T[]), item] }));

  const removeItem = (key: keyof CVData, id: number) =>
    setData(d => ({ ...d, [key]: (d[key] as { id: number }[]).filter(it => it.id !== id) }));

  const updBullets = (key: keyof CVData, id: number, bullets: string[]) =>
    setData(d => ({
      ...d,
      [key]: (d[key] as { id: number; bullets: string[] }[]).map(it =>
        it.id === id ? { ...it, bullets } : it
      ),
    }));

  const [skillInput, setSkillInput] = useState('');

  return (
    <div className="editor-body">
      <div id="tour-personal" className="field-group">
        <div className="group-title">{t.personalData}</div>
        <TextField label={t.fullName} value={data.name} onChange={v => upd('name', v)} />
        <TextField label={t.roleTitle} value={data.role} onChange={v => upd('role', v)} />
        <div className="two-col">
          <TextField label={t.email} value={data.email} onChange={v => upd('email', v)} />
          <TextField label={t.phone} value={data.phone} onChange={v => upd('phone', v)} />
        </div>
        <div className="two-col">
          <TextField label={t.location} value={data.location} onChange={v => upd('location', v)} />
          <TextField label={t.nationality} value={data.nationality} onChange={v => upd('nationality', v)} />
        </div>
        <TextField label={t.birthDate} value={data.birth} onChange={v => upd('birth', v)} />
        <TextField
          label={t.professionalSummaryLabel}
          value={data.professionalSummary}
          onChange={v => upd('professionalSummary', v)}
          multiline
          placeholder={t.summaryPlaceholder}
        />
      </div>

      <div id="tour-idiomas" className="field-group">
        <div className="group-title">{t.languages}</div>
        {data.languages.map(l => (
          <div className="repeating-item" key={l.id}>
            <div className="item-header">
              <span className="item-label">{l.name || t.language}</span>
              <button className="remove-btn" onClick={() => removeItem('languages', l.id)}>×</button>
            </div>
            <div className="two-col">
              <input type="text" placeholder={t.language} aria-label={t.language} value={l.name}
                onChange={e => updItem<LanguageItem>('languages', l.id, 'name', e.target.value)} />
              <input type="text" placeholder={t.level} aria-label={t.level} value={l.level}
                onChange={e => updItem<LanguageItem>('languages', l.id, 'level', e.target.value)} />
            </div>
          </div>
        ))}
        <button className="add-btn"
          onClick={() => addItem<LanguageItem>('languages', { id: uid(), name: '', level: '' })}>
          {t.addLanguage}
        </button>
      </div>

      <RepeatingSection<ExperienceItem>
        title={t.experience}
        sectionId="tour-experiencia"
        items={data.experience}
        emptyItem={{ title: '', company: '', date: '', bullets: [''] }}
        onAdd={item => addItem<ExperienceItem>('experience', item)}
        onRemove={id => removeItem('experience', id)}
        renderItem={(item) => (
          <>
            <TextField label={t.position} value={item.title}
              onChange={v => updItem<ExperienceItem>('experience', item.id, 'title', v)} />
            <div className="two-col">
              <TextField label={t.company} value={item.company}
                onChange={v => updItem<ExperienceItem>('experience', item.id, 'company', v)} />
              <TextField label={t.period} value={item.date}
                onChange={v => updItem<ExperienceItem>('experience', item.id, 'date', v)} />
            </div>
            <BulletList bullets={item.bullets} onChange={b => updBullets('experience', item.id, b)} />
          </>
        )}
      />

      <RepeatingSection<EducationItem>
        title={t.education}
        sectionId="tour-educacion"
        items={data.education}
        emptyItem={{ title: '', school: '', date: '', bullets: [] }}
        onAdd={item => addItem<EducationItem>('education', item)}
        onRemove={id => removeItem('education', id)}
        renderItem={(item) => (
          <>
            <TextField label={t.degreeCourse} value={item.title}
              onChange={v => updItem<EducationItem>('education', item.id, 'title', v)} />
            <div className="two-col">
              <TextField label={t.institution} value={item.school}
                onChange={v => updItem<EducationItem>('education', item.id, 'school', v)} />
              <TextField label={t.date} value={item.date}
                onChange={v => updItem<EducationItem>('education', item.id, 'date', v)} />
            </div>
            <BulletList bullets={item.bullets} onChange={b => updBullets('education', item.id, b)} />
          </>
        )}
      />

      <div id="tour-habilidades" className="field-group">
        <div className="group-title">{t.skills}</div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, marginBottom: 8 }}>
          {data.skills.map((sk, i) => (
            <span key={i} style={{ background: '#E6F1FB', color: '#0C447C', borderRadius: 100, padding: '3px 10px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 5, border: '0.5px solid #B5D4F4' }}>
              {sk}
              <span onClick={() => upd('skills', data.skills.filter((_, j) => j !== i))}
                style={{ cursor: 'pointer', color: '#888', fontSize: 13 }}>✕</span>
            </span>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          <input
            type="text"
            value={skillInput}
            onChange={e => setSkillInput(e.target.value)}
            placeholder={t.addSkillPlaceholder}
            aria-label={t.addSkillPlaceholder}
            style={{ marginBottom: 0 }}
            onKeyDown={e => {
              if (e.key === 'Enter' && skillInput.trim()) {
                upd('skills', [...data.skills, skillInput.trim()]);
                setSkillInput('');
              }
            }}
          />
        </div>
      </div>
      <KeywordAnalyzer data={data} />
    </div>
  );
}
