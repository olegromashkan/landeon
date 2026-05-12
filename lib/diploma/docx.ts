import fs from "node:fs";
import path from "node:path";
import {
  AlignmentType,
  BorderStyle,
  Document,
  Footer,
  ImageRun,
  LineRuleType,
  Packer,
  PageNumber,
  Paragraph,
  Table,
  TableCell,
  TableRow,
  TextRun,
  WidthType,
  convertMillimetersToTwip,
} from "docx";
import {
  documentSourcePages,
  pageAddenda,
  type TextBlock,
  type ThesisPage,
} from "@/lib/diploma/content";

const FONT = "Times New Roman";
const FONT_SIZE = 24;
const PARAGRAPH_INDENT = convertMillimetersToTwip(12.5);
const TABLE_CELL_MARGIN = convertMillimetersToTwip(1.5);
const PUBLIC_DIR = path.join(process.cwd(), "public");

const commonSpacing = {
  after: 200,
  line: 360,
  lineRule: LineRuleType.AUTO,
};

export async function buildDiplomaDocx(): Promise<Buffer> {
  const children = buildDocumentChildren(documentSourcePages);

  const doc = new Document({
    creator: "Landeon",
    title:
      "Разработка интеллектуального генеративного конструктора веб-сайтов на основе больших языковых моделей",
    description: "Дипломная работа ASEM по проекту Landeon",
    styles: {
      default: {
        document: {
          run: {
            font: FONT,
            size: FONT_SIZE,
          },
          paragraph: {
            spacing: commonSpacing,
            alignment: AlignmentType.JUSTIFIED,
          },
        },
      },
    },
    sections: [
      {
        properties: {
          page: {
            size: {
              width: convertMillimetersToTwip(210),
              height: convertMillimetersToTwip(297),
            },
            margin: {
              top: convertMillimetersToTwip(25),
              right: convertMillimetersToTwip(15),
              bottom: convertMillimetersToTwip(25),
              left: convertMillimetersToTwip(30),
            },
            pageNumbers: {
              start: 1,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [new TextRun({ children: [PageNumber.CURRENT], font: FONT, size: FONT_SIZE })],
              }),
            ],
          }),
        },
        children,
      },
    ],
  });

  return Packer.toBuffer(doc);
}

function buildDocumentChildren(sourcePages: ThesisPage[]) {
  const children: Array<Paragraph | Table> = [];

  for (const page of sourcePages) {
    if (page.type === "title") {
      children.push(...buildTitlePage());
      continue;
    }

    const blocks: TextBlock[] = [
      ...page.blocks,
      ...(pageAddenda[page.navTitle] ?? []).map((text): TextBlock => ({ type: "p", text })),
    ];

    for (const block of blocks) {
      const rendered = renderDocxBlock(block, children.length > 0);
      children.push(...rendered);
    }
  }

  return children;
}

function buildTitlePage(): Paragraph[] {
  return [
    centeredParagraph("ACADEMIA DE STUDII ECONOMICE DIN MOLDOVA", { bold: true }),
    centeredParagraph("Facultatea Tehnologii Informaționale și Statistică Economică"),
    centeredParagraph("Departamentul Tehnologia Informației și Management Informațional"),
    spacerParagraph(12),
    centeredParagraph("________________________________________", { bold: true }),
    spacerParagraph(5),
    centeredParagraph(
      "Разработка интеллектуального генеративного конструктора веб-сайтов на основе больших языковых моделей",
      { bold: true, allCaps: true }
    ),
    spacerParagraph(4),
    centeredParagraph("ДИПЛОМНАЯ РАБОТА", { bold: true }),
    centeredParagraph("Специальность: 0613.1 Технология информации"),
    spacerParagraph(8),
    plainParagraph("Автор: ________________________________, группа ________", { indent: 0 }),
    plainParagraph("Научный руководитель: ________________________________, должность ____________________", {
      indent: 0,
    }),
    plainParagraph("Допущено к защите: ____________________", { indent: 0 }),
    spacerParagraph(8),
    centeredParagraph("Кишинэу, 2026"),
  ];
}

