import type { LandingPage, Section, PageTheme } from "@/types";

// ─── CSS Generation ───────────────────────────────────────────────────────────

export function generateCSS(theme: PageTheme): string {
  const isDark = theme.mode === "dark";
  const accent = theme.accent;

  return `/* Landeon Export — Generated CSS */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --accent: ${accent};
  --bg: ${isDark ? "#0a0a0f" : "#ffffff"};
  --bg-2: ${isDark ? "#111118" : "#f8f8fc"};
  --bg-3: ${isDark ? "#1a1a25" : "#f0f0f8"};
  --text: ${isDark ? "#f0f0f8" : "#0a0a0f"};
  --text-muted: ${isDark ? "#8888aa" : "#555566"};
  --border: ${isDark ? "#2a2a3a" : "#e0e0ea"};
  --radius: 12px;
  --font: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

body {
  font-family: var(--font);
  background: var(--bg);
  color: var(--text);
  line-height: 1.6;
  font-size: 16px;
}

.container { max-width: 1120px; margin: 0 auto; padding: 0 24px; }
section { padding: 80px 0; }

h1 { font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 800; line-height: 1.1; letter-spacing: -0.02em; }
h2 { font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 700; line-height: 1.2; letter-spacing: -0.01em; }
h3 { font-size: 1.25rem; font-weight: 600; line-height: 1.3; }
p { color: var(--text-muted); }

.badge {
  display: inline-flex; align-items: center;
  background: color-mix(in srgb, var(--accent) 15%, transparent);
  color: var(--accent); border: 1px solid color-mix(in srgb, var(--accent) 30%, transparent);
  padding: 4px 14px; border-radius: 100px; font-size: 0.8rem; font-weight: 500;
  margin-bottom: 20px;
}

.btn {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 12px 28px; border-radius: var(--radius);
  font-size: 0.95rem; font-weight: 600; cursor: pointer;
  text-decoration: none; border: none; transition: all 0.2s;
}
.btn-primary { background: var(--accent); color: #fff; }
.btn-primary:hover { filter: brightness(1.1); }
.btn-ghost {
  background: transparent; color: var(--text);
  border: 1px solid var(--border);
}
.btn-ghost:hover { border-color: var(--accent); color: var(--accent); }

.card {
  background: var(--bg-2); border: 1px solid var(--border);
  border-radius: var(--radius); padding: 28px;
}

/* Hero */
.hero { text-align: center; padding: 120px 0 80px; }
.hero h1 { margin: 16px 0; }
.hero p { font-size: 1.15rem; max-width: 600px; margin: 0 auto 32px; }
.hero-ctas { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

/* Hero split with image */
.hero-split { text-align: left; }
.hero-split .container { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
.hero-split .hero-text { }
.hero-split .hero-img img { width: 100%; border-radius: var(--radius); aspect-ratio: 4/3; object-fit: cover; display: block; }
.hero-img-attribution { font-size: 0.75rem; color: var(--text-muted); margin-top: 8px; }
.hero-img-attribution a { color: var(--text-muted); }

/* About with image */
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: start; }
.about-img img { width: 100%; border-radius: var(--radius); aspect-ratio: 4/3; object-fit: cover; display: block; }

@media (max-width: 768px) {
  .hero-split .container { grid-template-columns: 1fr; }
  .hero-split { text-align: center; }
  .about-grid { grid-template-columns: 1fr; }
}

/* About */
.about { }
.about h2 { margin-bottom: 20px; }
.about p { max-width: 720px; font-size: 1.05rem; line-height: 1.7; }
.stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(140px, 1fr)); gap: 20px; margin-top: 40px; }
.stat { text-align: center; padding: 24px; background: var(--bg-2); border: 1px solid var(--border); border-radius: var(--radius); }
.stat-value { font-size: 2rem; font-weight: 800; color: var(--accent); }
.stat-label { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }

/* Features */
.features h2, .services h2 { text-align: center; }
.features-sub, .services-sub { text-align: center; color: var(--text-muted); margin: 12px auto 40px; max-width: 560px; }
.grid-3 { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.feature-card { }
.feature-icon { width: 44px; height: 44px; background: color-mix(in srgb, var(--accent) 15%, transparent); border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 16px; color: var(--accent); font-size: 1.2rem; }
.feature-card h3 { margin-bottom: 8px; }

/* Steps */
.steps { display: flex; flex-direction: column; gap: 0; margin-top: 40px; }
.step { display: flex; gap: 24px; padding: 28px 0; border-bottom: 1px solid var(--border); }
.step:last-child { border-bottom: none; }
.step-num { width: 48px; height: 48px; border-radius: 50%; background: color-mix(in srgb, var(--accent) 15%, transparent); border: 1px solid var(--accent); color: var(--accent); font-weight: 700; font-size: 1.1rem; display: flex; align-items: center; justify-content: center; flex-shrink: 0; }
.step h3 { margin-bottom: 6px; }

/* Testimonials */
.testimonials h2 { text-align: center; }
.testimonials-sub { text-align: center; color: var(--text-muted); margin: 12px auto 40px; }
.testimonial-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; }
.testimonial-card { }
.testimonial-quote { font-style: italic; color: var(--text); margin-bottom: 16px; line-height: 1.6; }
.testimonial-author { font-weight: 600; font-size: 0.9rem; }
.testimonial-role { font-size: 0.8rem; color: var(--text-muted); }
.stars { color: var(--accent); margin-bottom: 12px; font-size: 0.9rem; }

/* Pricing */
.pricing h2 { text-align: center; }
.pricing-sub { text-align: center; color: var(--text-muted); margin: 12px auto 40px; }
.pricing-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; align-items: start; }
.pricing-card { }
.pricing-card.highlighted { border-color: var(--accent); background: color-mix(in srgb, var(--accent) 5%, var(--bg-2)); }
.plan-name { font-size: 0.85rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted); margin-bottom: 8px; }
.plan-price { font-size: 2.5rem; font-weight: 800; color: var(--text); }
.plan-period { font-size: 0.9rem; color: var(--text-muted); margin-left: 4px; }
.plan-desc { color: var(--text-muted); font-size: 0.9rem; margin: 12px 0 20px; }
.plan-features { list-style: none; margin-bottom: 24px; }
.plan-features li { padding: 8px 0; border-bottom: 1px solid var(--border); font-size: 0.9rem; }
.plan-features li::before { content: "✓"; color: var(--accent); margin-right: 10px; font-weight: 700; }

/* FAQ */
.faq h2 { text-align: center; }
.faq-sub { text-align: center; color: var(--text-muted); margin: 12px auto 40px; }
.faq-list { max-width: 720px; margin: 0 auto; }
.faq-item { border-bottom: 1px solid var(--border); padding: 20px 0; }
.faq-question { font-weight: 600; margin-bottom: 12px; }
.faq-answer { color: var(--text-muted); line-height: 1.7; }

/* Contact */
.contact h2 { text-align: center; }
.contact-sub { text-align: center; color: var(--text-muted); margin: 12px auto 40px; }
.contact-form { max-width: 560px; margin: 0 auto; display: flex; flex-direction: column; gap: 16px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-label { font-size: 0.85rem; font-weight: 500; }
.form-input, .form-textarea {
  background: var(--bg-2); border: 1px solid var(--border); color: var(--text);
  border-radius: 8px; padding: 12px 16px; font-size: 0.95rem; font-family: var(--font);
  width: 100%; transition: border-color 0.2s;
}
.form-input:focus, .form-textarea:focus { outline: none; border-color: var(--accent); }
.form-textarea { resize: vertical; min-height: 120px; }

/* CTA */
.cta { text-align: center; background: color-mix(in srgb, var(--accent) 8%, var(--bg-2)); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
.cta h2 { margin-bottom: 12px; }
.cta p { margin-bottom: 32px; max-width: 500px; margin-left: auto; margin-right: auto; }
.cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }

/* Footer */
footer { padding: 48px 0; border-top: 1px solid var(--border); }
.footer-inner { display: flex; flex-wrap: wrap; gap: 32px; align-items: center; justify-content: space-between; }
.footer-brand h3 { font-size: 1.1rem; font-weight: 700; }
.footer-brand p { font-size: 0.85rem; color: var(--text-muted); margin-top: 4px; }
.footer-links { display: flex; gap: 24px; flex-wrap: wrap; }
.footer-links a { font-size: 0.85rem; color: var(--text-muted); text-decoration: none; }
.footer-links a:hover { color: var(--accent); }
.footer-copy { font-size: 0.8rem; color: var(--text-muted); width: 100%; }

@media (max-width: 640px) {
  section { padding: 60px 0; }
  .hero { padding: 80px 0 60px; }
  .hero-ctas { flex-direction: column; align-items: center; }
  .grid-3 { grid-template-columns: 1fr; }
  .pricing-grid { grid-template-columns: 1fr; }
}`;
}

