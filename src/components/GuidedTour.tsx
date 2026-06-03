import { useEffect, useState } from 'react';
import { Joyride, STATUS, EVENTS, ACTIONS } from 'react-joyride';
import type { EventData, Step } from 'react-joyride';
import { useLang } from '../contexts/LangContext';
import type { Translations } from '../i18n/translations';

// Index at which preview-tab steps begin in the mobile sequence
const MOBILE_PREVIEW_START = 10;

function buildDesktopSteps(t: Translations): Step[] {
  return [
    { target: '.editor-header h1', title: t.tour.step1Title, content: t.tour.step1Content, skipBeacon: true, placement: 'bottom' },
    { target: '.color-btn',        title: t.tour.step2Title, content: t.tour.step2Content, placement: 'bottom' },
    { target: '#tour-personal',    title: t.tour.step3Title, content: t.tour.step3Content, placement: 'right' },
    { target: '#tour-idiomas',     title: t.tour.step4Title, content: t.tour.step4Content, placement: 'right' },
    { target: '#tour-experiencia', title: t.tour.step5Title, content: t.tour.step5Content, placement: 'right' },
    { target: '#tour-educacion',   title: t.tour.step6Title, content: t.tour.step6Content, placement: 'right' },
    { target: '#tour-habilidades', title: t.tour.step7Title, content: t.tour.step7Content, placement: 'right' },
    { target: '.analyze-btn',      title: t.tour.step8Title, content: t.tour.step8Content, placement: 'top' },
    { target: '.ats-toggle',       title: t.tour.step9Title, content: t.tour.step9Content, placement: 'bottom' },
    { target: '.zoom-controls',    title: t.tour.step10Title, content: t.tour.step10Content, placement: 'bottom' },
    { target: '.download-btn--pdf',  title: t.tour.step11Title, content: t.tour.step11Content, placement: 'top', skipScroll: true },
    { target: '.download-btn--docx', title: t.tour.step12Title, content: t.tour.step12Content, placement: 'top', skipScroll: true },
  ];
}

function buildMobileSteps(t: Translations): Step[] {
  return [
    // ── Editor tab (indices 0–8) ──────────────────────────────────────────────
    // Target .group-title (small heading row) instead of the full section div
    // so Joyride has room below to place the tooltip without flipping to top.
    { target: '.editor-header h1',                  title: t.tour.step1Title,  content: t.tour.step1Content,  skipBeacon: true, placement: 'bottom' },
    { target: '#tour-personal .group-title',         title: t.tour.step3Title,  content: t.tour.step3Content,  placement: 'bottom' },
    { target: '#tour-idiomas .group-title',          title: t.tour.step4Title,  content: t.tour.step4Content,  placement: 'bottom' },
    { target: '#tour-experiencia .group-title',      title: t.tour.step5Title,  content: t.tour.step5Content,  placement: 'bottom' },
    { target: '#tour-educacion .group-title',        title: t.tour.step6Title,  content: t.tour.step6Content,  placement: 'bottom' },
    { target: '#tour-habilidades .group-title',      title: t.tour.step7Title,  content: t.tour.step7Content,  placement: 'bottom' },
    { target: '.analyze-btn',      title: t.tour.step8Title,  content: t.tour.step8Content,  placement: 'top' },
    { target: '.download-btn--pdf',  title: t.tour.step11Title, content: t.tour.step11Content, placement: 'top', skipScroll: true },
    { target: '.download-btn--docx', title: t.tour.step12Title, content: t.tour.step12Content, placement: 'top', skipScroll: true },

    // ── Transition step (index 9) — points at tab bar, triggers preview switch ─
    { target: '.mobile-tabbar', title: t.tour.stepMobileTabTitle, content: t.tour.stepMobileTabContent, placement: 'top', skipBeacon: true },

    // ── Preview tab (indices 10–12, MOBILE_PREVIEW_START) ────────────────────
    { target: '.color-btn',     title: t.tour.step2Title,  content: t.tour.step2Content,  placement: 'bottom' },
    { target: '.ats-toggle',    title: t.tour.step9Title,  content: t.tour.step9Content,  placement: 'bottom' },
    { target: '.zoom-controls', title: t.tour.step10Title, content: t.tour.step10Content, placement: 'bottom' },
  ];
}

interface GuidedTourProps {
  run: boolean;
  onFinish: () => void;
  isMobile?: boolean;
  onTabSwitch?: (tab: 'editor' | 'preview') => void;
}

export default function GuidedTour({ run, onFinish, isMobile = false, onTabSwitch }: Readonly<GuidedTourProps>) {
  const { t } = useLang();
  const [stepIndex, setStepIndex] = useState(0);

  const steps = isMobile ? buildMobileSteps(t) : buildDesktopSteps(t);

  // Reset to step 0 each time the tour is (re-)launched
  useEffect(() => {
    if (run) setStepIndex(0);
  }, [run]);

  function handleEvent({ action, index, status, type }: EventData) {
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onFinish();
      return;
    }

    if (type !== EVENTS.STEP_AFTER) return;

    const next = action === ACTIONS.PREV ? index - 1 : index + 1;

    if (isMobile && action === ACTIONS.NEXT && index === MOBILE_PREVIEW_START - 1) {
      // Leaving transition step → switch to preview, wait for re-render
      onTabSwitch?.('preview');
      setTimeout(() => setStepIndex(next), 150);
    } else if (isMobile && action === ACTIONS.PREV && index === MOBILE_PREVIEW_START) {
      // Going back from first preview step → restore editor tab
      onTabSwitch?.('editor');
      setTimeout(() => setStepIndex(next), 150);
    } else {
      setStepIndex(next);
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      stepIndex={stepIndex}
      continuous
      onEvent={handleEvent}
      options={{
        buttons: ['back', 'close', 'primary', 'skip'],
        showProgress: true,
        primaryColor: '#185FA5',
        overlayColor: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
        width: isMobile ? Math.min(288, window.innerWidth - 32) : 300,
      }}
      styles={{
        tooltip: { borderRadius: 10, fontFamily: 'DM Sans, sans-serif' },
        tooltipTitle: { fontFamily: 'Playfair Display, serif', fontSize: 15 },
        buttonPrimary: { borderRadius: 6, fontFamily: 'DM Sans, sans-serif', background: '#185FA5' },
        buttonBack: { fontFamily: 'DM Sans, sans-serif' },
        buttonSkip: { fontFamily: 'DM Sans, sans-serif', color: '#888' },
      }}
    />
  );
}
