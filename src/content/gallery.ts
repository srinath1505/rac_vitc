import type { GalleryItem } from "./types";
import { seededRange, sceneUrl } from "@/lib/utils";

/** Raw gallery seed — a mix of the four types for the Yearbook / Polaroid Wall (§5.14). */
const raw: Omit<GalleryItem, "id">[] = [
  { type: "photo", caption: "Sunrise cleanup, Besant Nagar", year: "2025–26", tag: "Kadal Karai", src: "/gallery/kadal-01.jpg" },
  { type: "photo", caption: "100+ volunteers, one shoreline", year: "2025–26", tag: "Kadal Karai", src: "/gallery/kadal-02.jpg" },
  { type: "award", caption: "Excellence in Sustainable Innovation", year: "2025–26", tag: "Awards", src: "/gallery/award-sustainable.jpg" },
  { type: "video", caption: "Kadal Karai — the movement", year: "2025–26", tag: "Kadal Karai", src: "/gallery/video-kadal.jpg" },
  { type: "photo", caption: "Installation night", year: "2025–26", tag: "Installation", src: "/gallery/install-01.jpg" },
  { type: "album", caption: "RYLA District Meet", year: "2024–25", tag: "RYLA", src: "/gallery/ryla-cover.jpg", album: ["/gallery/ryla-01.jpg", "/gallery/ryla-02.jpg", "/gallery/ryla-03.jpg", "/gallery/ryla-04.jpg"] },
  { type: "award", caption: "Best Installation — College-Based Club", year: "2024–25", tag: "Awards", src: "/gallery/award-installation.jpg" },
  { type: "photo", caption: "Threads of Magic workshop", year: "2024–25", tag: "Community", src: "/gallery/threads-01.jpg" },
  { type: "video", caption: "Blood Donation Camp recap", year: "2024–25", tag: "Health", src: "/gallery/video-blood.jpg" },
  { type: "photo", caption: "Fellowship evening", year: "2024–25", tag: "Fellowship", src: "/gallery/fellowship-01.jpg" },
  { type: "album", caption: "Outstanding Club — District Awards", year: "2023–24", tag: "Awards", src: "/gallery/awards-cover.jpg", album: ["/gallery/awards-01.jpg", "/gallery/awards-02.jpg", "/gallery/awards-03.jpg"] },
  { type: "photo", caption: "Tree plantation drive", year: "2023–24", tag: "Environment", src: "/gallery/trees-01.jpg" },
  { type: "award", caption: "Outstanding Project — South Asia", year: "2023–24", tag: "Awards", src: "/gallery/award-southasia.jpg" },
  { type: "photo", caption: "Charter memories", year: "2019–20", tag: "History", src: "/gallery/charter-01.jpg" },
];

export const gallery: GalleryItem[] = raw.map((item, i) => ({
  ...item,
  id: `g-${i}`,
}));

/** Stable per-item tilt for the polaroid wall (deterministic, never re-randomized). */
export const tiltFor = (id: string) => seededRange(id, -6, 6);

export const galleryTags = [
  "All",
  "Photos",
  "Videos",
  "Albums",
  "Awards",
] as const;

/** Sets for the image-scatter preview (heading + scattered photos). */
export const scatterSets = [
  { heading: "Kadal Karai", images: [1, 2, 3, 4, 5].map((n) => sceneUrl(`kadal-${n}`)) },
  { heading: "Community Service", images: [1, 2, 3, 4, 5].map((n) => sceneUrl(`community-${n}`)) },
  { heading: "RYLA & Leadership", images: [1, 2, 3, 4, 5].map((n) => sceneUrl(`ryla-${n}`)) },
  { heading: "Fellowship", images: [1, 2, 3, 4, 5].map((n) => sceneUrl(`fellow-${n}`)) },
];
