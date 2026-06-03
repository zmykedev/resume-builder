import { useState } from 'react';
import { analyzeJobDescription } from '../utils/keywordMatcher';
import { useLang } from '../contexts/LangContext';
import type { CVData, AnalysisResult, AnalysisError } from '../types';

interface KeywordAnalyzerProps {
  data: CVData;
}

function getCoverageStyle(coverage: number): React.CSSProperties {
  if (coverage >= 70) return { background: '#e8f5e9', color: '#2e7d32' };
  if (coverage >= 40) return { background: '#fff3e0', color: '#e65100' };
  return { background: '#fce4ec', color: '#c62828' };
}

export default function KeywordAnalyzer({ data }: Readonly<KeywordAnalyzerProps>) {
  const { t } = useLang();
  const [jdText, setJdText] = useState(data?.jobDescription ?? '');
  const [result, setResult] = useState<AnalysisResult | AnalysisError | null>(null);

  function handleAnalyze() {
    const trimmed = jdText.trim();
    if (!trimmed) {
      setResult({ error: t.errorNoPaste });
      return;
    }
    const analysis = analyzeJobDescription(trimmed, data);
    if (analysis.found.length === 0 && analysis.missing.length === 0) {
      setResult({ error: t.errorNoKeywords });
      return;
    }
    setResult(analysis);
  }

  const hasError = result && 'error' in result;
  const hasResults = result && !hasError;

  return (
    <div className="field-group">
      <div className="group-title">{t.jobAnalysis}</div>
      <label>{t.jobDescriptionLabel}</label>
      <textarea
        className="jd-textarea"
        rows={6}
        placeholder={t.jobDescriptionPlaceholder}
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
      />
      <button className="analyze-btn" onClick={handleAnalyze}>
        {t.analyzeBtn}
      </button>

      {hasError && <div className="kw-error">{(result as AnalysisError).error}</div>}

      {hasResults && (() => {
        const r = result as AnalysisResult;
        return (
          <div className="kw-results">
            <div className="kw-coverage">
              <span className="kw-coverage-badge" style={getCoverageStyle(r.coverage)}>
                {r.coverage}% {t.matchCoverage}
              </span>
              <span className="kw-coverage-text">
                {r.found.length} {t.foundCount} · {r.missing.length} {t.missingCount}
              </span>
            </div>
            {r.missing.length > 0 && (
              <div className="kw-section">
                <div className="kw-section-title missing">{t.missingLabel} ({r.missing.length})</div>
                <div className="kw-tags">
                  {r.missing.map((item) => (
                    <span key={item.keyword} className="kw-tag kw-tag--missing" title={item.suggest}>
                      {item.keyword}
                      <span className="kw-tag-hint"> → {item.suggest}</span>
                    </span>
                  ))}
                </div>
              </div>
            )}
            {r.found.length > 0 && (
              <div className="kw-section">
                <div className="kw-section-title found">{t.foundLabel} ({r.found.length})</div>
                <div className="kw-tags">
                  {r.found.map((keyword) => (
                    <span key={keyword} className="kw-tag kw-tag--found">{keyword}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
