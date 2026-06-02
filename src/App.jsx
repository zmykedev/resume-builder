import { useState } from 'react';
import Editor from './components/Editor';
import CVPreview from './components/CVPreview';
import { defaultData, themeColors } from './data/defaultData';
import { exportPdf } from './utils/exportPdf';
import { exportDocx } from './utils/exportDocx';

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
    <polyline points="7 10 12 15 17 10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

export default function App() {
  const [data, setData] = useState(defaultData);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [hoverTheme, setHoverTheme] = useState(null);
  const [atsMode, setAtsMode] = useState(false);
  const activeTheme = hoverTheme || data.theme;

  const handlePdf = async () => {
    setLoadingPdf(true);
    try { await exportPdf(data.name); }
    finally { setLoadingPdf(false); }
  };

  const handleDocx = async () => {
    setLoadingDocx(true);
    try { await exportDocx(data); }
    finally { setLoadingDocx(false); }
  };

  return (
    <div className="app">
      <div className="editor-panel">
        <div className="editor-header">
          <h1>CV Maker</h1>
          <div className="header-right">
            <div className="color-picker">
              <button className="color-btn" onClick={() => setShowColors(o => !o)} title="Color del tema">
                <svg className="color-btn-icon" viewBox="0 0 24 24" fill="currentColor" width="14" height="14">
                  <path d="M12 22C6.49 22 2 17.51 2 12S6.49 2 12 2s10 4.04 10 9c0 3.31-2.69 6-6 6h-1.77c-.28 0-.5.22-.5.5 0 .12.05.23.13.33.41.47.64 1.06.64 1.67A2.5 2.5 0 0112 22zm0-18c-4.41 0-8 3.59-8 8s3.59 8 8 8c.28 0 .5-.22.5-.5a.54.54 0 00-.14-.35c-.41-.46-.63-1.05-.63-1.65a2.5 2.5 0 012.5-2.5H16c2.21 0 4-1.79 4-4 0-3.86-3.59-7-8-7z"/>
                  <circle cx="6.5" cy="11.5" r="1.5" fill="white"/>
                  <circle cx="9.5" cy="7.5" r="1.5" fill="white"/>
                  <circle cx="14.5" cy="7.5" r="1.5" fill="white"/>
                </svg>
                <span className="color-dot" style={{ background: themeColors[activeTheme].acc, boxShadow: `0 0 6px ${themeColors[activeTheme].acc}80` }} />
                <span className="color-arrow" >▾</span>
              </button>
              {showColors && (
                <>
                  <div className="color-backdrop" onClick={() => setShowColors(false)} />
                  <div className="color-dropdown">
                    {Object.entries(themeColors).map(([name, colors]) => (
                      <button
                        key={name}
                        className={`color-opt${data.theme === name ? " active" : ""}`}
                        style={{ background: colors.dark }}
                        title={name}
                        onMouseEnter={() => setHoverTheme(name)}
                        onMouseLeave={() => setHoverTheme(null)}
                        onClick={() => { setData(d => ({ ...d, theme: name })); setHoverTheme(null); setShowColors(false); }}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
            <span className="header-badge">Editor</span>
          </div>
        </div>
        <Editor data={data} setData={setData} />
        <div className="editor-footer">
          <div className="download-row">
            <button className="download-btn" onClick={handlePdf} disabled={loadingPdf}>
              <DownloadIcon />
              {loadingPdf ? "Generando..." : "PDF"}
            </button>
            <button className="download-btn download-btn--docx" onClick={handleDocx} disabled={loadingDocx}>
              <DownloadIcon />
              {loadingDocx ? "Generando..." : "DOCX"}
            </button>
          </div>
        </div>
      </div>

      <div className="preview-panel">
        <div className="preview-header">
          <span className="preview-label">Vista previa · A4</span>
          <div className="ats-toggle">
            <button
              className={`ats-toggle-btn${!atsMode ? " active" : ""}`}
              onClick={() => setAtsMode(false)}
            >
              Bonito
            </button>
            <button
              className={`ats-toggle-btn${atsMode ? " active" : ""}`}
              onClick={() => setAtsMode(true)}
            >
              ATS
            </button>
          </div>
        </div>
        <CVPreview
          data={data}
          themeColors={themeColors}
          previewTheme={hoverTheme}
          atsMode={atsMode}
        />
      </div>
    </div>
  );
}