// ─── Section HTML Renderers ────────────────────────────────────────────────────

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function stars(rating?: number): string {
  if (!rating) return "";
  return `<div class="stars">${"★".repeat(rating)}${"☆".repeat(5 - rating)}</div>`;
}

function renderSection(section: Section): string {
  switch (section.type) {
    case "hero": {
      const { headline, subheadline, description, ctaText, ctaSecondaryText, badge, imageUrl, imageAlt, imageAttribution, imagePhotographerUrl } = section.props;

      if (section.variant === "split" && imageUrl) {
        const photographerHref = imagePhotographerUrl ?? `https://unsplash.com?utm_source=landeon&utm_medium=referral`;
        const photographerName = imageAttribution?.replace(/^Photo by (.+) on Unsplash$/, "$1") ?? "";
        return `<section class="hero hero-split">
  <div class="container">
    <div class="hero-text">
      ${badge ? `<span class="badge">${esc(badge)}</span>` : ""}
      <h1>${esc(headline)}</h1>
      ${subheadline ? `<p style="font-size:1.25rem;font-weight:600;color:var(--text);margin:8px 0 16px;">${esc(subheadline)}</p>` : ""}
      <p>${esc(description)}</p>
      <div class="hero-ctas" style="margin-top:32px;justify-content:flex-start;">
        <a href="#contact" class="btn btn-primary">${esc(ctaText)}</a>
        ${ctaSecondaryText ? `<a href="#about" class="btn btn-ghost">${esc(ctaSecondaryText)}</a>` : ""}
      </div>
    </div>
    <div class="hero-img">
      <img src="${esc(imageUrl)}" alt="${esc(imageAlt ?? "")}" loading="lazy">
      ${imageAttribution ? `<p class="hero-img-attribution">Photo by <a href="${esc(photographerHref)}" target="_blank" rel="noreferrer">${esc(photographerName)}</a> on <a href="https://unsplash.com?utm_source=landeon&utm_medium=referral" target="_blank" rel="noreferrer">Unsplash</a></p>` : ""}
    </div>
  </div>
</section>`;
      }

      return `<section class="hero">
  <div class="container">
    ${badge ? `<span class="badge">${esc(badge)}</span>` : ""}
    <h1>${esc(headline)}</h1>
    ${subheadline ? `<p style="font-size:1.25rem;font-weight:600;color:var(--text);margin:8px auto 16px;max-width:600px;">${esc(subheadline)}</p>` : ""}
    <p>${esc(description)}</p>
    <div class="hero-ctas">
      <a href="#contact" class="btn btn-primary">${esc(ctaText)}</a>
      ${ctaSecondaryText ? `<a href="#about" class="btn btn-ghost">${esc(ctaSecondaryText)}</a>` : ""}
    </div>
    ${imageUrl ? `<img src="${esc(imageUrl)}" alt="${esc(imageAlt ?? "")}" loading="lazy" style="margin-top:48px;width:100%;max-width:800px;border-radius:var(--radius);aspect-ratio:16/9;object-fit:cover;">` : ""}
  </div>
</section>`;
    }

    case "about": {
      const { headline, description, stats, highlights, imageUrl, imageAlt, imageAttribution, imagePhotographerUrl } = section.props;
      const photographerHref = imagePhotographerUrl ?? `https://unsplash.com?utm_source=landeon&utm_medium=referral`;
      const photographerName = imageAttribution?.replace(/^Photo by (.+) on Unsplash$/, "$1") ?? "";

      const textBlock = `
    <h2>${esc(headline)}</h2>
    <p style="margin-top:16px;">${esc(description)}</p>
    ${highlights?.length ? `<ul style="margin-top:24px;list-style:none;display:flex;flex-wrap:wrap;gap:12px;">${highlights.map((h) => `<li style="display:flex;align-items:center;gap:8px;font-size:0.9rem;"><span style="color:var(--accent);font-weight:700;">✓</span>${esc(h)}</li>`).join("")}</ul>` : ""}`;

      const imageBlock = imageUrl ? `
    <div class="about-img">
      <img src="${esc(imageUrl)}" alt="${esc(imageAlt ?? "")}" loading="lazy">
      ${imageAttribution ? `<p class="hero-img-attribution" style="margin-top:8px;">Photo by <a href="${esc(photographerHref)}" target="_blank" rel="noreferrer">${esc(photographerName)}</a> on <a href="https://unsplash.com?utm_source=landeon&utm_medium=referral" target="_blank" rel="noreferrer">Unsplash</a></p>` : ""}
    </div>` : "";

      const statsBlock = stats?.length ? `<div class="stats">${stats.map((s) => `<div class="stat"><div class="stat-value">${esc(s.value)}</div><div class="stat-label">${esc(s.label)}</div></div>`).join("")}</div>` : "";

      return `<section class="about" id="about">
  <div class="container">
    ${imageUrl ? `<div class="about-grid"><div>${textBlock}</div>${imageBlock}</div>` : textBlock}
    ${statsBlock}
  </div>
</section>`;
    }

    case "features": {
      const { headline, subheadline, items } = section.props;
      return `<section class="features">
  <div class="container">
    <h2>${esc(headline)}</h2>
    ${subheadline ? `<p class="features-sub">${esc(subheadline)}</p>` : ""}
    <div class="grid-3">
      ${items.map((item) => `<div class="card feature-card"><div class="feature-icon">◆</div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p></div>`).join("\n      ")}
    </div>
  </div>
</section>`;
    }

    case "services": {
      const { headline, subheadline, items } = section.props;
      return `<section class="services">
  <div class="container">
    <h2>${esc(headline)}</h2>
    ${subheadline ? `<p class="services-sub">${esc(subheadline)}</p>` : ""}
    <div class="grid-3">
      ${items.map((item) => `<div class="card"><div class="feature-icon">◆</div><h3>${esc(item.title)}</h3><p>${esc(item.description)}</p>${item.price ? `<p style="margin-top:12px;font-weight:700;color:var(--accent);">${esc(item.price)}</p>` : ""}</div>`).join("\n      ")}
    </div>
  </div>
</section>`;
    }

    case "how_it_works": {
      const { headline, subheadline, steps } = section.props;
      return `<section>
  <div class="container">
    <h2 style="text-align:center;">${esc(headline)}</h2>
    ${subheadline ? `<p style="text-align:center;color:var(--text-muted);margin:12px auto 40px;max-width:560px;">${esc(subheadline)}</p>` : ""}
    <div class="steps" style="max-width:720px;margin:40px auto 0;">
      ${steps.map((step) => `<div class="step"><div class="step-num">${esc(step.number)}</div><div><h3>${esc(step.title)}</h3><p>${esc(step.description)}</p></div></div>`).join("\n      ")}
    </div>
  </div>
</section>`;
    }

    case "testimonials": {
      const { headline, subheadline, items } = section.props;
      return `<section class="testimonials">
  <div class="container">
    <h2>${esc(headline)}</h2>
    ${subheadline ? `<p class="testimonials-sub">${esc(subheadline)}</p>` : ""}
    <div class="testimonial-grid">
      ${items.map((t) => `<div class="card testimonial-card">${stars(t.rating)}<p class="testimonial-quote">"${esc(t.quote)}"</p><div class="testimonial-author">${esc(t.author)}</div><div class="testimonial-role">${esc(t.role)}${t.company ? `, ${esc(t.company)}` : ""}</div></div>`).join("\n      ")}
    </div>
  </div>
</section>`;
    }

    case "pricing": {
      const { headline, subheadline, plans } = section.props;
      return `<section class="pricing">
  <div class="container">
    <h2>${esc(headline)}</h2>
    ${subheadline ? `<p class="pricing-sub">${esc(subheadline)}</p>` : ""}
    <div class="pricing-grid">
      ${plans.map((plan) => `<div class="card pricing-card${plan.highlighted ? " highlighted" : ""}"><div class="plan-name">${esc(plan.name)}</div><div><span class="plan-price">${esc(plan.price)}</span><span class="plan-period">${esc(plan.period)}</span></div><p class="plan-desc">${esc(plan.description)}</p><ul class="plan-features">${plan.features.map((f) => `<li>${esc(f)}</li>`).join("")}</ul><a href="#contact" class="btn btn-primary" style="width:100%;justify-content:center;">${esc(plan.ctaText)}</a></div>`).join("\n      ")}
    </div>
  </div>
</section>`;
    }

    case "faq": {
      const { headline, subheadline, items } = section.props;
      return `<section class="faq">
  <div class="container">
    <h2>${esc(headline)}</h2>
    ${subheadline ? `<p class="faq-sub">${esc(subheadline)}</p>` : ""}
    <div class="faq-list">
      ${items.map((item) => `<div class="faq-item"><div class="faq-question">${esc(item.question)}</div><div class="faq-answer">${esc(item.answer)}</div></div>`).join("\n      ")}
    </div>
  </div>
</section>`;
    }

    case "contact_form": {
      const { headline, subheadline, description, ctaText, showName, showEmail, showPhone, showMessage, showCompany } = section.props;
      const fields = [
        showName && `<div class="form-field"><label class="form-label">Name</label><input class="form-input" type="text" placeholder="Your name"></div>`,
        showEmail && `<div class="form-field"><label class="form-label">Email</label><input class="form-input" type="email" placeholder="your@email.com"></div>`,
        showPhone && `<div class="form-field"><label class="form-label">Phone</label><input class="form-input" type="tel" placeholder="+1 (555) 000-0000"></div>`,
        showCompany && `<div class="form-field"><label class="form-label">Company</label><input class="form-input" type="text" placeholder="Company name"></div>`,
        showMessage && `<div class="form-field"><label class="form-label">Message</label><textarea class="form-textarea" placeholder="How can we help?"></textarea></div>`,
      ].filter(Boolean);
      return `<section class="contact" id="contact">
  <div class="container">
    <h2>${esc(headline)}</h2>
    ${subheadline ? `<p class="contact-sub">${esc(subheadline)}</p>` : ""}
    ${description ? `<p style="text-align:center;color:var(--text-muted);margin-bottom:32px;">${esc(description)}</p>` : ""}
    <form class="contact-form" onsubmit="return false;">
      ${fields.join("\n      ")}
      <button type="submit" class="btn btn-primary" style="align-self:flex-start;">${esc(ctaText)}</button>
    </form>
  </div>
</section>`;
    }

    case "cta": {
      const { headline, subheadline, ctaText, ctaSecondaryText } = section.props;
      return `<section class="cta">
  <div class="container">
    <h2>${esc(headline)}</h2>
    ${subheadline ? `<p>${esc(subheadline)}</p>` : ""}
    <div class="cta-btns">
      <a href="#contact" class="btn btn-primary">${esc(ctaText)}</a>
      ${ctaSecondaryText ? `<a href="#about" class="btn btn-ghost">${esc(ctaSecondaryText)}</a>` : ""}
    </div>
  </div>
</section>`;
    }

    case "footer": {
      const { businessName, tagline, links, copyright, contactEmail, contactPhone } = section.props;
      return `<footer>
  <div class="container">
    <div class="footer-inner">
      <div class="footer-brand">
        <h3>${esc(businessName)}</h3>
        ${tagline ? `<p>${esc(tagline)}</p>` : ""}
        ${contactEmail ? `<p style="margin-top:8px;font-size:0.85rem;color:var(--text-muted);">${esc(contactEmail)}</p>` : ""}
        ${contactPhone ? `<p style="font-size:0.85rem;color:var(--text-muted);">${esc(contactPhone)}</p>` : ""}
      </div>
      ${links?.length ? `<nav class="footer-links">${links.map((l) => `<a href="${esc(l.href)}">${esc(l.label)}</a>`).join("")}</nav>` : ""}
      <p class="footer-copy">${esc(copyright)}</p>
    </div>
  </div>
</footer>`;
    }

    default:
      return "";
  }
}

// ─── Full HTML Document ────────────────────────────────────────────────────────

export function generateHTML(page: LandingPage, css: string): string {
  const sectionHTML = page.sections.map(renderSection).join("\n\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="${esc(page.pageDescription)}">
  <title>${esc(page.pageTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="stylesheet" href="styles.css">
</head>
<body>
${sectionHTML}
</body>
</html>`;
}

export function generateReadme(page: LandingPage): string {
  return `# ${page.pageTitle}

Generated by Landeon — AI Landing Page Builder

## Files
- index.html  — The landing page
- styles.css  — All styles (self-contained)
- site.json   — The page data in JSON format
- README.txt  — This file

## How to use
Open index.html in any browser. No build step required.

## Customizing
Edit index.html and styles.css directly to customize the page.
The accent color can be changed by updating the --accent variable in styles.css.

---
Page: ${page.pageTitle}
Description: ${page.pageDescription}
Theme: ${page.theme.mode} / ${page.theme.style}
Sections: ${page.sections.map((s) => s.type).join(", ")}
`;
}
