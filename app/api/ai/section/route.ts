import { NextResponse } from "next/server";
import { applyAISectionAction } from "@/lib/ai/generate";
import { prisma } from "@/lib/db";
import { SectionSchema } from "@/lib/schema/sections";
import { z } from "zod";
import type { AIActionType } from "@/types";

const SectionActionSchema = z.object({
  projectId: z.string().min(1),
  sectionId: z.string().min(1),
  actionType: z.enum([
    "rewrite_section",
    "make_shorter",
    "make_premium",
    "make_formal",
    "regenerate_section",
    "suggest_cta",
  ]),
  section: z.unknown(),
  pageContext: z.object({
    pageTitle: z.string(),
    theme: z.object({
      mode: z.enum(["dark", "light"]),
      accent: z.string(),
      style: z.enum(["modern", "minimal", "bold", "elegant"]),
    }),
    businessDescription: z.string().optional(),
  }),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = SectionActionSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.errors[0]?.message },
        { status: 400 }
      );
    }

    const sectionValidation = SectionSchema.safeParse(parsed.data.section);
    if (!sectionValidation.success) {
      return NextResponse.json(
        { success: false, error: "Invalid section structure" },
        { status: 400 }
      );
    }

    const { projectId, actionType, pageContext } = parsed.data;
    const section = sectionValidation.data;

    const updatedSection = await applyAISectionAction(
      actionType as AIActionType,
      section,
      pageContext
    );

    await prisma.aIGenerationLog.create({
      data: {
        projectId,
        actionType,
        inputPayload: { sectionId: section.id, sectionType: section.type } as any,
        outputPayload: updatedSection as any,
      },
    });

    return NextResponse.json({ success: true, data: updatedSection });
  } catch (err) {
    console.error("POST /api/ai/section:", err);
    const message = err instanceof Error ? err.message : "AI action failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
