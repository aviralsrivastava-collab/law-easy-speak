import { Users, Gavel, Briefcase, Home, ShoppingBag, Shield, Landmark, HeartHandshake, type LucideIcon } from "lucide-react";

export type CategorySlug =
  | "family"
  | "criminal"
  | "labour"
  | "property"
  | "consumer"
  | "cyber"
  | "government"
  | "women";

export interface CategoryDef {
  slug: CategorySlug;
  name: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  /** Tailwind classes — semantic tokens only */
  badge: string;
  bg: string;
  border: string;
  text: string;
  ring: string;
  /** Sample article seed titles for the category page */
  articles: { title: string; excerpt: string; readTime: string }[];
}

export const CATEGORIES: Record<CategorySlug, CategoryDef> = {
  family: {
    slug: "family",
    name: "Family Law",
    tagline: "Marriage, divorce, custody & maintenance",
    description: "Hindu Marriage Act, Special Marriage Act, divorce procedure, child custody, alimony and maintenance.",
    icon: HeartHandshake,
    badge: "bg-cat-family/15 text-cat-family border-cat-family/30",
    bg: "bg-cat-family/10",
    border: "border-cat-family/30",
    text: "text-cat-family",
    ring: "ring-cat-family/40",
    articles: [
      { title: "How to File for Divorce in India: A Step-by-Step Guide", excerpt: "Mutual consent vs contested divorce, required documents, court fees and timelines.", readTime: "7 min" },
      { title: "Child Custody Laws Explained for Parents", excerpt: "Who decides custody, how courts evaluate the child's welfare, visitation rights.", readTime: "6 min" },
      { title: "Maintenance & Alimony: What You're Entitled To", excerpt: "Section 125 CrPC, interim maintenance and how amounts are calculated.", readTime: "5 min" },
      { title: "Domestic Violence Act: Protection Orders & Remedies", excerpt: "How to obtain protection, residence and monetary relief under PWDVA 2005.", readTime: "6 min" },
    ],
  },
  criminal: {
    slug: "criminal",
    name: "Criminal Law",
    tagline: "FIR, arrest rights & bail",
    description: "BNS (formerly IPC), CrPC, your rights during arrest, bail procedure and FIR filing.",
    icon: Gavel,
    badge: "bg-cat-criminal/15 text-cat-criminal border-cat-criminal/30",
    bg: "bg-cat-criminal/10",
    border: "border-cat-criminal/30",
    text: "text-cat-criminal",
    ring: "ring-cat-criminal/40",
    articles: [
      { title: "What to Do If You're Wrongfully Arrested", excerpt: "Your D.K. Basu rights, how to assert them and contact legal aid immediately.", readTime: "4 min" },
      { title: "How to File an FIR (and What to Do If Police Refuse)", excerpt: "Section 173 BNSS process, zero FIR, and remedies if your complaint isn't registered.", readTime: "5 min" },
      { title: "Anticipatory Bail: When and How to Apply", excerpt: "Section 482 BNSS / Section 438 CrPC bail before arrest, eligibility and procedure.", readTime: "6 min" },
      { title: "Cyber Crime Reporting: Step-by-Step", excerpt: "Use cybercrime.gov.in, helpline 1930, and recover frozen funds.", readTime: "4 min" },
    ],
  },
  labour: {
    slug: "labour",
    name: "Labour & Employment",
    tagline: "Wages, harassment & wrongful termination",
    description: "Industrial Disputes Act, POSH Act, gratuity, PF, minimum wages and wrongful termination.",
    icon: Briefcase,
    badge: "bg-cat-labour/15 text-cat-labour border-cat-labour/30",
    bg: "bg-cat-labour/10",
    border: "border-cat-labour/30",
    text: "text-cat-labour",
    ring: "ring-cat-labour/40",
    articles: [
      { title: "Wrongful Termination: Your Legal Remedies", excerpt: "Notice pay, retrenchment compensation and labour court procedure.", readTime: "5 min" },
      { title: "Filing a POSH Complaint at Work", excerpt: "Internal Committee process, timelines and confidentiality protections.", readTime: "5 min" },
      { title: "Gratuity, PF & ESI: What Every Employee Should Claim", excerpt: "Eligibility rules, calculation formulas and how to recover unpaid dues.", readTime: "6 min" },
      { title: "MGNREGA: Demanding Your 100 Days of Work", excerpt: "How to apply for a job card, claim work and unemployment allowance.", readTime: "5 min" },
    ],
  },
  property: {
    slug: "property",
    name: "Property Law",
    tagline: "Tenancy, succession & registration",
    description: "Transfer of Property Act, Rent Control, succession, mutation and property disputes.",
    icon: Home,
    badge: "bg-cat-property/15 text-cat-property border-cat-property/30",
    bg: "bg-cat-property/10",
    border: "border-cat-property/30",
    text: "text-cat-property",
    ring: "ring-cat-property/40",
    articles: [
      { title: "Tenant vs Landlord: Rights You Didn't Know You Had", excerpt: "Security deposit limits, eviction notice and rent control laws.", readTime: "6 min" },
      { title: "How to Register a Will (and Why You Should)", excerpt: "Indian Succession Act process, witnesses and probate.", readTime: "5 min" },
      { title: "Property Mutation: Updating Records After Inheritance", excerpt: "Documents required, fees and timelines across states.", readTime: "5 min" },
      { title: "Resolving Boundary & Encroachment Disputes", excerpt: "Survey records, civil suit procedure and interim injunctions.", readTime: "6 min" },
    ],
  },
  consumer: {
    slug: "consumer",
    name: "Consumer Rights",
    tagline: "Refunds, defective products & service deficiency",
    description: "Consumer Protection Act 2019, e-filing complaints and compensation claims.",
    icon: ShoppingBag,
    badge: "bg-cat-consumer/15 text-cat-consumer border-cat-consumer/30",
    bg: "bg-cat-consumer/10",
    border: "border-cat-consumer/30",
    text: "text-cat-consumer",
    ring: "ring-cat-consumer/40",
    articles: [
      { title: "How to File a Consumer Complaint Online (E-Daakhil)", excerpt: "Step-by-step e-filing on edaakhil.nic.in with fees and document checklist.", readTime: "5 min" },
      { title: "Defective Product? Your Right to Refund or Replacement", excerpt: "Section 2(34) CPA defects and remedies against sellers and manufacturers.", readTime: "4 min" },
      { title: "Service Deficiency Claims: Banks, Telecom, Hospitals", excerpt: "What counts as deficiency and how compensation is calculated.", readTime: "5 min" },
      { title: "Misleading Ads & Unfair Trade Practices", excerpt: "CCPA powers, penalties and how to report celebrity endorsers.", readTime: "5 min" },
    ],
  },
  cyber: {
    slug: "cyber",
    name: "Cyber & Digital",
    tagline: "Online fraud, privacy & social media",
    description: "IT Act 2000, DPDP Act 2023, online harassment and digital fraud recovery.",
    icon: Shield,
    badge: "bg-cat-cyber/15 text-cat-cyber border-cat-cyber/30",
    bg: "bg-cat-cyber/10",
    border: "border-cat-cyber/30",
    text: "text-cat-cyber",
    ring: "ring-cat-cyber/40",
    articles: [],
  },
  government: {
    slug: "government",
    name: "Government & RTI",
    tagline: "RTI, schemes & public services",
    description: "Right to Information Act, social welfare schemes and citizen entitlements.",
    icon: Landmark,
    badge: "bg-cat-government/15 text-cat-government border-cat-government/30",
    bg: "bg-cat-government/10",
    border: "border-cat-government/30",
    text: "text-cat-government",
    ring: "ring-cat-government/40",
    articles: [],
  },
  women: {
    slug: "women",
    name: "Women & Children",
    tagline: "POCSO, Dowry & protection laws",
    description: "Special protections under POCSO, Dowry Prohibition, PWDVA and more.",
    icon: Users,
    badge: "bg-cat-women/15 text-cat-women border-cat-women/30",
    bg: "bg-cat-women/10",
    border: "border-cat-women/30",
    text: "text-cat-women",
    ring: "ring-cat-women/40",
    articles: [],
  },
};

