import { Joyride, STATUS } from 'react-joyride';
import type { EventData, Step } from 'react-joyride';

const steps: Step[] = [
  {
    target: '.editor-header h1',
    title: 'Bienvenido a CV Maker',
    content: 'Este tour te guiará por todas las funciones. Puedes saltarlo en cualquier momento.',
    skipBeacon: true,
    placement: 'bottom',
  },
  {
    target: '.color-btn',
    title: 'Tema de color',
    content: 'Cambia la paleta de colores de tu CV. Tienes 6 opciones profesionales.',
    placement: 'bottom',
  },
  {
    target: '#tour-personal',
    title: 'Datos Personales',
    content: 'Ingresa tu nombre, rol, contacto y resumen profesional. Este resumen es clave para los sistemas ATS.',
    placement: 'right',
  },
  {
    target: '#tour-idiomas',
    title: 'Idiomas',
    content: 'Agrega los idiomas que manejas y tu nivel en cada uno.',
    placement: 'right',
  },
  {
    target: '#tour-experiencia',
    title: 'Experiencia',
    content: 'Añade tus trabajos anteriores. Usa los puntos clave para describir logros y responsabilidades concretas.',
    placement: 'right',
  },
  {
    target: '#tour-educacion',
    title: 'Educación',
    content: 'Registra tus estudios, bootcamps y certificaciones relevantes.',
    placement: 'right',
  },
  {
    target: '#tour-habilidades',
    title: 'Habilidades',
    content: 'Escribe una habilidad y presiona Enter para agregarla. Haz clic en ✕ para eliminarla.',
    placement: 'right',
  },
  {
    target: '.analyze-btn',
    title: 'Análisis de Puesto',
    content: 'Pega la descripción de un empleo y te mostramos qué tan bien coincide tu CV y qué keywords te faltan.',
    placement: 'top',
  },
  {
    target: '.ats-toggle',
    title: 'Modos de vista',
    content: '"Customizado" muestra el diseño visual. "Recomendado" es el formato ATS limpio, ideal para filtros automáticos.',
    placement: 'bottom',
  },
  {
    target: '.zoom-controls',
    title: 'Zoom',
    content: 'Ajusta el tamaño de la vista previa para revisar cada detalle.',
    placement: 'bottom',
  },
  {
    target: '.download-btn--pdf',
    title: 'Exportar PDF',
    content: 'Descarga tu CV como PDF listo para enviar.',
    placement: 'top',
    skipScroll: true,
  },
  {
    target: '.download-btn--docx',
    title: 'Exportar Word',
    content: 'Descarga tu CV en formato Word para editarlo después.',
    placement: 'top',
    skipScroll: true,
  },
];

interface GuidedTourProps {
  run: boolean;
  onFinish: () => void;
}

export default function GuidedTour({ run, onFinish }: Readonly<GuidedTourProps>) {
  function handleEvent({ status }: EventData) {
    if (status === STATUS.FINISHED || status === STATUS.SKIPPED) {
      onFinish();
    }
  }

  return (
    <Joyride
      steps={steps}
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
