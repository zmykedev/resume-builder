import { Joyride, STATUS } from 'react-joyride';
import type { EventData, Step } from 'react-joyride';
import { useLang } from '../contexts/LangContext';
import type { Translations } from '../i18n/translations';

function buildSteps(t: Translations): Step[] {
  return [
    {
      target: '.editor-header h1',
      title: t.tour.step1Title,
      content: t.tour.step1Content,
      skipBeacon: true,
      placement: 'bottom',
    },
    {
      target: '.color-btn',
      title: t.tour.step2Title,
      content: t.tour.step2Content,
      placement: 'bottom',
    },
    {
      target: '#tour-personal',
      title: t.tour.step3Title,
      content: t.tour.step3Content,
      placement: 'right',
    },
    {
      target: '#tour-idiomas',
      title: t.tour.step4Title,
      content: t.tour.step4Content,
      placement: 'right',
    },
    {
      target: '#tour-experiencia',
      title: t.tour.step5Title,
      content: t.tour.step5Content,
      placement: 'right',
    },
    {
      target: '#tour-educacion',
      title: t.tour.step6Title,
      content: t.tour.step6Content,
      placement: 'right',
    },
    {
      target: '#tour-habilidades',
      title: t.tour.step7Title,
      content: t.tour.step7Content,
      placement: 'right',
    },
    {
      target: '.analyze-btn',
      title: t.tour.step8Title,
      content: t.tour.step8Content,
      placement: 'top',
    },
    {
      target: '.ats-toggle',
      title: t.tour.step9Title,
      content: t.tour.step9Content,
      placement: 'bottom',
    },
    {
      target: '.zoom-controls',
      title: t.tour.step10Title,
      content: t.tour.step10Content,
      placement: 'bottom',
    },
    {
      target: '.download-btn--pdf',
      title: t.tour.step11Title,
      content: t.tour.step11Content,
      placement: 'top',
      skipScroll: true,
    },
    {
      target: '.download-btn--docx',
      title: t.tour.step12Title,
      content: t.tour.step12Content,
      placement: 'top',
      skipScroll: true,
    },
  ];
}

interface GuidedTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function GuidedTour({ run, onFinish }: Readonly<GuidedTourProps>) {
  const { t } = useLang();

  function handleEvent({ status }: EventData) {
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onFinish();
    }
  }

  return (
    <Joyride
      steps={buildSteps(t)}
      run={run}
      continuous
      onEvent={handleEvent}
      options={{
        buttons: ['back', 'close', 'primary', 'skip'],
        showProgress: true,
        primaryColor: '#185FA5',
        overlayColor: 'rgba(0,0,0,0.45)',
        zIndex: 1000,
        width: 300,
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
