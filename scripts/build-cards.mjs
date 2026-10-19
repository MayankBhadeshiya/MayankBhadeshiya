// Generates the SVG cards used in README.md, in the same "Build" style as the
// portfolio (light blueprint grid, Expo ink, React blue, Expo indigo, Node
// green) with official tool logos from Simple Icons.
//
//   npm run cards   →   assets/header.svg, assets/profile.svg, assets/stack.svg
import { writeFileSync } from "node:fs";
import * as si from "simple-icons";

// ---------- Palette (mirrors the portfolio's constants/colors.ts) ----------
const c = {
  paper: "#f7f8fa",
  surface: "#ffffff",
  grid: "rgba(28,32,36,0.06)",
  ink: "#1c2024",
  inkSoft: "#454b52",
  muted: "#6e757c",
  line: "rgba(28,32,36,0.1)",
  mobile: "#4630eb",
  frontend: "#087ea4",
  backend: "#3c873a",
  reactCyan: "#58c4dc",
  editor: "#16181d",
  editorRaised: "#23272f",
  editorText: "#e4e7eb",
  editorMuted: "#8b929b",
  synKeyword: "#c678dd",
  synTag: "#58c4dc",
  synAttr: "#e5c07b",
  synString: "#98c379",
  synFunc: "#61afef",
};

const SANS = "'Geist','Segoe UI',-apple-system,Helvetica,Arial,sans-serif";
const MONO = "'Geist Mono',ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";

const esc = (s) =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const bySlug = Object.fromEntries(
  Object.values(si)
    .filter((v) => v && v.slug)
    .map((i) => [i.slug, i]),
);

// Brand-colored logo at (x, y), size px. Near-white/near-black handled by `fallback`.
function logo(slug, x, y, size, fallback = c.ink) {
  const icon = bySlug[slug];
  if (!icon) {
    // Lettered badge for tools Simple Icons doesn't carry (e.g. AWS).
    const label = slug.toUpperCase().slice(0, 3);
    return `<g transform="translate(${x} ${y})"><rect width="${size}" height="${size}" rx="${size * 0.22}" fill="${c.ink}"/><text x="${size / 2}" y="${size * 0.66}" text-anchor="middle" font-family="${MONO}" font-size="${size * 0.36}" font-weight="700" fill="#fff">${esc(label)}</text></g>`;
  }
  const hex = `#${icon.hex}`;
  const lum = parseInt(icon.hex.slice(0, 2), 16) * 0.2126 + parseInt(icon.hex.slice(2, 4), 16) * 0.7152 + parseInt(icon.hex.slice(4, 6), 16) * 0.0722;
  const fill = lum > 230 ? fallback : hex;
  const s = size / 24;
  return `<path transform="translate(${x} ${y}) scale(${s})" fill="${fill}" d="${icon.path}"/>`;
}

const gridPattern = (id) =>
  `<pattern id="${id}" width="28" height="28" patternUnits="userSpaceOnUse"><path d="M28 0H0V28" fill="none" stroke="${c.grid}" stroke-width="1"/></pattern>`;

// The portfolio's Sketch → Code → Build → Ship stepper, as white cards on a
// gradient track, each lighting up in turn.
function pipeline() {
  const steps = [
    ["figma", "Sketch", "wireframes"],
    ["react", "Code", "React Native"],
    ["expo", "Build", "Expo · Metro"],
    ["vercel", "Ship", "EAS · Vercel"],
  ];
  const x0 = 690;
  const y0 = 92;
  const w = 108;
  const gap = 18;
  const trackW = steps.length * w + (steps.length - 1) * gap;
  return `<defs><linearGradient id="track" x1="0" x2="1">
      <stop offset="0" stop-color="${c.reactCyan}"/><stop offset=".35" stop-color="${c.frontend}"/>
      <stop offset=".7" stop-color="${c.mobile}"/><stop offset="1" stop-color="${c.backend}"/>
    </linearGradient></defs>
    <g transform="translate(${x0} ${y0})">
      <rect y="166" width="${trackW}" height="4" rx="2" fill="${c.line}"/>
      <rect class="fill" y="166" width="${trackW}" height="4" rx="2" fill="url(#track)"/>
      ${steps
        .map(([slug, label, sub], i) => {
          const x = i * (w + gap);
          return `<g transform="translate(${x} 0)"><g class="step" style="animation-delay:${(0.7 + i * 0.35).toFixed(2)}s">
        <rect width="${w}" height="140" rx="14" fill="${c.surface}" stroke="${c.line}"/>
        <rect x="16" y="18" width="40" height="40" rx="10" fill="${c.paper}" stroke="${c.line}"/>
        ${logo(slug, 26, 28, 20)}
        <text x="16" y="94" font-family="${MONO}" font-size="12" fill="${c.muted}">0${i + 1}</text>
        <text x="16" y="114" font-family="${SANS}" font-size="18" font-weight="700" letter-spacing="-.4" fill="${c.ink}">${label}</text>
        <text x="16" y="130" font-family="${SANS}" font-size="11.5" fill="${c.muted}">${esc(sub)}</text>
      </g></g>`;
        })
        .join("")}
    </g>`;
}

