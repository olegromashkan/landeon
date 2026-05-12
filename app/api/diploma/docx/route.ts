import { NextResponse } from "next/server";
import { buildDiplomaDocx } from "@/lib/diploma/docx";

export const runtime = "nodejs";

export async function GET() {
  try {
    const buffer = await buildDiplomaDocx();

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": 'attachment; filename="landeon-diploma.docx"',
        "Content-Length": buffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("GET /api/diploma/docx:", err);
    const message = err instanceof Error ? err.message : "DOCX export failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
