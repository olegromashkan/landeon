import { NextResponse } from "next/server";
import { generateLandingPage } from "@/lib/ai/generate";
import { prisma } from "@/lib/db";
import { z } from "zod";
import type { AdvancedBrief } from "@/types";

const GenerateSchema = z.object({
  brief: z.object({
    prompt: z.string().optional(),
    businessName: z.string().optional(),
    businessDescription: z.string().optional(),
    targetAudience: z.string().optional(),
    goal: z.string().optional(),
    tone: z.string().optional(),
    visualStyle: z.string().optional(),
    primaryAccent: z.string().optional(),
    language: z.string().optional(),
    requiredSections: z.array(z.string()).optional(),
    ctaText: z.string().optional(),
    contactInfo: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = GenerateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const { brief } = parsed.data;

    if (!brief.prompt && !brief.businessDescription) {
      return NextResponse.json(
        { success: false, error: "Please provide a prompt or business description." },
        { status: 400 }
      );
    }

    const page = await generateLandingPage(brief as AdvancedBrief);

    const projectName =
      brief.businessName ||
      (brief.prompt ? brief.prompt.slice(0, 60) : "Untitled Landing Page");

    const project = await prisma.project.create({
      data: {
        name: projectName,
        prompt: brief.prompt ?? null,
        businessName: brief.businessName ?? null,
        businessDescription: brief.businessDescription ?? null,
        targetAudience: brief.targetAudience ?? null,
        goal: brief.goal ?? null,
        tone: brief.tone ?? null,
        visualStyle: brief.visualStyle ?? null,
        primaryAccent: brief.primaryAccent ?? null,
        language: brief.language ?? "English",
        pageJson: page as any,
      },
    });

    await prisma.aIGenerationLog.create({
      data: {
        projectId: project.id,
        actionType: "generate_page",
        inputPayload: brief as any,
        outputPayload: page as any,
      },
    });

    return NextResponse.json({ success: true, data: { project, page } }, { status: 201 });
  } catch (err) {
    console.error("POST /api/ai/generate:", err);
    const message = err instanceof Error ? err.message : "Generation failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
