import ATSPreview from './ATSPreview';
import { useLang } from '../contexts/LangContext';
import type { CVData, ThemeColorsMap, ThemeName } from '../types';

interface CVPreviewProps {
  data: CVData;
  themeColors: ThemeColorsMap;
  previewTheme: string | null;
  atsMode: boolean;
}

export default function CVPreview({ data, themeColors, previewTheme, atsMode }: Readonly<CVPreviewProps>) {
  const { t } = useLang();
  const theme = themeColors[(previewTheme || data.theme) as ThemeName] ?? themeColors.blue;
  if (atsMode) return <ATSPreview data={data} />;

  const cvStyle = {
    '--blue-dark': theme.dark,
    '--blue-mid': theme.mid,
    '--blue-acc': theme.acc,
    '--blue-light': theme.light,
    '--blue-text': theme.text,
    '--blue-muted': theme.muted,
  } as React.CSSProperties;

  return (
    <div id="cv-output" style={cvStyle}>
      <div className="cv-sidebar">
        <div className="cv-name">{data.name}</div>
        <div className="cv-role">{data.role}</div>
        <hr className="cv-divider" />
        <div className="cv-s-block">
          <div className="cv-s-label">{t.contact}</div>
          {data.email && <div className="cv-s-item">{data.email}</div>}
          {data.phone && <div className="cv-s-item">{data.phone}</div>}
          {data.location && <div className="cv-s-item">{data.location}</div>}
        </div>
        {data.professionalSummary && (
          <div className="cv-s-block">
            <div className="cv-s-label">{t.profile}</div>
            <div className="cv-s-summary">{data.professionalSummary}</div>
          </div>
        )}
        {data.languages.length > 0 && (
          <div className="cv-s-block">
            <div className="cv-s-label">{t.languages}</div>
            {data.languages.map(l => (
              <div className="cv-lang-row" key={l.id}>
                <span className="cv-lang-name">{l.name}</span>
                <span className="cv-lang-level">{l.level}</span>
              </div>
            ))}
          </div>
        )}
        {(data.birth || data.nationality) && (
          <div className="cv-s-block">
            <div className="cv-s-label">{t.details}</div>
            {data.birth && <div className="cv-s-item">{t.birthLabel} {data.birth}</div>}
            {data.nationality && <div className="cv-s-item">{t.nationalityLabel} {data.nationality}</div>}
          </div>
        )}
      </div>

      <div className="cv-main">
        {data.experience.length > 0 && (
          <div className="cv-section">
            <div className="cv-m-label">{t.experience}</div>
            {data.experience.map(job => (
              <div className="cv-job" key={job.id}>
                <div className="cv-job-head">
                  <div className="cv-job-title">{job.title}{job.company ? ` — ${job.company}` : ''}</div>
                  {job.date && <span className="cv-job-date">{job.date}</span>}
                </div>
                {job.bullets.filter(Boolean).length > 0 && (
                  <ul className="cv-bullets">
                    {job.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {data.education.length > 0 && (
          <div className="cv-section">
            <div className="cv-m-label">{t.education}</div>
            {data.education.map(ed => (
              <div className="cv-job" key={ed.id}>
                <div className="cv-job-head">
                  <div className="cv-job-title">{ed.title}</div>
                  {ed.date && <span className="cv-job-date">{ed.date}</span>}
                </div>
                {ed.school && <div className="cv-job-co">{ed.school}</div>}
                {ed.bullets.filter(Boolean).length > 0 && (
                  <ul className="cv-bullets">
                    {ed.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                  </ul>
                )}
              </div>
            ))}
          </div>
        )}

        {data.skills.length > 0 && (
          <div className="cv-section">
            <div className="cv-m-label">{t.technicalSkills}</div>
            <div className="cv-skills">
              {data.skills.map((sk, i) => <span className="cv-skill" key={i}>{sk}</span>)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
