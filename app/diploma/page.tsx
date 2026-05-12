import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Download, FileText, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { documentPages, frontMatterPages, type TextBlock } from "@/lib/diploma/content";

export const metadata: Metadata = {
  title: "Дипломная работа - Landeon",
  description:
    "A4-версия дипломной работы о разработке интеллектуального генеративного конструктора веб-сайтов на основе больших языковых моделей.",
};

function renderBlock(block: TextBlock, index: number) {
  if (block.type === "chapter") {
    return (
      <h1 key={index} className="thesis-chapter-title">
        {block.text}
      </h1>
    );
  }

  if (block.type === "section") {
    return (
      <h2 key={index} className="thesis-section-title">
        {block.text}
      </h2>
    );
  }

  if (block.type === "p") {
    return <p key={index}>{block.text}</p>;
  }

  if (block.type === "list") {
    return (
      <ol key={index} className="thesis-list" start={block.start}>
        {block.items.map((item) => (
          <li key={item}>{item}</li>
        ))}
      </ol>
    );
  }

  if (block.type === "table") {
    return (
      <div key={index} className="thesis-table-wrap">
        {block.caption.trim() && <div className="thesis-table-caption">{block.caption}</div>}
        <table className="thesis-table">
          <thead>
            <tr>
              {block.headers.map((header) => (
                <th key={header}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={`${row.join("-")}-${rowIndex}`}>
                {row.map((cell, cellIndex) => (
                  <td key={`${cell}-${cellIndex}`}>{cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (block.type === "figure") {
    return (
      <div key={index} className="thesis-figure">
        {block.src ? (
          <img className="thesis-figure-image" src={block.src} alt={block.alt ?? block.caption} />
        ) : (
          <div className="thesis-figure-box">{block.text}</div>
        )}
        <div className="thesis-figure-caption">{block.caption}</div>
      </div>
    );
  }

  return (
    <div key={index} className="thesis-formula">
      <div className="thesis-formula-expression">{block.expression}</div>
      <p>{block.legend}</p>
    </div>
  );
}

function TitlePage() {
  return (
    <>
      <p className="thesis-title-center no-indent" style={{ fontWeight: 700 }}>
        ACADEMIA DE STUDII ECONOMICE DIN MOLDOVA
      </p>
      <p className="thesis-title-center no-indent">Facultatea Tehnologii Informaționale și Statistică Economică</p>
      <p className="thesis-title-center no-indent">Departamentul Tehnologia Informației și Management Informațional</p>

      <div style={{ marginTop: "42mm" }}>
        <p className="thesis-title-center no-indent" style={{ fontWeight: 700 }}>
          ________________________________________
        </p>
      </div>

      <div style={{ marginTop: "22mm" }}>
        <p className="thesis-title-center no-indent" style={{ fontWeight: 700, textTransform: "uppercase" }}>
          Разработка интеллектуального генеративного конструктора веб-сайтов на основе больших языковых моделей
        </p>
      </div>

      <div style={{ marginTop: "16mm" }}>
        <p className="thesis-title-center no-indent" style={{ fontWeight: 700 }}>
          ДИПЛОМНАЯ РАБОТА
        </p>
        <p className="thesis-title-center no-indent">Специальность: 0613.1 Технология информации</p>
      </div>

      <div style={{ marginTop: "34mm", marginLeft: "62mm" }}>
        <p className="no-indent">Автор: ________________________________, группа ________</p>
        <p className="no-indent">Научный руководитель: ________________________________, должность ____________________</p>
        <p className="no-indent">Допущено к защите: ____________________</p>
      </div>

      <div style={{ position: "absolute", left: "30mm", right: "15mm", bottom: "25mm" }}>
        <p className="thesis-title-center no-indent">Кишинэу, 2026</p>
      </div>
    </>
  );
}

export default function DiplomaPage() {
  const findPageByChapter = (chapterTitle: string, fallback: number) => {
    const pageIndex = documentPages.findIndex((page) =>
      page.type === "content" && page.blocks.some((block) => block.type === "chapter" && block.text === chapterTitle)
    );

    return pageIndex >= 0 ? pageIndex + 1 : fallback;
  };

  const appendixStartIndex = documentPages.findIndex((page) =>
    page.type === "content" && page.blocks.some((block) => block.type === "chapter" && block.text === "ПРИЛОЖЕНИЯ")
  );
  const appendixPageNumber = appendixStartIndex >= 0 ? appendixStartIndex + 1 : documentPages.length;
  const visibleMainPages =
    appendixStartIndex >= 0 ? appendixStartIndex - frontMatterPages.length : documentPages.length - frontMatterPages.length;
  const visibleTotalPages = documentPages.length - frontMatterPages.length;
  const introPageNumber = findPageByChapter("ВВЕДЕНИЕ", 6);
  const chapterOnePageNumber = findPageByChapter(
    "I. ТЕОРЕТИЧЕСКИЕ ОСНОВЫ ГЕНЕРАТИВНОГО КОНСТРУИРОВАНИЯ ВЕБ-САЙТОВ",
    9
  );
  const chapterTwoPageNumber = findPageByChapter("II. ПРОЕКТИРОВАНИЕ ИНТЕЛЛЕКТУАЛЬНОГО КОНСТРУКТОРА LANDEON", 25);
  const chapterThreePageNumber = findPageByChapter(
    "III. РЕАЛИЗАЦИЯ И ТЕСТИРОВАНИЕ ПРОГРАММНОГО ПРОДУКТА",
    45
  );
  const conclusionsPageNumber = findPageByChapter("ВЫВОДЫ И РЕКОМЕНДАЦИИ", 61);
  const bibliographyPageNumber = findPageByChapter("БИБЛИОГРАФИЯ", 63);

  return (
    <div lang="ru" className="min-h-screen bg-[#0a0a0f] text-zinc-100">
      <header className="print-hidden sticky top-0 z-20 border-b border-zinc-800/80 bg-zinc-950/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon" className="text-zinc-500 hover:text-zinc-100">
              <Link href="/" aria-label="Вернуться на главную">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-purple-600">
                <Zap className="h-4 w-4 text-white" />
              </div>
              <span className="font-bold tracking-tight text-zinc-100">Landeon</span>
            </div>
          </div>
          <div className="hidden items-center gap-2 text-xs text-zinc-500 sm:flex">
            <FileText className="h-3.5 w-3.5" />
            Дипломная работа
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-8 sm:px-6 lg:grid-cols-[280px_minmax(0,1fr)] print:block print:p-0">
        <aside className="print-hidden lg:sticky lg:top-20 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto">
          <div className="rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
            <div className="mb-4 flex items-center gap-2">
              <FileText className="h-4 w-4 text-purple-300" />
              <h2 className="text-sm font-semibold text-zinc-100">Документ</h2>
            </div>
            <div className="space-y-2 text-sm leading-6 text-zinc-400">
              <p>Формат: A4</p>
              <p>Основной объём: {visibleMainPages} стр. (норма 50-60)</p>
              <p>Всего с приложениями: {visibleTotalPages} стр.</p>
              <p>Шрифт: Times New Roman, 12 pt</p>
              <p>Интервал: 1.5</p>
              <p>Поля: 30/25/15/25 мм</p>
            </div>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
            <h2 className="mb-4 text-sm font-semibold text-zinc-100">Навигация</h2>
            <nav className="space-y-1">
              {[
                ["Титул", "#page-1"],
                ["Введение", `#page-${introPageNumber}`],
                ["Глава I", `#page-${chapterOnePageNumber}`],
                ["Глава II", `#page-${chapterTwoPageNumber}`],
                ["Глава III", `#page-${chapterThreePageNumber}`],
                ["Выводы", `#page-${conclusionsPageNumber}`],
                ["Библиография", `#page-${bibliographyPageNumber}`],
                ["Приложения", `#page-${appendixPageNumber}`],
              ].map(([label, href]) => (
                <a
                  key={href}
                  href={href}
                  className="block rounded-md px-3 py-2 text-sm leading-5 text-zinc-400 transition hover:bg-zinc-900 hover:text-zinc-100"
                >
                  {label}
                </a>
              ))}
            </nav>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
            <h2 className="mb-3 text-sm font-semibold text-zinc-100">Для PDF</h2>
            <p className="text-sm leading-6 text-zinc-400">
              Открой печать браузера и выбери сохранение в PDF. В режиме печати скрываются панели приложения, остаются только листы A4.
            </p>
          </div>

          <div className="mt-4 rounded-lg border border-zinc-800 bg-zinc-950/70 p-4">
            <h2 className="mb-3 text-sm font-semibold text-zinc-100">Экспорт</h2>
            <Button asChild variant="outline" size="sm" className="w-full justify-start">
              <a href="/api/diploma/docx">
                <Download className="h-4 w-4" />
                Скачать DOCX
              </a>
            </Button>
          </div>
        </aside>

        <div className="min-w-0">
          <section className="print-hidden mb-6 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
            <div className="border-b border-zinc-800 px-5 py-4 sm:px-7">
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="purple">A4 preview</Badge>
                <Badge variant="default">{visibleMainPages} страниц основного текста</Badge>
                <Badge variant="success">По требованиям ASEM</Badge>
              </div>
              <h1 className="mt-5 max-w-4xl text-3xl font-extrabold leading-tight tracking-tight text-zinc-100 md:text-5xl">
                Разработка интеллектуального генеративного конструктора веб-сайтов на основе больших языковых моделей
              </h1>
              <p className="mt-4 max-w-3xl text-base leading-7 text-zinc-400">
                Ниже расположен печатный предпросмотр дипломной работы: отдельные листы A4, Times New Roman 12 pt, интервал 1.5, поля согласно методичке и нумерация страниц снизу по центру.
              </p>
            </div>
          </section>

          <div className="thesis-pages">
            {documentPages.map((page, index) => {
              const visiblePageNumber = index >= frontMatterPages.length ? index - frontMatterPages.length + 1 : null;

              return (
                <section
                  key={`${page.navTitle}-${index}`}
                  id={`page-${index + 1}`}
                  className="thesis-page"
                  aria-label={`Страница ${index + 1}: ${page.navTitle}`}
                >
                  {page.type === "title" ? (
                    <TitlePage />
                  ) : (
                    <>
                      {page.blocks.map((block, blockIndex) => renderBlock(block, blockIndex))}
                    </>
                  )}
                  {visiblePageNumber && <div className="thesis-page-number">{visiblePageNumber}</div>}
                </section>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
