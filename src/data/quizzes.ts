export interface QuizQuestion {
  q: string;
  options: string[];
  correctIndex: number;
}

export interface Quiz {
  slug: "arrest" | "eviction" | "workplace";
  title: string;
  tagline: string;
  questions: QuizQuestion[];
}

export const QUIZZES: Quiz[] = [
  {
    slug: "arrest",
    title: "If You're Being Arrested",
    tagline: "Know your rights under the BNSS & Constitution",
    questions: [
      {
        q: "Within how many hours must police produce you before a magistrate after arrest?",
        options: ["6 hours", "12 hours", "24 hours (excluding travel time)", "72 hours"],
        correctIndex: 2,
      },
      {
        q: "When the police arrest you, what must they show or tell you?",
        options: [
          "Nothing — they can arrest silently",
          "The grounds of arrest, and let you inform a relative or friend",
          "Only their badge number",
          "Just the FIR number",
        ],
        correctIndex: 1,
      },
      {
        q: "Can you refuse to sign a statement the police hand you?",
        options: ["No, refusal is a crime", "Yes — you have a right against self-incrimination (Article 20(3))", "Only with a lawyer present", "Only if you are a minor"],
        correctIndex: 1,
      },
      {
        q: "Which case laid down the famous arrest guidelines (memo, medical exam, inform relative)?",
        options: ["Kesavananda Bharati", "D.K. Basu v. State of West Bengal", "Maneka Gandhi v. Union of India", "Vishaka v. State of Rajasthan"],
        correctIndex: 1,
      },
      {
        q: "Section 41A BNSS / CrPC notice means…",
        options: [
          "You must immediately go to jail",
          "Police are issuing a notice to appear instead of arresting you for offences punishable up to 7 years",
          "You are barred from leaving the country",
          "You must pay a fine",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "eviction",
    title: "If You're Facing Eviction",
    tagline: "Tenant rights under state Rent Control & TPA",
    questions: [
      {
        q: "Can a landlord throw you out without a court order?",
        options: ["Yes, if the rent is overdue", "Yes, with police help", "No — eviction needs a proper legal procedure / court order in most states", "Only on weekends"],
        correctIndex: 2,
      },
      {
        q: "What is the typical minimum notice period to vacate under most state Rent Acts?",
        options: ["24 hours", "1 week", "15 days to 1 month (varies by state and tenancy type)", "1 year"],
        correctIndex: 2,
      },
      {
        q: "How much security deposit can a landlord generally demand under the Model Tenancy Act, 2021 (residential)?",
        options: ["10 months' rent", "6 months' rent", "Maximum 2 months' rent", "Unlimited"],
        correctIndex: 2,
      },
      {
        q: "If the landlord cuts off your water/electricity to force you out, that is…",
        options: [
          "Legal self-help",
          "Illegal — it can amount to criminal intimidation and you can complain to police / Rent Authority",
          "Allowed only in metros",
          "Allowed if rent is unpaid",
        ],
        correctIndex: 1,
      },
      {
        q: "If your rented home is sold, your tenancy…",
        options: [
          "Ends immediately",
          "Continues — the new owner steps into the landlord's shoes (Section 109, Transfer of Property Act)",
          "Doubles in rent automatically",
          "Becomes informal",
        ],
        correctIndex: 1,
      },
    ],
  },
  {
    slug: "workplace",
    title: "Workplace Rights",
    tagline: "POSH, wages and termination",
    questions: [
      {
        q: "Under the POSH Act 2013, every workplace with how many or more employees must have an Internal Committee?",
        options: ["5", "10", "20", "100"],
        correctIndex: 1,
      },
      {
        q: "Within how many days should a POSH complaint normally be filed from the date of incident?",
        options: ["7 days", "30 days", "Within 3 months (extendable by another 3 months)", "1 year"],
        correctIndex: 2,
      },
      {
        q: "If your employer fires you without notice or notice pay, you can…",
        options: [
          "Do nothing",
          "Approach the Labour Commissioner / Industrial Tribunal under the Industrial Disputes Act / Industrial Relations Code",
          "Only post on social media",
          "File an FIR for theft",
        ],
        correctIndex: 1,
      },
      {
        q: "Gratuity under the Payment of Gratuity Act becomes payable after how many years of continuous service?",
        options: ["1 year", "3 years", "5 years (less in case of death/disablement)", "10 years"],
        correctIndex: 2,
      },
      {
        q: "Are you entitled to your full and final settlement (including unpaid wages, leave encashment) on resignation?",
        options: [
          "No, the employer decides",
          "Yes — and the Code on Wages requires payment within 2 working days of last working day for resignations",
          "Only if you signed a bond",
          "Only after 6 months",
        ],
        correctIndex: 1,
      },
    ],
  },
];