function renderDocxBlock(block: TextBlock, hasPreviousContent: boolean): Array<Paragraph | Table> {
  if (block.type === "chapter") {
    return [
      new Paragraph({
        pageBreakBefore: hasPreviousContent,
        alignment: AlignmentType.CENTER,
        spacing: { after: 320, line: 360, lineRule: LineRuleType.AUTO },
        children: [
          new TextRun({
            text: block.text,
            bold: true,
            font: FONT,
            size: 28,
            allCaps: true,
          }),
        ],
      }),
    ];
  }

  if (block.type === "section") {
    return [
      new Paragraph({
        alignment: AlignmentType.LEFT,
        indent: { firstLine: PARAGRAPH_INDENT },
        spacing: { after: 240, line: 360, lineRule: LineRuleType.AUTO },
        children: [new TextRun({ text: block.text, bold: true, font: FONT, size: FONT_SIZE })],
      }),
    ];
  }

  if (block.type === "p") {
    return [plainParagraph(block.text)];
  }

  if (block.type === "list") {
    const start = block.start ?? 1;
    return block.items.map((item, index) =>
      plainParagraph(`${start + index}. ${item}`, { indent: PARAGRAPH_INDENT })
    );
  }

  if (block.type === "table") {
    const rows = [
      new TableRow({
        children: block.headers.map((header) =>
          tableCell(header, { bold: true, alignment: AlignmentType.CENTER })
        ),
      }),
      ...block.rows.map(
        (row) =>
          new TableRow({
            children: row.map((cell) => tableCell(cell)),
          })
      ),
    ];

    return [
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { after: 120 },
        children: [new TextRun({ text: block.caption, bold: true, font: FONT, size: FONT_SIZE })],
      }),
      new Table({
        width: { size: 100, type: WidthType.PERCENTAGE },
        rows,
      }),
    ];
  }

  if (block.type === "figure") {
    const imageRun = block.src ? buildImageRun(block.src, block.alt ?? block.caption) : null;

    if (imageRun) {
      return [
        new Paragraph({
          alignment: AlignmentType.CENTER,
          spacing: { before: 120, after: 120 },
          children: [imageRun],
        }),
        centeredParagraph(block.caption),
      ];
    }

    return [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        border: {
          top: { style: BorderStyle.SINGLE, size: 6, color: "111111" },
          bottom: { style: BorderStyle.SINGLE, size: 6, color: "111111" },
          left: { style: BorderStyle.SINGLE, size: 6, color: "111111" },
          right: { style: BorderStyle.SINGLE, size: 6, color: "111111" },
        },
        spacing: { before: 120, after: 120 },
        children: [new TextRun({ text: block.text, font: FONT, size: FONT_SIZE })],
      }),
      centeredParagraph(block.caption),
    ];
  }

  return [
    centeredParagraph(block.expression),
    plainParagraph(block.legend),
  ];
}

function buildImageRun(src: string, altText: string): ImageRun | null {
  const imagePath = path.join(PUBLIC_DIR, src.replace(/^\//, ""));

  if (!fs.existsSync(imagePath)) {
    return null;
  }

  const data = fs.readFileSync(imagePath);
  const size = getPngSize(data);
  const maxWidth = 520;
  const maxHeight = 360;
  const scale = size ? Math.min(maxWidth / size.width, maxHeight / size.height, 1) : 1;
  const width = size ? Math.round(size.width * scale) : maxWidth;
  const height = size ? Math.round(size.height * scale) : 120;

  return new ImageRun({
    type: "png",
    data,
    transformation: { width, height },
    altText: {
      title: altText,
      description: altText,
      name: altText,
    },
  });
}

function getPngSize(data: Buffer): { width: number; height: number } | null {
  const pngSignature = "89504e470d0a1a0a";

  if (data.subarray(0, 8).toString("hex") !== pngSignature) {
    return null;
  }

  return {
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
  };
}

function plainParagraph(
  text: string,
  options: { indent?: number; alignment?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {}
): Paragraph {
  return new Paragraph({
    alignment: options.alignment ?? AlignmentType.JUSTIFIED,
    indent: { firstLine: options.indent ?? PARAGRAPH_INDENT },
    spacing: commonSpacing,
    children: [new TextRun({ text, font: FONT, size: FONT_SIZE })],
  });
}

function centeredParagraph(
  text: string,
  options: { bold?: boolean; allCaps?: boolean } = {}
): Paragraph {
  return new Paragraph({
    alignment: AlignmentType.CENTER,
    spacing: commonSpacing,
    children: [
      new TextRun({
        text,
        bold: options.bold,
        allCaps: options.allCaps,
        font: FONT,
        size: FONT_SIZE,
      }),
    ],
  });
}

function spacerParagraph(lines: number): Paragraph {
  return new Paragraph({
    spacing: { after: lines * 160 },
    children: [new TextRun({ text: "", font: FONT, size: FONT_SIZE })],
  });
}

function tableCell(
  text: string,
  options: { bold?: boolean; alignment?: (typeof AlignmentType)[keyof typeof AlignmentType] } = {}
): TableCell {
  return new TableCell({
    margins: {
      top: TABLE_CELL_MARGIN,
      bottom: TABLE_CELL_MARGIN,
      left: TABLE_CELL_MARGIN,
      right: TABLE_CELL_MARGIN,
    },
    children: [
      new Paragraph({
        alignment: options.alignment ?? AlignmentType.LEFT,
        spacing: { after: 0 },
        children: [new TextRun({ text, bold: options.bold, font: FONT, size: 21 })],
      }),
    ],
  });
}
