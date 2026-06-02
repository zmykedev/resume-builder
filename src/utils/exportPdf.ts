import html2pdf from 'html2pdf.js';

export function exportPdf(name: string): Promise<void> {
  const el = document.getElementById('cv-output');
  if (!el) return Promise.resolve();
  const filename = (name || 'cv').toLowerCase().replace(/\s+/g, '_') + '_cv.pdf';
  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: {
      scale: 2,
      useCORS: true,
      letterRendering: true,
      width: 794,
      windowWidth: 794,
      scrollX: 0,
      scrollY: 0,
      backgroundColor: '#ffffff',
    },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
  };
  return html2pdf().set(opt).from(el).save();
}
