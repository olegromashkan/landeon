import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { buildExportZip } from "@/lib/export/zipBuilder";
import { LandingPageSchema } from "@/lib/schema/landingPage";
import type { LandingPage } from "@/types";

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }

    const pageValidation = LandingPageSchema.safeParse(project.pageJson);
    if (!pageValidation.success) {
      return NextResponse.json(
        { success: false, error: "Project page data is invalid" },
        { status: 422 }
      );
    }

    const page = pageValidation.data as LandingPage;
    const zipBuffer = await buildExportZip(page);

    await prisma.exportRecord.create({
      data: {
        projectId: project.id,
        exportType: "zip",
        metadata: { pageTitle: page.pageTitle, sectionCount: page.sections.length } as any,
      },
    });

    const fileName = `${project.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-landeon.zip`;

    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Content-Length": zipBuffer.length.toString(),
      },
    });
  } catch (err) {
    console.error("GET /api/export/[id]:", err);
    const message = err instanceof Error ? err.message : "Export failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
