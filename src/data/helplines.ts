export interface Helpline {
  name: string;
  number: string;
  detail: string;
}

export interface StateLegalAid {
  state: string;
  authority: string;
  number: string;
  website?: string;
}

export interface FreeLegalLink {
  name: string;
  url: string;
  description: string;
}

export const NATIONAL_HELPLINES: Helpline[] = [
  { name: "NALSA Free Legal Aid Helpline", number: "15100", detail: "National Legal Services Authority — free legal aid & advice 24x7" },
  { name: "Women Helpline (All India)", number: "181", detail: "Women in distress — emergency support" },
  { name: "Police Emergency", number: "112", detail: "All-India unified emergency response" },
  { name: "Cyber Crime Reporting", number: "1930", detail: "Report online financial fraud — get funds frozen" },
  { name: "Childline", number: "1098", detail: "Children in need of care and protection" },
  { name: "Senior Citizen Helpline", number: "14567", detail: "Elderline — legal & welfare support for seniors" },
  { name: "Domestic Violence Helpline", number: "181 / 1091", detail: "Protection of Women from Domestic Violence Act" },
  { name: "Anti-Ragging Helpline", number: "1800-180-5522", detail: "UGC anti-ragging support for students" },
];

export const STATE_LEGAL_AID: StateLegalAid[] = [
  { state: "Delhi", authority: "Delhi State Legal Services Authority (DSLSA)", number: "1516", website: "https://dslsa.org" },
  { state: "Maharashtra", authority: "Maharashtra SLSA", number: "1800-22-4499", website: "https://mslsa.maharashtra.gov.in" },
  { state: "Karnataka", authority: "Karnataka SLSA", number: "1800-425-9300", website: "https://kslsa.kar.nic.in" },
  { state: "Tamil Nadu", authority: "Tamil Nadu SLSA", number: "1800-419-4445", website: "https://tnslsa.tn.gov.in" },
  { state: "Telangana", authority: "Telangana SLSA", number: "1800-425-3492", website: "https://tslsa.telangana.gov.in" },
  { state: "West Bengal", authority: "West Bengal SLSA", number: "033-2248-7065", website: "https://wbslsa.org" },
  { state: "Uttar Pradesh", authority: "U.P. SLSA", number: "0522-2287184", website: "https://upslsa.up.nic.in" },
  { state: "Gujarat", authority: "Gujarat SLSA", number: "1800-233-7966", website: "https://gslsa.gujarat.gov.in" },
  { state: "Rajasthan", authority: "Rajasthan SLSA", number: "1800-180-6457", website: "https://rlsa.gov.in" },
  { state: "Kerala", authority: "Kerala SLSA", number: "1800-425-1456", website: "https://kelsa.nic.in" },
  { state: "Punjab", authority: "Punjab SLSA", number: "1800-180-2057", website: "https://pulsa.gov.in" },
  { state: "Haryana", authority: "Haryana SLSA", number: "1800-180-2057", website: "https://hslsa.gov.in" },
  { state: "Madhya Pradesh", authority: "M.P. SLSA", number: "1800-2332-330", website: "https://mpslsa.gov.in" },
  { state: "Bihar", authority: "Bihar SLSA", number: "0612-2507108", website: "https://bslsa.bihar.gov.in" },
  { state: "Odisha", authority: "Odisha SLSA", number: "1800-345-6760", website: "https://oslsa.nic.in" },
];

export const FREE_LEGAL_LINKS: FreeLegalLink[] = [
  { name: "NALSA — Apply for Free Legal Aid", url: "https://nalsa.gov.in/lsams/", description: "Online application for legal aid; eligible: women, children, SC/ST, disabled, victims, those earning under prescribed limits." },
  { name: "eCourts Services", url: "https://services.ecourts.gov.in", description: "Track case status, cause lists, judgments and orders across India." },
  { name: "India Code (Original Acts)", url: "https://www.indiacode.nic.in", description: "Official repository of all Central and State Acts in force." },
  { name: "National Cyber Crime Portal", url: "https://cybercrime.gov.in", description: "File cyber-crime complaints online; report fraud and harassment." },
  { name: "e-Daakhil — Consumer Complaints", url: "https://edaakhil.nic.in", description: "File consumer complaints in District/State/National Commissions online." },
  { name: "Tele-Law (Free Pre-Litigation Advice)", url: "https://www.tele-law.in", description: "Free legal advice via Common Service Centres in your village/town." },
  { name: "Nyaya Bandhu (Pro Bono)", url: "https://nyayabandhu.gov.in", description: "Connect with pro bono advocates registered with the Department of Justice." },
  { name: "Supreme Court of India Legal Aid", url: "https://main.sci.gov.in/legal-aid", description: "SCLSC — free representation in Supreme Court for eligible persons." },
];
