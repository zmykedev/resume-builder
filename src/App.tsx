import {
  CaretDownIcon,
  FileDocIcon,
  FilePdfIcon,
  MinusIcon,
  PaintBucketIcon,
  PlusIcon,
  QuestionIcon,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import CVPreview from "./components/CVPreview";
import Editor from "./components/Editor";
import GuidedTour from "./components/GuidedTour";
import { LangProvider } from "./contexts/LangContext";
import { useLang } from "./contexts/LangContext";
import { detectLang } from "./i18n/translations";
import { sampleData, sampleDataEn } from "./data/sampleData";
import { themeColors } from "./data/themeColors";
import type { CVData, ThemeName } from "./types";
import { exportDocx } from "./utils/exportDocx";
import { exportPdf } from "./utils/exportPdf";

const TOUR_KEY = "cv-maker-tour-seen";

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

  const activeTheme = hoverTheme || data.theme;

  useEffect(() => {
    if (!localStorage.getItem(TOUR_KEY)) {
      setRunTour(true);
    }
  }, []);

  const handleTourFinish = () => {
    setRunTour(false);
    localStorage.setItem(TOUR_KEY, "1");
  };

  const handlePdf = async () => {
    setLoadingPdf(true);
    try {
      await exportPdf(data.name);
    } finally {
      setLoadingPdf(false);
    }
  };

  const handleDocx = async () => {
    setLoadingDocx(true);
    try {
      await exportDocx(data);
    } finally {
      setLoadingDocx(false);
    }
  };

  return (
    <>
      <GuidedTour run={runTour} onFinish={handleTourFinish} />
      <div className="app">
        <div className="editor-panel">
          <div className="editor-header">
            <h1>{t.appTitle}</h1>
            <span className="header-badge">{t.editorBadge}</span>
          </div>
          <Editor data={data} setData={setData} />
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
            <div className="preview-toolbar">

              <div className="color-picker">
                <button
                  className="color-btn"
                  onClick={() => setShowColors((o) => !o)}
                  title={t.themeColor}
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
                    <div className="color-dropdown">
                      {Object.entries(themeColors).map(([name, colors]) => (
                        <button
                          key={name}
                          className={
                            data.theme === name ? "color-opt active" : "color-opt"
                          }
                          style={{ background: colors.dark }}
                          title={name}
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
              </div>

              <button
                className="tour-btn"
                onClick={() => setRunTour(true)}
                title={t.guidedTour}
              >
                <QuestionIcon weight="fill" />
              </button>

              <div className="ats-toggle">
                <button
                  className={atsMode ? "ats-toggle-btn" : "ats-toggle-btn active"}
                  onClick={() => setAtsMode(false)}
                >
                  {t.customized}
                </button>
                <button
                  className={atsMode ? "ats-toggle-btn active" : "ats-toggle-btn"}
                  onClick={() => setAtsMode(true)}
                >
                  {t.recommended}
                </button>
              </div>

              <div className="zoom-controls">
                <button
                  className="zoom-btn"
                  onClick={() => setZoom((z) => Math.max(0.5, z - 0.1))}
                  disabled={zoom <= 0.5}
                  title={t.zoomOut}
                >
                  <MinusIcon weight="bold" />
                </button>
                <span className="zoom-label">{Math.round(zoom * 100)}%</span>
                <button
                  className="zoom-btn"
                  onClick={() => setZoom((z) => Math.min(2, z + 0.1))}
                  disabled={zoom >= 2}
                  title={t.zoomIn}
                >
                  <PlusIcon weight="bold" />
                </button>
              </div>

            </div>
          </div>
          <div
            className="preview-zoom-wrapper"
            style={{
              transform: `scale(${zoom})`,
              transformOrigin: "top center",
            }}
          >
            <CVPreview
              data={data}
              themeColors={themeColors}
              previewTheme={hoverTheme}
              atsMode={atsMode}
            />
          </div>
        </div>
      </div>
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
