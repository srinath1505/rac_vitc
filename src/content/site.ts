
export const site = {
  name: "Rotaract Club of VIT Chennai",
  shortName: "RAC VIT Chennai",
  tagline: "Service Above Self. Leadership Beyond Limits.",
  subtitle: "Building Leaders, Creating Impact, Transforming Communities.",
  district: "RI District 3234",
  parentClub: "Rotary Club of Chennai Spotlight",
  chartered: 2019,
  registrationForm: "https://forms.gle/vsjSHSti5qAb8yVD7",
  email: "rotaractclubvitcc@gmail.com",
  phones: ["+91 80728 08036", "+91 99624 09445"],
  address: {
    lines: [
      "VIT Chennai Campus",
      "Vandalur–Kelambakkam Road",
      "Chennai – 600127, Tamil Nadu, India",
    ],
    mapsQuery: "VIT+Chennai+Vandalur+Kelambakkam+Road",
  },
} as const;

export const socials = {
  instagram: {
    handle: "@rotaractclubvitcc",
    url: "https://www.instagram.com/rotaractclubvitcc",
  },
  linkedin: {
    handle: "Rotaract Club of VIT Chennai",
    url: "https://www.linkedin.com/company/rotaract-club-vitcc/",
  },
} as const;

export interface NavItem {
  label: string;
  target: string; // "#id" = section on home; "/path" = separate route
}

/** Club/Team/Projects/Events/Gallery scroll to sections on the single page.
 *  About and Contact are their own routes. */
export const nav: NavItem[] = [
  { label: "Club", target: "#club" },
  { label: "Team", target: "#team" },
  { label: "Projects", target: "#projects" },
  { label: "Events", target: "#events" },
  { label: "Gallery", target: "#gallery" },
  { label: "About", target: "/about" },
  { label: "Contact", target: "/contact" },
];

/** Partnership contact (Partner With Us). */
export const partnerContact = {
  name: "Rtr. Surajiv Arul",
  phone: "+91 8072 808 036",
  email: "rotaractclubvitcc@gmail.com",
};
