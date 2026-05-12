import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const CreateProjectSchema = z.object({
  name: z.string().min(1).max(200),
  prompt: z.string().optional(),
  businessName: z.string().optional(),
  businessDescription: z.string().optional(),
  targetAudience: z.string().optional(),
  goal: z.string().optional(),
  tone: z.string().optional(),
  visualStyle: z.string().optional(),
  primaryAccent: z.string().optional(),
  language: z.string().default("English"),
  pageJson: z.record(z.unknown()),
});

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
    return NextResponse.json({ success: true, data: projects });
  } catch (err) {
    console.error("GET /api/projects:", err);
    return NextResponse.json({ success: false, error: "Failed to load projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CreateProjectSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }
    const project = await prisma.project.create({ data: parsed.data as any });
    return NextResponse.json({ success: true, data: project }, { status: 201 });
  } catch (err) {
    console.error("POST /api/projects:", err);
    return NextResponse.json({ success: false, error: "Failed to create project" }, { status: 500 });
  }
}
