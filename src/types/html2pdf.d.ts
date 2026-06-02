declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | number[];
    filename?: string;
    image?: { type?: string; quality?: number };
    html2canvas?: { scale?: number; useCORS?: boolean; letterRendering?: boolean };
    jsPDF?: { unit?: string; format?: string | number[]; orientation?: string };
  }

  interface Html2PdfChain {
    set(options: Html2PdfOptions): Html2PdfChain;
    from(element: HTMLElement): Html2PdfChain;
    save(): Promise<void>;
  }

  function html2pdf(): Html2PdfChain;
  export = html2pdf;
}
