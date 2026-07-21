/** Shared content types for the whole site's data layer. */

export interface NavLink {
  label: string;
  href: string;
}

export interface Stat {
  icon: string; // emoji
  value: number;
  suffix: string;
  label: string;
}

export interface FocusArea {
  icon: string;
  title: string;
  body: string;
}

export interface FourWayItem {
  n: string;
  keyword: string;
  question: string;
}

export interface Avenue {
  icon: string;
  title: string;
  body: string;
  focusAreas: string[];
  /** Longer write-up shown in the click-to-open detail modal. */
  detail: string[];
  /** Concrete "what we do" bullets for the detail modal. */
  whatWeDo: string[];
}

export interface Award {
  title: string;
  recipient?: string;
}

/** One tree-ring in the Growth Ring timeline (§5.6) — merges president + awards. */
export interface YearRing {
  year: string; // "2019–20"
  start: number; // 2019 (ordering)
  president: string;
  presidentImg: string;
  charter?: boolean;
  awards: Award[];
}

export interface Member {
  name: string;
  role: string;
  year?: string;
  img: string;
  confirmed: boolean;
}

export interface Project {
  slug: string;
  name: string;
  tagline: string;
  paragraphs: string[];
  images: string[];
  stats?: { value: number; suffix: string; label: string }[];
}

export interface FaqItem {
  q: string;
  a: string;
  bullets?: string[];
}

export interface ClubEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string;
  location: string;
  description: string;
  images: string[]; // carousel slots
  type: "past" | "upcoming";
}

export type GalleryType = "photo" | "video" | "album" | "award";

export interface GalleryItem {
  id: string;
  type: GalleryType;
  caption: string;
  year: string;
  tag: string;
  src: string; // image/poster path
  album?: string[]; // for type: 'album'
}