export const PRIMARY_CATEGORIES: CategorySlug[] = [
  "family",
  "criminal",
  "labour",
  "property",
  "consumer",
];

/** Map free-text category strings (e.g. from AI) to a known slug */
export function resolveCategory(input?: string | null): CategoryDef | null {
  if (!input) return null;
  const s = input.toLowerCase();
  if (s.includes("family") || s.includes("marriage") || s.includes("divorce")) return CATEGORIES.family;
  if (s.includes("criminal") || s.includes("ipc") || s.includes("bns") || s.includes("arrest") || s.includes("fir")) return CATEGORIES.criminal;
  if (s.includes("labour") || s.includes("labor") || s.includes("employ") || s.includes("workplace") || s.includes("wage")) return CATEGORIES.labour;
  if (s.includes("property") || s.includes("tenant") || s.includes("landlord") || s.includes("rent") || s.includes("inherit")) return CATEGORIES.property;
  if (s.includes("consumer") || s.includes("refund") || s.includes("defect")) return CATEGORIES.consumer;
  if (s.includes("cyber") || s.includes("digital") || s.includes("online")) return CATEGORIES.cyber;
  if (s.includes("rti") || s.includes("government") || s.includes("scheme")) return CATEGORIES.government;
  if (s.includes("women") || s.includes("child") || s.includes("pocso") || s.includes("dowry")) return CATEGORIES.women;
  return null;
}

export const LEGAL_DISCLAIMER =
  "This is not legal advice. Information on LexiLearn is for educational purposes only. Laws change and outcomes depend on facts. Consult a qualified advocate or your nearest DLSA (helpline 15100) for advice on your specific situation.";
