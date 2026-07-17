import type { Member } from "./types";
import { faceUrl } from "@/lib/utils";

const YEAR = "2026–27";

/**
 * 15-person board (§5.7). The top 4 are docx-confirmed; roles 5–15 are
 * placeholder seats (filled, not blank) until real names/photos arrive.
 * Roles 6–9 deliberately mirror the four Avenues of Service.
 */
export const coreTeam: Member[] = [
  { name: "Surajiv Arul", role: "President", year: YEAR, img: "/team/president.jpg", confirmed: true },
  { name: "Iniyaa S", role: "Secretary", year: YEAR, img: "/team/secretary.jpg", confirmed: true },
  { name: "S G Anjana", role: "Vice President", year: YEAR, img: "/team/vice-president.jpg", confirmed: true },
  { name: "N V Tejaharshini", role: "Joint Secretary", year: YEAR, img: "/team/joint-secretary.jpg", confirmed: true },
  { name: "To be announced", role: "Treasurer", year: YEAR, img: "/team/treasurer.jpg", confirmed: false },
  { name: "To be announced", role: "Club Service Director", year: YEAR, img: "/team/club-service.jpg", confirmed: false },
  { name: "To be announced", role: "Community Service Director", year: YEAR, img: "/team/community-service.jpg", confirmed: false },
  { name: "To be announced", role: "Professional Development Director", year: YEAR, img: "/team/professional-dev.jpg", confirmed: false },
  { name: "To be announced", role: "International Service Director", year: YEAR, img: "/team/international-service.jpg", confirmed: false },
  { name: "To be announced", role: "Public Relations Officer", year: YEAR, img: "/team/pro.jpg", confirmed: false },
  { name: "To be announced", role: "Design Head", year: YEAR, img: "/team/design-head.jpg", confirmed: false },
  { name: "To be announced", role: "Editor-in-Chief", year: YEAR, img: "/team/editor.jpg", confirmed: false },
  { name: "To be announced", role: "Photography Head", year: YEAR, img: "/team/photography.jpg", confirmed: false },
  { name: "To be announced", role: "Women Empowerment Head", year: YEAR, img: "/team/women-empowerment.jpg", confirmed: false },
  { name: "To be announced", role: "Webmaster", year: YEAR, img: "/team/webmaster.jpg", confirmed: false },
];

/** Officers only — the tight Home teaser (confirmed faces). */
export const homeTeam = coreTeam.filter((m) => m.confirmed);

/** Avatar set for the MaskedAvatars reveal strip (name shown on hover). */
export const teamAvatars = coreTeam.slice(0, 7).map((m) => ({
  name: m.confirmed ? m.name : m.role,
  avatar: faceUrl(m.role),
}));

/** Past Presidents roster (2019 → 2027), newest first. */
export const pastPresidents: { year: string; name: string; img: string }[] = [
  { year: "2026–27", name: "Surajiv Arul", img: "/presidents/2026-surajiv-arul.jpg" },
  { year: "2025–26", name: "Shobini G", img: "/presidents/2025-shobini-g.jpg" },
  { year: "2024–25", name: "Kavin Priyadarrsan M", img: "/presidents/2024-kavin-priyadarrsan.jpg" },
  { year: "2023–24", name: "Sruthi Jain", img: "/presidents/2023-sruthi-jain.jpg" },
  { year: "2022–23", name: "Saravanan G", img: "/presidents/2022-saravanan-g.jpg" },
  { year: "2021–22", name: "Varun Vignesh R", img: "/presidents/2021-varun-vignesh.jpg" },
  { year: "2020–21", name: "Lenin M", img: "/presidents/2020-lenin-m.jpg" },
  { year: "2019–20", name: "Parvathi Suresh", img: "/presidents/2019-parvathi-suresh.jpg" },
];
