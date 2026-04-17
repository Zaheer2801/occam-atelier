export interface MockJob {
  id: string;
  title: string;
  company: string;
  location: string;
  source: "LinkedIn" | "Indeed" | "Wellfound" | "Glassdoor" | "Company site";
  postedDaysAgo: number;
  url: string;
  remote: boolean;
  salary?: string;
  snippet: string;
}

const COMPANIES = [
  "Stripe", "Shopify", "Datadog", "Snowflake", "Atlassian", "Notion", "Linear",
  "Figma", "Airbnb", "Cloudflare", "Asana", "Zendesk", "Twilio", "MongoDB",
  "Elastic", "GitLab", "HashiCorp", "Rippling", "Brex", "Ramp",
];

const LOCATIONS = [
  "Remote — US", "San Francisco, CA", "New York, NY", "Austin, TX",
  "Remote — EU", "Berlin, DE", "London, UK", "Toronto, ON", "Dublin, IE",
];

const SOURCES: MockJob["source"][] = ["LinkedIn", "Indeed", "Wellfound", "Glassdoor", "Company site"];

const ROLE_TEMPLATES: Record<string, string[]> = {
  default: [
    "{role}",
    "Senior {role}",
    "Staff {role}",
    "Lead {role}",
    "{role} (Remote)",
    "{role} II",
  ],
};

const SNIPPETS = [
  "Join a fast-growing team building the next generation of products. Work with modern tooling and ship at high velocity.",
  "We're hiring driven professionals to own end-to-end delivery and partner closely with cross-functional teams.",
  "Help us scale to millions of users. You'll work on greenfield problems with a tight, talented team.",
  "Looking for an experienced contributor who thrives in ambiguity and loves shipping polished work.",
  "Be part of a remote-first company with strong engineering culture and a clear product vision.",
  "Drive measurable business impact while collaborating with experienced leadership and a supportive peer group.",
];

// Deterministic pseudo-random based on a seed string so listings are stable per role.
const hash = (s: string) => {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const pick = <T,>(arr: T[], seed: number) => arr[seed % arr.length];

export function getJobsForRole(role: string, count = 18): MockJob[] {
  const cleanRole = (role || "Specialist").trim();
  const templates = ROLE_TEMPLATES.default;

  return Array.from({ length: count }, (_, i) => {
    const seed = hash(`${cleanRole}-${i}`);
    const company = pick(COMPANIES, seed);
    const location = pick(LOCATIONS, seed >> 3);
    const source = pick(SOURCES, seed >> 5);
    const titleTpl = pick(templates, seed >> 7);
    const title = titleTpl.replace("{role}", cleanRole);
    const remote = location.toLowerCase().includes("remote");
    const salary =
      seed % 3 === 0
        ? `$${110 + (seed % 80)}k – $${160 + (seed % 80)}k`
        : undefined;
    const postedDaysAgo = (seed % 21);

    return {
      id: `${cleanRole}-${i}-${seed.toString(36)}`,
      title,
      company,
      location,
      source,
      postedDaysAgo,
      url: `https://example.com/jobs/${seed.toString(36)}`,
      remote,
      salary,
      snippet: pick(SNIPPETS, seed >> 9),
    };
  });
}
