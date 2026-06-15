import {
  CaretDownIcon,
  EyeIcon,
  FileDocIcon,
  FilePdfIcon,
  MinusIcon,
  NotePencilIcon,
  PaintBucketIcon,
  PlusIcon,
  QuestionIcon,
} from "@phosphor-icons/react";
import { lazy, Suspense, useEffect, useState } from "react";
import CVPreview from "./components/CVPreview";
import WelcomeOverlay from "./components/WelcomeOverlay";
import Editor from "./components/Editor";
import { LangProvider, useLang } from "./contexts/LangContext";
import { detectLang } from "./i18n/translations";
import { sampleData, sampleDataEn } from "./data/sampleData";
import { themeColors } from "./data/themeColors";
import type { CVData, ThemeName } from "./types";

// Loaded only when the user actually opens the tour
const GuidedTour = lazy(() => import('./components/GuidedTour'));

const emptyData: CVData = {
  name: '',
  role: '',
  email: '',
  phone: '',
  location: '',
  birth: '',
  nationality: '',
  professionalSummary: '',
  jobDescription: '',
  atsMode: false,
  languages: [],
  experience: [],
  education: [],
  theme: 'blue',
  skills: [],
};

const initialData = detectLang() === 'en' ? sampleDataEn : sampleData;

function AppInner() {
  const { t } = useLang();
  const [data, setData] = useState<CVData>(initialData);
  const [loadingPdf, setLoadingPdf] = useState(false);
  const [loadingDocx, setLoadingDocx] = useState(false);
  const [showColors, setShowColors] = useState(false);
  const [hoverTheme, setHoverTheme] = useState<string | null>(null);
  const [atsMode, setAtsMode] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [runTour, setRunTour] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [mobileTab, setMobileTab] = useState<'editor' | 'preview'>('editor');

  const activeTheme = hoverTheme || data.theme;

  useEffect(() => {
    if (mobileTab === 'preview' && window.innerWidth <= 900) {
      setZoom(Math.max(0.3, Math.round(window.innerWidth / 794 * 10) / 10));
    }
  }, [mobileTab]);

  const handleTourFinish = () => setRunTour(false);

  // CTA button: dismiss overlay + start fresh with empty skeleton
  const handleWelcomeCta = () => {
    setShowWelcome(false);
    setData({ ...emptyData });
  };

  // First edit in editor: dismiss overlay, keep existing data (user is editing)
  const handleFirstEdit = () => {
    if (showWelcome) setShowWelcome(false);
  };

  // Dynamic imports: html2pdf.js (~180 KB) and docx (~90 KB) are only fetched
  // when the user actually clicks export — not on initial page load.
  const handlePdf = async () => {
    setLoadingPdf(true);
    try {
      const { exportPdf } = await import('./utils/exportPdf');
      await exportPdf(data.name);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleDocx = async () => {
    setLoadingDocx(true);
    try {
      const { exportDocx } = await import('./utils/exportDocx');
      await exportDocx(data);
    } finally {
      setLoadingDocx(false);
    }
  };

  return (
    <>
      {runTour && (
        <Suspense fallback={null}>
          <GuidedTour
            run={runTour}
            onFinish={handleTourFinish}
            isMobile={window.innerWidth <= 900}
            onTabSwitch={setMobileTab}
          />
        </Suspense>
      )}
      <main className="app" data-mobile-tab={mobileTab}>
        <div className="editor-panel">
          <div className="editor-header">
            <h1>{t.appTitle}</h1>
            <span className="header-badge">{t.editorBadge}</span>
          </div>
          <Editor data={data} setData={setData} onFirstEdit={handleFirstEdit} />
          <div className="editor-footer">
            <div className="download-row">
              <button
                className="download-btn download-btn--pdf"
                onClick={handlePdf}
                disabled={loadingPdf}
              >
                {loadingPdf ? (
                  <span className="download-spinner" />
                ) : (
                  <FilePdfIcon weight="duotone" />
                )}
                <span className="download-text">
                  <span className="download-label">
                    {loadingPdf ? t.generating : t.exportPdf}
                  </span>
                  <span className="download-hint">{t.resumePdf}</span>
                </span>
              </button>
              <button
                className="download-btn download-btn--docx"
                onClick={handleDocx}
                disabled={loadingDocx}
              >
                {loadingDocx ? (
                  <span className="download-spinner" />
                ) : (
                  <FileDocIcon weight="duotone" />
                )}
                <span className="download-text">
                  <span className="download-label">
                    {loadingDocx ? t.generating : t.exportDocx}
                  </span>
                  <span className="download-hint">{t.resumeDocx}</span>
                </span>
              </button>
            </div>
          </div>
        </div>

        <div className="preview-panel">
          <div className="preview-header">
            <span className="preview-label">{t.preview}</span>
            <div className={`preview-toolbar${atsMode ? ' preview-toolbar--ats' : ''}`}>

              {!atsMode && <div className="color-picker">
                <button
                  className="color-btn"
                  onClick={() => setShowColors((o) => !o)}
                  aria-label={t.themeColor}
                  aria-expanded={showColors}
                >
                  <PaintBucketIcon className="color-btn-icon" weight="fill" />
                  <span
                    className="color-dot"
                    style={{
                      background: themeColors[activeTheme as ThemeName].acc,
                      boxShadow: `0 0 6px ${themeColors[activeTheme as ThemeName].acc}80`,
                    }}
                  />
                  <CaretDownIcon className="color-arrow" weight="bold" />
                </button>
                {showColors && (
                  <>
                    <button
                      className="color-backdrop"
                      onClick={() => setShowColors(false)}
                      aria-label={t.closeColorPicker}
                    />
                    <div className="color-dropdown" role="listbox" aria-label={t.themeColor}>
                      {Object.entries(themeColors).map(([name, colors]) => (
                        <button
                          key={name}
                          role="option"
                          aria-selected={data.theme === name}
                          className={
                            data.theme === name ? "color-opt active" : "color-opt"
                          }
                          style={{ background: colors.dark }}
                          aria-label={name}
                          onMouseEnter={() => setHoverTheme(name)}
                          onMouseLeave={() => setHoverTheme(null)}
                          onClick={() => {
                            setData((d: CVData) => ({
                              ...d,
                              theme: name as ThemeName,
                            }));
                            setHoverTheme(null);
                            setShowColors(false);
                          }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </div>}

              <button
                className="tour-btn"
                onClick={() => setRunTour(true)}
                aria-label={t.guidedTour}
              >
                <QuestionIcon weight="fill" />
              </button>

              <div className="ats-toggle" role="group" aria-label="View mode">
                <button
                  className={atsMode ? "ats-toggle-btn" : "ats-toggle-btn active"}
                  onClick={() => setAtsMode(false)}
                  aria-pressed={!atsMode}
                >
                  {t.customized}
                </button>
                <button
                  className={atsMode ? "ats-toggle-btn active" : "ats-toggle-btn"}
                  onClick={() => { setAtsMode(true); setShowColors(false); }}
                  aria-pressed={atsMode}
                >
                  {t.recommended}
                </button>
              </div>

              <div className="zoom-controls" role="group" aria-label="Zoom">
                <button
                  className="zoom-btn"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                  disabled={zoom <= 0.5}
                  aria-label={t.zoomOut}
                >
                  <MinusIcon weight="bold" />
                </button>
                <span className="zoom-label" aria-live="polite">{Math.round(zoom * 100)}%</span>
                <button
                  className="zoom-btn"
                  onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                  disabled={zoom >= 2}
                  aria-label={t.zoomIn}
                >
                  <PlusIcon weight="bold" />
                </button>
              </div>

            </div>
          </div>
          <div className="preview-stage">
            {showWelcome && <WelcomeOverlay onDismiss={handleWelcomeCta} />}
            <div
              className="preview-zoom-wrapper"
              style={{
                '--zoom': zoom,
                transform: `scale(${zoom})`,
                transformOrigin: "top center",
              } as React.CSSProperties}
            >
              <CVPreview
                data={data}
                themeColors={themeColors}
                previewTheme={hoverTheme}
                atsMode={atsMode}
              />
            </div>
          </div>

          {/* Download buttons pinned to bottom of preview panel on mobile */}
          <div className="mobile-preview-footer">
            <button
              className="download-btn download-btn--pdf"
              onClick={handlePdf}
              disabled={loadingPdf}
            >
              {loadingPdf ? <span className="download-spinner" /> : <FilePdfIcon weight="duotone" />}
              <span className="download-text">
                <span className="download-label">{loadingPdf ? t.generating : t.exportPdf}</span>
                <span className="download-hint">{t.resumePdf}</span>
              </span>
            </button>
            <button
              className="download-btn download-btn--docx"
              onClick={handleDocx}
              disabled={loadingDocx}
            >
              {loadingDocx ? <span className="download-spinner" /> : <FileDocIcon weight="duotone" />}
              <span className="download-text">
                <span className="download-label">{loadingDocx ? t.generating : t.exportDocx}</span>
                <span className="download-hint">{t.resumeDocx}</span>
              </span>
            </button>
          </div>
        </div>

        <nav className="mobile-tabbar" aria-label="Navigation">
          <button
            className={`mobile-tab${mobileTab === 'editor' ? ' active' : ''}`}
            onClick={() => setMobileTab('editor')}
            aria-pressed={mobileTab === 'editor'}
          >
            <NotePencilIcon weight={mobileTab === 'editor' ? 'fill' : 'regular'} />
            <span>Edit</span>
          </button>
          <button
            className={`mobile-tab${mobileTab === 'preview' ? ' active' : ''}`}
            onClick={() => setMobileTab('preview')}
            aria-pressed={mobileTab === 'preview'}
          >
            <EyeIcon weight={mobileTab === 'preview' ? 'fill' : 'regular'} />
            <span>Preview</span>
          </button>
        </nav>
      </main>
    </>
  );
}

export default function App() {
  return (
    <LangProvider>
      <AppInner />
    </LangProvider>
  );
}
