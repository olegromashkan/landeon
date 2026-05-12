import { PrismaClient } from "@prisma/client";
import type { LandingPage } from "../types";

const prisma = new PrismaClient();

const demoPage: LandingPage = {
  pageTitle: "Brew & Co. — Specialty Coffee",
  pageDescription: "Premium single-origin coffee, roasted in small batches in the heart of the city.",
  theme: {
    mode: "dark",
    accent: "#a855f7",
    style: "modern",
  },
  sections: [
    {
      id: "hero-1",
      type: "hero",
      variant: "centered",
      props: {
        badge: "Now Open in Downtown",
        headline: "Coffee That Respects the Bean",
        subheadline: "Single-origin. Small-batch. No compromises.",
        description:
          "We source directly from farmers in Ethiopia, Colombia, and Guatemala. Every cup is a story of craft, care, and connection.",
        ctaText: "Visit Us Today",
        ctaSecondaryText: "Explore the Menu",
      },
    },
    {
      id: "about-1",
      type: "about",
      variant: "default",
      props: {
        headline: "Built on a Passion for Precision",
        description:
          "Brew & Co. started in 2018 with a single espresso machine and an obsession with quality. Today we serve over 400 cups a day without ever cutting corners. Our roastery is open to the public — come see how the magic happens.",
        stats: [
          { value: "6+", label: "Years roasting" },
          { value: "12", label: "Origins sourced" },
          { value: "400+", label: "Daily cups served" },
          { value: "100%", label: "Direct trade" },
        ],
        highlights: [
          "Direct-trade relationships",
          "On-site micro-roastery",
          "Seasonal menu rotations",
          "Barista training courses",
        ],
      },
    },
    {
      id: "features-1",
      type: "features",
      variant: "grid",
      props: {
        headline: "Why Brew & Co. is Different",
        subheadline: "We don't cut corners. Here's what that means in practice.",
        items: [
          {
            icon: "Leaf",
            title: "Direct-Trade Sourcing",
            description: "We visit our farms every harvest season and pay above fair-trade prices.",
          },
          {
            icon: "Flame",
            title: "In-House Roasting",
            description: "All beans are roasted fresh weekly in our Probat drum roaster on-site.",
          },
          {
            icon: "Award",
            title: "Competition-Level Baristas",
            description:
              "Our team has placed in national barista championships three years running.",
          },
          {
            icon: "Calendar",
            title: "Seasonal Rotations",
            description:
              "The menu changes with the harvest cycle so you always taste peak freshness.",
          },
          {
            icon: "Package",
            title: "Whole-Bean Subscription",
            description:
              "Get freshly roasted beans delivered to your door on your schedule.",
          },
          {
            icon: "Users",
            title: "Barista Workshops",
            description:
              "Monthly hands-on classes for enthusiasts and aspiring professionals alike.",
          },
        ],
      },
    },
    {
      id: "how_it_works-1",
      type: "how_it_works",
      variant: "default",
      props: {
        headline: "From Farm to Your Cup",
        subheadline: "A transparent process you can taste at every step.",
        steps: [
          {
            number: "01",
            title: "We Source at Origin",
            description:
              "Our buyers travel to Ethiopia, Colombia, and Guatemala each harvest to select and purchase the finest lots directly from farmers.",
          },
          {
            number: "02",
            title: "We Roast In-House",
            description:
              "Beans arrive green and are roasted in small batches on our Probat P12. Each origin gets a profile developed over months of tasting.",
          },
          {
            number: "03",
            title: "You Taste the Difference",
            description:
              "Every bag leaves our roastery within 48 hours of roasting. Visit the café or order online for home delivery.",
          },
        ],
      },
    },
    {
      id: "testimonials-1",
      type: "testimonials",
      variant: "default",
      props: {
        headline: "What Our Regulars Say",
        items: [
          {
            quote:
              "I've been to coffee shops on four continents. Brew & Co. is in my personal top three. The Ethiopian natural they have right now is extraordinary.",
            author: "Marcus T.",
            role: "Architect",
            rating: 5,
          },
          {
            quote:
              "The subscription changed my mornings completely. Knowing exactly where my coffee comes from — and that it was roasted days ago — makes a real difference.",
            author: "Elena R.",
            role: "Freelance Designer",
            rating: 5,
          },
          {
            quote:
              "Took a barista workshop here and it was worth every penny. The instructors are both passionate and precise. Highly recommend.",
            author: "David K.",
            role: "Engineer",
            rating: 5,
          },
        ],
      },
    },
    {
      id: "cta-1",
      type: "cta",
      variant: "default",
      props: {
        headline: "Ready for a Better Cup?",
        subheadline:
          "Visit us at 42 Roaster Lane, or start a coffee subscription today.",
        ctaText: "Find Us",
        ctaSecondaryText: "Start a Subscription",
      },
    },
    {
      id: "footer-1",
      type: "footer",
      variant: "default",
      props: {
        businessName: "Brew & Co.",
        tagline: "Specialty coffee, roasted with intention.",
        links: [
          { label: "Menu", href: "#" },
          { label: "Subscriptions", href: "#" },
          { label: "Workshops", href: "#" },
          { label: "About", href: "#" },
        ],
        copyright: `© ${new Date().getFullYear()} Brew & Co. All rights reserved.`,
        contactEmail: "hello@brewandco.com",
        contactPhone: "+1 (555) 012-3456",
      },
    },
  ],
};

async function main() {
  console.log("Seeding demo project…");

  // Remove previous demo project if exists
  await prisma.project.deleteMany({ where: { name: "Brew & Co. — Specialty Coffee" } });

  const project = await prisma.project.create({
    data: {
      name: "Brew & Co. — Specialty Coffee",
      prompt: "Landing page for a premium specialty coffee shop",
      businessName: "Brew & Co.",
      businessDescription:
        "Specialty coffee roastery and café focused on single-origin, direct-trade beans.",
      targetAudience: "Coffee enthusiasts, urban professionals aged 25-45",
      goal: "Drive foot traffic and coffee subscriptions",
      tone: "Premium",
      visualStyle: "Modern",
      primaryAccent: "#a855f7",
      language: "English",
      pageJson: demoPage as unknown as Parameters<typeof prisma.project.create>[0]["data"]["pageJson"],
    },
  });

  console.log(`✓ Demo project created: ${project.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
