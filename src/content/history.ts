import type { YearRing } from "./types";

export const clubHistory = {
  paragraphs: [
    "The Rotaract Club of VIT Chennai was chartered in 2019 with the vision of developing young leaders through service, fellowship, and professional growth. Since its inception, the club has been committed to creating meaningful impact through community service, environmental initiatives, leadership development, and collaborative projects.",
    "The club was led by its Charter President, Rtr. Parvathi Suresh (2019–2020), whose leadership laid the foundation for a culture of service and excellence.",
    "Today, the Rotaract Club of VIT Chennai continues to empower students to lead with purpose, serve with compassion, and create lasting change in their communities.",
  ],
};

export const visionMission = {
  vision:
    "To inspire a generation of socially conscious leaders who create sustainable impact through service, innovation, and collaboration.",
  mission:
    "To empower students with opportunities to lead, serve, and grow by fostering meaningful projects, lifelong fellowship, and ethical leadership that transforms communities.",
};

export const achievementsIntro =
  "The Rotaract Club of VIT Chennai has been consistently recognized at the District level for its excellence in leadership, innovation, service, and club administration. These accolades reflect the dedication of our members and the impact of our initiatives.";

/**
 * The Growth Ring timeline (§5.6): one ring per year, charter (2019) at the
 * centre → current year at the rim. Merges Past Presidents + Achievements.
 * Years with no awards are genuine "quiet years", not gaps to fill.
 */
export const clubTimeline: YearRing[] = [
  {
    year: "2019–20",
    start: 2019,
    president: "Rtr. Parvathi Suresh",
    presidentImg: "/presidents/2019-parvathi-suresh.jpg",
    charter: true,
    awards: [],
  },
  {
    year: "2020–21",
    start: 2020,
    president: "Rtr. Lenin M",
    presidentImg: "/presidents/2020-lenin-m.jpg",
    awards: [],
  },
  {
    year: "2021–22",
    start: 2021,
    president: "Rtr. Varun Vignesh R",
    presidentImg: "/presidents/2021-varun-vignesh.jpg",
    awards: [],
  },
  {
    year: "2022–23",
    start: 2022,
    president: "Rtr. Saravanan G",
    presidentImg: "/presidents/2022-saravanan-g.jpg",
    awards: [],
  },
  {
    year: "2023–24",
    start: 2023,
    president: "Rtr. Sruthi Jain",
    presidentImg: "/presidents/2023-sruthi-jain.jpg",
    awards: [
      { title: "Best President", recipient: "Rtr. Sruthi Jain" },
      { title: "Best Social Media Branding" },
      { title: "Outstanding Club" },
      {
        title: "Outstanding Community Service Project",
        recipient: "Project Kadal Karai",
      },
      {
        title: "Outstanding Project by a Rotaract (South Asia)",
        recipient: "Project Kadal Karai",
      },
    ],
  },
  {
    year: "2024–25",
    start: 2024,
    president: "Rtr. Kavin Priyadarrsan M",
    presidentImg: "/presidents/2024-kavin-priyadarrsan.jpg",
    awards: [
      { title: "Best Installation", recipient: "College-Based Club" },
      {
        title: "President's Recognition — “Threads of Magic”",
        recipient: "Rtr. Kavin Priyadarrsan",
      },
      { title: "Star of Rotaract", recipient: "Rtr. Keerthana Kumar" },
      { title: "Star of Rotaract", recipient: "Rtr. Shobini G" },
      { title: "Star of Rotaract", recipient: "Rtr. Shanmughapriyan S.K." },
    ],
  },
  {
    year: "2025–26",
    start: 2025,
    president: "Rtr. Shobini G",
    presidentImg: "/presidents/2025-shobini-g.jpg",
    awards: [
      { title: "Rising President", recipient: "Rtr. Shobini" },
      { title: "Star of Rotaract", recipient: "Rtr. Surajiv Arul" },
      { title: "Star of Rotaract", recipient: "Rtr. Iniyaa S" },
      {
        title: "Excellence in Sustainable Innovation",
        recipient: "Project Kadal Karai",
      },
    ],
  },
  {
    year: "2026–27",
    start: 2026,
    president: "Rtr. Surajiv Arul",
    presidentImg: "/presidents/2026-surajiv-arul.jpg",
    awards: [],
  },
];
