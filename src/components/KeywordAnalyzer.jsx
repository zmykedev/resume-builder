import { useState } from 'react';
import { analyzeJobDescription } from '../utils/keywordMatcher';

function getCoverageStyle(coverage) {
  if (coverage >= 70) {
    return { background: '#e8f5e9', color: '#2e7d32' };
  }
  if (coverage >= 40) {
    return { background: '#fff3e0', color: '#e65100' };
  }
  return { background: '#fce4ec', color: '#c62828' };
}

export default function KeywordAnalyzer({ data }) {
  const [jdText, setJdText] = useState(data?.jobDescription || '');
  const [result, setResult] = useState(null);

  function handleAnalyze() {
    const trimmed = jdText.trim();
    if (!trimmed) {
      setResult({ error: 'Pega una descripción de puesto para analizar.' });
      return;
    }

    const analysis = analyzeJobDescription(trimmed, data);

    if (analysis.found.length === 0 && analysis.missing.length === 0) {
      setResult({
        error:
          'No se encontraron keywords técnicas en la descripción. Intenta con un texto más detallado.',
      });
      return;
    }

    setResult(analysis);
  }

  return (
    <div className="field-group">
      <div className="group-title">Análisis de Puesto</div>

      <label>Descripción del puesto (JD)</label>
      <textarea
        className="jd-textarea"
        rows={6}
        placeholder="Pega aquí la descripción del puesto para analizar la coincidencia con tu CV..."
        value={jdText}
        onChange={(e) => setJdText(e.target.value)}
      />

      <button className="analyze-btn" onClick={handleAnalyze}>
        Analizar coincidencia
      </button>

      {result && result.error && (
        <div className="kw-error">{result.error}</div>
      )}

      {result && !result.error && (
        <div className="kw-results">
          <div className="kw-coverage">
            <span
              className="kw-coverage-badge"
              style={getCoverageStyle(result.coverage)}
            >
              {result.coverage}% coincidencia
            </span>
            <span className="kw-coverage-text">
              {result.found.length} encontradas · {result.missing.length} faltantes
            </span>
          </div>

          {result.missing.length > 0 && (
            <div className="kw-section">
              <div className="kw-section-title missing">FALTANTES ({result.missing.length})</div>
              <div className="kw-tags">
                {result.missing.map((item) => (
                  <span key={item.keyword} className="kw-tag kw-tag--missing" title={item.suggest}>
                    {item.keyword}
                    <span className="kw-tag-hint"> → {item.suggest}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          {result.found.length > 0 && (
            <div className="kw-section">
              <div className="kw-section-title found">ENCONTRADAS ({result.found.length})</div>
              <div className="kw-tags">
                {result.found.map((keyword) => (
                  <span key={keyword} className="kw-tag kw-tag--found">
                    {keyword}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
