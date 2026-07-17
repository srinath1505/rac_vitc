import type { ClubEvent } from "./types";

/** Placeholder event set (real dates TBD by client). Each event carries an
 *  images[] array to back the hover-preview carousel (§5.13). */
export const events: ClubEvent[] = [
  {
    id: "installation-2627",
    title: "Club Installation 2026–27",
    date: "2026-09-12",
    time: "10:00 AM – 01:00 PM",
    location: "Ambedkar Auditorium, VIT Chennai",
    description:
      "The official induction ceremony for President Surajiv Arul, Secretary Iniyaa S, and the Board of Directors for RY 2026–27. Sponsored by RC Chennai Spotlight.",
    images: ["/events/installation-1.jpg", "/events/installation-2.jpg", "/events/installation-3.jpg"],
    type: "upcoming",
  },
  {
    id: "kadal-karai-jul",
    title: "Kadal Karai Beach Cleanup",
    date: "2026-07-18",
    time: "06:00 AM – 08:30 AM",
    location: "Besant Nagar Beach, Chennai",
    description:
      "Our signature fortnightly environmental campaign. Join us to restore and protect Chennai's coastline. Refreshments and certificates provided.",
    images: ["/events/kadal-1.jpg", "/events/kadal-2.jpg", "/events/kadal-3.jpg", "/events/kadal-4.jpg"],
    type: "upcoming",
  },
  {
    id: "ryla-2026",
    title: "Rotary Youth Leadership Awards (RYLA)",
    date: "2026-07-25",
    time: "09:00 AM – 05:00 PM",
    location: "District Headquarters, Chennai",
    description:
      "An intensive training program for Rotaractors focusing on public speaking, ethical leadership, group dynamics, and project planning.",
    images: ["/events/ryla-1.jpg", "/events/ryla-2.jpg", "/events/ryla-3.jpg"],
    type: "upcoming",
  },
  {
    id: "blood-camp-jun",
    title: "Mega Blood Donation Camp",
    date: "2026-06-15",
    time: "09:00 AM – 03:00 PM",
    location: "MG Block, VIT Chennai",
    description:
      "A large-scale donation drive in collaboration with Chennai General Hospital. Over 250 units of blood collected from student volunteers.",
    images: ["/events/blood-1.jpg", "/events/blood-2.jpg"],
    type: "past",
  },
  {
    id: "threads-of-magic",
    title: "Threads of Magic: Craft Workshop",
    date: "2026-05-10",
    time: "11:00 AM – 02:00 PM",
    location: "Primary Health Center, Kelambakkam",
    description:
      "A community welfare project teaching skill development, embroidery, and handicrafts to local women to promote sustainable entrepreneurship.",
    images: ["/events/threads-1.jpg", "/events/threads-2.jpg", "/events/threads-3.jpg"],
    type: "past",
  },
];

/** Nearest upcoming Kadal Karai date — lets the Signature Projects section
 *  (§5.9) cross-link to a real entry on the events calendar instead of
 *  floating disconnected from it. */
export const nextKadalKaraiEvent =
  events
    .filter((e) => e.type === "upcoming" && e.title.toLowerCase().includes("kadal karai"))
    .sort((a, b) => a.date.localeCompare(b.date))[0] ?? null;
