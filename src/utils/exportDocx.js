import {
  Document, Packer, Paragraph, TextRun, HeadingLevel,
  AlignmentType, BorderStyle, TabStopPosition, TabStopType,
} from 'docx';
import { saveAs } from 'file-saver';

const DARK = "111111";
const MID = "555555";
const GRAY_MID = "555555";
const BLACK = "1a1a1a";

function sectionHeading(text) {
  return new Paragraph({
    spacing: { before: 240, after: 80 },
    border: {
      bottom: { style: BorderStyle.SINGLE, size: 1, color: "333333" },
    },
    children: [
      new TextRun({
        text: text.toUpperCase(),
        font: "Arial",
        size: 22,
        color: "333333",
        bold: true,
      }),
    ],
  });
}

function bulletItem(text) {
  return new Paragraph({
    spacing: { after: 40 },
    indent: { left: 360 },
    children: [
      new TextRun({ text: "• ", color: MID, font: "Arial", size: 20 }),
      new TextRun({ text, font: "Arial", size: 20, color: GRAY_MID }),
    ],
  });
}

export async function exportDocx(data) {
  const children = [];

  // Name
  children.push(new Paragraph({
    spacing: { after: 40 },
    children: [
      new TextRun({
        text: data.name,
        font: "Arial",
        size: 36,
        bold: true,
        color: DARK,
      }),
    ],
  }));

  // Role
  children.push(new Paragraph({
    spacing: { after: 80 },
    children: [
      new TextRun({
        text: data.role.toUpperCase(),
        font: "Arial",
        size: 18,
        color: MID,
        characterSpacing: 60,
      }),
    ],
  }));

  // Contact line
  const contactParts = [data.email, data.phone, data.location].filter(Boolean);
  if (contactParts.length) {
    children.push(new Paragraph({
      spacing: { after: 60 },
      children: [
        new TextRun({
          text: contactParts.join("  |  "),
          font: "Arial",
          size: 18,
          color: GRAY_MID,
        }),
      ],
    }));
  }

  // Birth / nationality
  const dataParts = [];
  if (data.birth) dataParts.push(`Nacimiento: ${data.birth}`);
  if (data.nationality) dataParts.push(`Nacionalidad: ${data.nationality}`);
  if (dataParts.length) {
    children.push(new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: dataParts.join("  |  "),
          font: "Arial",
          size: 18,
          color: GRAY_MID,
        }),
      ],
    }));
  }

  // Professional Summary
  if (data.professionalSummary) {
    children.push(sectionHeading("Perfil"));
    children.push(new Paragraph({
      spacing: { after: 120 },
      children: [
        new TextRun({
          text: data.professionalSummary,
          font: "Arial",
          size: 20,
          color: BLACK,
        }),
      ],
    }));
  }

  // Languages
  if (data.languages.length > 0) {
    children.push(sectionHeading("Idiomas"));
    const languageText = data.languages
      .map(l => `${l.name} (${l.level})`)
      .join("  ·  ");
    children.push(new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: languageText,
          font: "Arial",
          size: 20,
          color: GRAY_MID,
        }),
      ],
    }));
  }

  // Experience
  if (data.experience.length > 0) {
    children.push(sectionHeading("Experiencia"));
    data.experience.forEach(job => {
      children.push(new Paragraph({
        spacing: { before: 120, after: 20 },
        children: [
          new TextRun({
            text: job.title + (job.company ? ` — ${job.company}` : ""),
            font: "Arial",
            size: 22,
            bold: true,
            color: DARK,
          }),
        ],
      }));
      if (job.date) {
        children.push(new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: job.date, font: "Arial", size: 18, color: MID }),
          ],
        }));
      }
      job.bullets.filter(Boolean).forEach(b => children.push(bulletItem(b)));
    });
  }

  // Education
  if (data.education.length > 0) {
    children.push(sectionHeading("Educación"));
    data.education.forEach(ed => {
      children.push(new Paragraph({
        spacing: { before: 120, after: 20 },
        children: [
          new TextRun({
            text: ed.title,
            font: "Arial",
            size: 22,
            bold: true,
            color: DARK,
          }),
        ],
      }));
      if (ed.school) {
        children.push(new Paragraph({
          spacing: { after: 20 },
          children: [
            new TextRun({ text: ed.school, font: "Arial", size: 20, color: GRAY_MID }),
          ],
        }));
      }
      if (ed.date) {
        children.push(new Paragraph({
          spacing: { after: 40 },
          children: [
            new TextRun({ text: ed.date, font: "Arial", size: 18, color: MID }),
          ],
        }));
      }
      ed.bullets.filter(Boolean).forEach(b => children.push(bulletItem(b)));
    });
  }

  // Skills
  if (data.skills.length > 0) {
    children.push(sectionHeading("Habilidades Técnicas"));
    children.push(new Paragraph({
      spacing: { after: 80 },
      children: [
        new TextRun({
          text: data.skills.join("  ·  "),
          font: "Arial",
          size: 20,
          color: DARK,
        }),
      ],
    }));
  }

  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: { top: 720, right: 720, bottom: 720, left: 720 },
        },
      },
      children,
    }],
  });

  const blob = await Packer.toBlob(doc);
  const filename = (data.name || "cv").toLowerCase().replace(/\s+/g, "_") + "_cv.docx";
  saveAs(blob, filename);
}
