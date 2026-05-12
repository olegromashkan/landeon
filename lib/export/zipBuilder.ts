import JSZip from "jszip";
import type { LandingPage } from "@/types";
import { generateCSS, generateHTML, generateReadme } from "./htmlGenerator";

export async function buildExportZip(page: LandingPage): Promise<Buffer> {
  const zip = new JSZip();

  const css = generateCSS(page.theme);
  const html = generateHTML(page, css);
  const readme = generateReadme(page);
  const siteJson = JSON.stringify(page, null, 2);

  zip.file("index.html", html);
  zip.file("styles.css", css);
  zip.file("site.json", siteJson);
  zip.file("README.txt", readme);

  const buffer = await zip.generateAsync({
    type: "nodebuffer",
    compression: "DEFLATE",
    compressionOptions: { level: 6 },
  });

  return buffer;
}
