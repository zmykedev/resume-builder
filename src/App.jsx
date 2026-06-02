import { useState } from 'react';
import {
  FileDoc,
  PaintBucket,
  Minus,
  Plus,
  CaretDown,
  FilePdf,
} from '@phosphor-icons/react';
import Editor from './components/Editor';
import CVPreview from './components/CVPreview';
import { defaultData, themeColors } from './data/defaultData';
import { exportPdf } from './utils/exportPdf';
import { exportDocx } from './utils/exportDocx';

export default function App() {
  const [data, setData] = useState(defaultData);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [hoverTheme, setHoverTheme] = useState(null);
  const [atsMode, setAtsMode] = useState(false);
  const [zoom, setZoom] = useState(1);
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
                <PaintBucket className="color-btn-icon" weight="fill" />
                <span className="color-dot" style={{ background: themeColors[activeTheme].acc, boxShadow: `0 0 6px ${themeColors[activeTheme].acc}80` }} />
                <CaretDown className="color-arrow" weight="bold" />
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
            <button className="download-btn download-btn--pdf" onClick={handlePdf} disabled={loadingPdf}>
              {loadingPdf ? (
                <span className="download-spinner" />
              ) : (
                <FilePdf weight="duotone" />
              )}
              <span className="download-text">
                <span className="download-label">{loadingPdf ? "Generando..." : "Exportar PDF"}</span>
                <span className="download-hint">Currículum en PDF</span>
              </span>
            </button>
            <button className="download-btn download-btn--docx" onClick={handleDocx} disabled={loadingDocx}>
              {loadingDocx ? (
                <span className="download-spinner" />
              ) : (
                <FileDoc weight="duotone" />
              )}
              <span className="download-text">
                <span className="download-label">{loadingDocx ? "Generando..." : "Exportar DOCX"}</span>
                <span className="download-hint">Currículum en Word</span>
              </span>
            </button>
          </div>
        </div>
      </div>

      <div className="preview-panel">
        <div className="preview-header">
          <span className="preview-label">Vista previa · A4</span>
          <div className="preview-toolbar">
            <div className="ats-toggle">
              <button
                className={`ats-toggle-btn${!atsMode ? " active" : ""}`}
                onClick={() => setAtsMode(false)}
              >
                Customizado
              </button>
              <button
                className={`ats-toggle-btn${atsMode ? " active" : ""}`}
                onClick={() => setAtsMode(true)}
              >
                Recomendado
              </button>
            </div>
            <div className="zoom-controls">
              <button
                className="zoom-btn"
                onClick={() => setZoom(z => Math.max(0.5, z - 0.1))}
                disabled={zoom <= 0.5}
                title="Alejar"
              >
                <Minus weight="bold" />
              </button>
              <span className="zoom-label">{Math.round(zoom * 100)}%</span>
              <button
                className="zoom-btn"
                onClick={() => setZoom(z => Math.min(2, z + 0.1))}
                disabled={zoom >= 2}
                title="Acercar"
              >
                <Plus weight="bold" />
              </button>
            </div>
          </div>
        </div>
        <div className="preview-zoom-wrapper" style={{ transform: `scale(${zoom})`, transformOrigin: 'top center' }}>
          <CVPreview
            data={data}
            themeColors={themeColors}
            previewTheme={hoverTheme}
            atsMode={atsMode}
          />
        </div>
      </div>
    </div>
  );
}
