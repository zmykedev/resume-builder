import html2pdf from 'html2pdf.js';

export function exportPdf(name: string): Promise<void> {
  const el = document.getElementById('cv-output');
  if (!el) return Promise.resolve();
  const filename = (name || 'cv').toLowerCase().replace(/\s+/g, '_') + '_cv.pdf';
  const opt = {
    margin: 0,
    filename,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
  };
  return html2pdf().set(opt).from(el).save();
}