// ---------- header.svg ----------
function header() {
  const W = 1200;
  const H = 340;
  const react = bySlug.react;
  const lines = [
    ["I build apps", c.ink],
    ["from sketch", c.frontend],
    ["to shipped.", c.mobile],
  ];
  const stack = ["react", "expo", "nextdotjs", "typescript", "nodedotjs", "firebase"];

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Mayank Bhadeshiya — I build apps from sketch to shipped.">
  <defs>
    ${gridPattern("g")}
    <clipPath id="card"><rect width="${W}" height="${H}" rx="20"/></clipPath>
  </defs>
  <style>
    .rise { opacity: 0; animation: rise .8s cubic-bezier(.16,1,.3,1) forwards; }
    .d1 { animation-delay: .1s } .d2 { animation-delay: .25s } .d3 { animation-delay: .4s }
    .d4 { animation-delay: .6s } .d5 { animation-delay: .8s }
    @keyframes rise { from { opacity: 0; transform: translateY(14px) } to { opacity: 1; transform: none } }
    .spin { transform-origin: 960px 170px; animation: spin 40s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg) } }
    .step { opacity: .35; animation: lit .5s ease forwards; }
    @keyframes lit { to { opacity: 1 } }
    .fill { transform-box: fill-box; transform-origin: left; transform: scaleX(0); animation: grow 1.6s .7s cubic-bezier(.16,1,.3,1) forwards; }
    @keyframes grow { to { transform: scaleX(1) } }
    .caret { animation: blink 1s steps(1) infinite; }
    @keyframes blink { 50% { opacity: 0 } }
    @media (prefers-reduced-motion: reduce) { .rise, .spin, .caret, .step, .fill { animation: none; opacity: 1; transform: none } }
  </style>
  <g clip-path="url(#card)">
    <rect width="${W}" height="${H}" fill="${c.paper}"/>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    <g class="spin" opacity=".9">
      <path transform="translate(760 -30) scale(16.6)" fill="${c.reactCyan}" fill-opacity=".14" d="${react.path}"/>
    </g>

    <g transform="translate(56 44)"><g class="rise d1">
      <rect width="330" height="34" rx="8" fill="${c.editor}"/>
      <text x="14" y="22" font-family="${MONO}" font-size="15">
        <tspan fill="${c.editorMuted}">&lt;</tspan><tspan fill="${c.synTag}">Mayank</tspan><tspan fill="${c.editorText}"> </tspan><tspan fill="${c.synAttr}">role</tspan><tspan fill="${c.editorMuted}">=</tspan><tspan fill="${c.synString}">"Software Engineer"</tspan><tspan fill="${c.editorMuted}"> /&gt;</tspan>
      </text>
      <rect class="caret" x="318" y="9" width="2" height="16" fill="${c.reactCyan}"/>
    </g></g>

    ${lines
      .map(
        ([t, col], i) =>
          `<text class="rise d${i + 2}" x="54" y="${142 + i * 62}" font-family="${SANS}" font-size="62" font-weight="800" letter-spacing="-2.6" fill="${col}">${esc(t)}</text>`,
      )
      .join("\n    ")}

    <g transform="translate(56 296)"><g class="rise d5">
      <text y="4" font-family="${MONO}" font-size="13" fill="${c.muted}">Mobile · Frontend · Backend   —   daily stack</text>
      ${stack.map((s, i) => logo(s, 340 + i * 38, -14, 24)).join("")}
    </g></g>

    ${pipeline()}
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="none" stroke="${c.line}"/>
</svg>
`;
}

// ---------- profile.svg (VS Code-style card) ----------
function profile() {
  const W = 560;
  const lineH = 24;
  // [kind, text] tokens per line, like the portfolio hero's editor.
  const code = [
    [["k", "const "], ["v", "mayank"], ["p", " = {"]],
    [["p", "  "], ["a", "role"], ["p", ": "], ["s", '"Software Engineer"'], ["p", ","]],
    [["p", "  "], ["a", "company"], ["p", ": "], ["s", '"Simform"'], ["p", ","]],
    [["p", "  "], ["a", "since"], ["p", ": "], ["n", "2022"], ["p", ","]],
    [["p", "  "], ["a", "mobile"], ["p", ": ["], ["s", '"React Native"'], ["p", ", "], ["s", '"Expo"'], ["p", "],"]],
    [["p", "  "], ["a", "web"], ["p", ": ["], ["s", '"React"'], ["p", ", "], ["s", '"Next.js"'], ["p", "],"]],
    [["p", "  "], ["a", "backend"], ["p", ": ["], ["s", '"Node.js"'], ["p", ", "], ["s", '"Firebase"'], ["p", ", "], ["s", '"AWS"'], ["p", "],"]],
    [["p", "  "], ["a", "certified"], ["p", ": ["], ["s", '"AWS SAA"'], ["p", ", "], ["s", '"Meta Front-End"'], ["p", "],"]],
    [["p", "  "], ["f", "ship"], ["p", ": () => "], ["s", '"from sketch to shipped"'], ["p", ","]],
    [["p", "};"]],
  ];
  const colorOf = {
    k: c.synKeyword,
    v: c.synFunc,
    a: c.synAttr,
    s: c.synString,
    n: "#d19a66",
    f: c.synFunc,
    p: c.editorText,
  };
  const top = 44;
  const bodyTop = top + 22;
  const H = bodyTop + code.length * lineH + 46;

  const rows = code
    .map((tokens, i) => {
      const y = bodyTop + (i + 1) * lineH - 6;
      const spans = tokens.map(([k, t]) => `<tspan fill="${colorOf[k]}">${esc(t)}</tspan>`).join("");
      // Each line types in after the previous one.
      return `<g class="ln" style="animation-delay:${(0.25 + i * 0.22).toFixed(2)}s">
      <text x="22" y="${y}" font-family="${MONO}" font-size="13" fill="${c.editorMuted}" text-anchor="end" opacity=".6">${i + 1}</text>
      <text x="40" y="${y}" font-family="${MONO}" font-size="14" xml:space="preserve">${spans}</text>
    </g>`;
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="mayank.ts — role, company, stack and certifications as code">
  <defs><clipPath id="r"><rect width="${W}" height="${H}" rx="14"/></clipPath></defs>
  <style>
    .ln { opacity: 0; clip-path: inset(0 100% 0 0); animation: type .5s steps(18) forwards; }
    @keyframes type { from { opacity: 1; clip-path: inset(0 100% 0 0) } to { opacity: 1; clip-path: inset(0 0 0 0) } }
    @media (prefers-reduced-motion: reduce) { .ln { animation: none; opacity: 1; clip-path: none } }
  </style>
  <g clip-path="url(#r)">
    <rect width="${W}" height="${H}" fill="${c.editor}"/>
    <rect width="${W}" height="${top}" fill="${c.editorRaised}"/>
    <circle cx="20" cy="22" r="5.5" fill="#ff5f57"/><circle cx="38" cy="22" r="5.5" fill="#febc2e"/><circle cx="56" cy="22" r="5.5" fill="#28c840"/>
    <rect x="80" y="8" width="132" height="36" fill="${c.editor}"/>
    <rect x="80" y="8" width="132" height="2" fill="${c.reactCyan}"/>
    ${logo("typescript", 92, 19, 13)}
    <text x="112" y="31" font-family="${MONO}" font-size="12.5" fill="${c.editorText}">mayank.ts</text>
    ${rows}
    <rect y="${H - 26}" width="${W}" height="26" fill="${c.frontend}"/>
    <text x="14" y="${H - 9}" font-family="${MONO}" font-size="11.5" fill="#fff">main ✓</text>
    <text x="${W - 14}" y="${H - 9}" font-family="${MONO}" font-size="11.5" fill="#fff" text-anchor="end">TypeScript</text>
  </g>
</svg>
`;
}

