import { useLang } from '../contexts/LangContext';
import type { CVData } from '../types';

interface ATSPreviewProps {
  data: CVData;
}

export default function ATSPreview({ data }: Readonly<ATSPreviewProps>) {
  const { t } = useLang();
  const contactParts = [data.email, data.phone, data.location].filter(Boolean);
  const contactLine = contactParts.join(' | ');

  return (
    <div id="cv-output" className="cv-ats">
      <header className="cv-ats-header">
        {data.name && <h1 className="cv-ats-name">{data.name}</h1>}
        {data.role && <p className="cv-ats-role">{data.role}</p>}
        {contactLine && <p className="cv-ats-contact">{contactLine}</p>}
      </header>

      {data.professionalSummary && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-heading">{t.professionalProfile}</h2>
          <p className="cv-ats-summary">{data.professionalSummary}</p>
        </section>
      )}

      {data.experience.length > 0 && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-heading">{t.experienceAts}</h2>
          {data.experience.map((job) => (
            <div className="cv-ats-item" key={job.id}>
              <div className="cv-ats-item-head">
                <span className="cv-ats-item-title">
                  {job.title}{job.company ? ` — ${job.company}` : ''}
                </span>
                {job.date && <span className="cv-ats-item-date">{job.date}</span>}
              </div>
              {job.bullets.filter(Boolean).length > 0 && (
                <ul className="cv-ats-bullets">
                  {job.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {data.education.length > 0 && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-heading">{t.educationAts}</h2>
          {data.education.map((ed) => (
            <div className="cv-ats-item" key={ed.id}>
              <div className="cv-ats-item-head">
                <span className="cv-ats-item-title">
                  {ed.title}{ed.school ? ` — ${ed.school}` : ''}
                </span>
                {ed.date && <span className="cv-ats-item-date">{ed.date}</span>}
              </div>
              {ed.bullets.filter(Boolean).length > 0 && (
                <ul className="cv-ats-bullets">
                  {ed.bullets.filter(Boolean).map((b, i) => <li key={i}>{b}</li>)}
                </ul>
              )}
            </div>
          ))}
        </section>
      )}

      {data.languages.length > 0 && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-heading">{t.languagesAts}</h2>
          <p className="cv-ats-languages">
            {data.languages.map((l) => `${l.name} (${l.level})`).join(' · ')}
          </p>
        </section>
      )}

      {data.skills.length > 0 && (
        <section className="cv-ats-section">
          <h2 className="cv-ats-heading">{t.technicalSkillsAts}</h2>
          <p className="cv-ats-skills">{data.skills.join(' · ')}</p>
        </section>
      )}
    </div>
  );
}
