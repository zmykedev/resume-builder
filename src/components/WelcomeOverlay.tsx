import { useLang } from '../contexts/LangContext';

interface WelcomeOverlayProps {
  onDismiss: () => void;
}

export default function WelcomeOverlay({ onDismiss }: Readonly<WelcomeOverlayProps>) {
  const { t } = useLang();

  return (
    <div className="welcome-overlay">
      <div className="welcome-card">
        <div className="welcome-icon">👋</div>
        <h2 className="welcome-title">{t.welcomeTitle}</h2>
        <p className="welcome-message">{t.welcomeMessage}</p>
        <button className="welcome-cta" onClick={onDismiss}>
          {t.welcomeCta}
        </button>
      </div>
    </div>
  );
}