// ---------- stack.svg ----------
function stack() {
  const W = 1200;
  const groups = [
    {
      name: "Mobile",
      color: c.mobile,
      tools: [
        ["react", "React Native"],
        ["expo", "Expo · EAS"],
        ["appstore", "App Store"],
        ["googleplay", "Google Play"],
        ["firebase", "Push (FCM)"],
        ["googlemaps", "Google Maps"],
        ["livekit", "LiveKit"],
      ],
    },
    {
      name: "Frontend",
      color: c.frontend,
      tools: [
        ["react", "React"],
        ["nextdotjs", "Next.js"],
        ["typescript", "TypeScript"],
        ["redux", "Redux Toolkit"],
        ["reactquery", "React Query"],
        ["tailwindcss", "Tailwind CSS"],
        ["vercel", "Vercel"],
      ],
    },
    {
      name: "Backend & cloud",
      color: c.backend,
      tools: [
        ["nodedotjs", "Node.js"],
        ["express", "Express"],
        ["postgresql", "PostgreSQL"],
        ["mongodb", "MongoDB"],
        ["prisma", "Prisma"],
        ["aws", "AWS"],
        ["docker", "Docker"],
      ],
    },
    {
      name: "Payments & tooling",
      color: c.ink,
      tools: [
        ["stripe", "Stripe"],
        ["razorpay", "Razorpay"],
        ["paypal", "PayPal"],
        ["jest", "Jest"],
        ["githubactions", "CI/CD"],
        ["claude", "Claude Code"],
        ["githubcopilot", "Copilot"],
      ],
    },
  ];

  const colW = (W - 24 * 2 - 16 * 3) / 4;
  const rowH = 34;
  const headH = 58;
  const cardH = headH + 7 * rowH + 18;
  const H = cardH + 48;

  const cards = groups
    .map((g, gi) => {
      const x = 24 + gi * (colW + 16);
      const y = 24;
      const rows = g.tools
        .map(([slug, label], ti) => {
          const ry = y + headH + ti * rowH;
          return `<g class="row" style="animation-delay:${(0.15 + gi * 0.08 + ti * 0.05).toFixed(2)}s">
        ${logo(slug, x + 22, ry, 18)}
        <text x="${x + 50}" y="${ry + 14}" font-family="${SANS}" font-size="15" fill="${c.ink}">${esc(label)}</text>
      </g>`;
        })
        .join("");
      return `<g>
      <rect x="${x}" y="${y}" width="${colW}" height="${cardH}" rx="14" fill="${c.surface}" stroke="${c.line}"/>
      <rect x="${x - 0.5}" y="${y + 18}" width="4" height="${cardH - 36}" rx="2" fill="${g.color}"/>
      <text x="${x + 22}" y="${y + 36}" font-family="${SANS}" font-size="19" font-weight="700" letter-spacing="-.5" fill="${g.color}">${esc(g.name)}</text>
      ${rows}
    </g>`;
    })
    .join("\n    ");

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img" aria-label="Tech stack: mobile, frontend, backend and tooling">
  <defs>${gridPattern("g")}<clipPath id="r"><rect width="${W}" height="${H}" rx="20"/></clipPath></defs>
  <style>
    .row { opacity: 0; animation: in .6s cubic-bezier(.16,1,.3,1) forwards; }
    @keyframes in { from { opacity: 0; transform: translateX(-8px) } to { opacity: 1; transform: none } }
    @media (prefers-reduced-motion: reduce) { .row { animation: none; opacity: 1 } }
  </style>
  <g clip-path="url(#r)">
    <rect width="${W}" height="${H}" fill="${c.paper}"/>
    <rect width="${W}" height="${H}" fill="url(#g)"/>
    ${cards}
  </g>
  <rect x=".5" y=".5" width="${W - 1}" height="${H - 1}" rx="20" fill="none" stroke="${c.line}"/>
</svg>
`;
}

writeFileSync("assets/header.svg", header());
writeFileSync("assets/profile.svg", profile());
writeFileSync("assets/stack.svg", stack());
console.log("wrote assets/header.svg, assets/profile.svg, assets/stack.svg");
