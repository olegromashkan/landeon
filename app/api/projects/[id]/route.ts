import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const UpdateProjectSchema = z.object({
  name: z.string().min(1).max(200).optional(),
  pageJson: z.record(z.unknown()).optional(),
});

export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({ where: { id: params.id } });
    if (!project) {
      return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    console.error("GET /api/projects/[id]:", err);
    return NextResponse.json({ success: false, error: "Failed to load project" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const parsed = UpdateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }
    const project = await prisma.project.update({ where: { id: params.id }, data: parsed.data as any });
    return NextResponse.json({ success: true, data: project });
  } catch (err) {
    console.error("PATCH /api/projects/[id]:", err);
    return NextResponse.json({ success: false, error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.project.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("DELETE /api/projects/[id]:", err);
    return NextResponse.json({ success: false, error: "Failed to delete project" }, { status: 500 });
  }
}
