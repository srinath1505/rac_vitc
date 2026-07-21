
export const site = {
  name: "Rotaract Club of VIT Chennai",
  shortName: "RAC VIT Chennai",
  tagline: "Service Above Self. Leadership Beyond Limits.",
  subtitle: "Building Leaders, Creating Impact, Transforming Communities.",
  manifesto:
    "A hundred students turning Service Above Self into clean shorelines, donated blood, and leaders who outlast us.",
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

/** Team/Events/Gallery scroll to sections on the single page.
 *  About and Contact are their own routes. Club and Projects stay on the
 *  home scroll but are deliberately left off the nav (visitors reach them
 *  naturally while scrolling; not every section needs a jump link). */
export const nav: NavItem[] = [
  { label: "Team", target: "#team" },
  { label: "Events", target: "#events" },
  { label: "Gallery", target: "#gallery" },
  { label: "FAQs", target: "#faq" },
  { label: "About", target: "/about" },
  { label: "Contact", target: "/contact" },
];

/** Partnership contact (Partner With Us). */
export const partnerContact = {
  name: "Rtr. Surajiv Arul",
  phone: "+91 8072 808 036",
  email: "rotaractclubvitcc@gmail.com",
};
