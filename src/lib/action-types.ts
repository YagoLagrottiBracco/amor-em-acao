export type ActionBlockType =
  | "hero"
  | "image_text"
  | "text"
  | "gallery"
  | "cards"
  | "stats"
  | "quote"
  | "cta"
  | "contact";

export interface HeroBlockData {
  id: string;
  type: "hero";
  kicker: string;
  title: string;
  subtitle: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface ImageTextBlockData {
  id: string;
  type: "image_text";
  image: string;
  imageAlt: string;
  imagePosition: "left" | "right";
  kicker?: string;
  title: string;
  text: string;
  bullets?: string[];
  buttonText?: string;
  buttonLink?: string;
}

export interface TextBlockData {
  id: string;
  type: "text";
  kicker?: string;
  title?: string;
  content: string;
}

export interface GalleryItemData {
  id: string;
  image: string;
  alt: string;
  title: string;
  subtitle?: string;
}

export interface GalleryBlockData {
  id: string;
  type: "gallery";
  kicker?: string;
  title: string;
  description?: string;
  columns?: 2 | 3 | 4;
  items: GalleryItemData[];
}

export interface CardItemData {
  id: string;
  icon: string; // FontAwesome, ex: "fa-utensils", "fa-hands-holding-child"
  title: string;
  description: string;
}

export interface CardsBlockData {
  id: string;
  type: "cards";
  kicker?: string;
  title?: string;
  columns?: 2 | 3 | 4;
  items: CardItemData[];
}

export interface StatItemData {
  id: string;
  number: string;
  label: string;
  description?: string;
}

export interface StatsBlockData {
  id: string;
  type: "stats";
  kicker?: string;
  title?: string;
  items: StatItemData[];
}

export interface QuoteBlockData {
  id: string;
  type: "quote";
  variant: "note" | "quote";
  quote: string;
  source?: string;
}

export interface CtaBlockData {
  id: string;
  type: "cta";
  kicker?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
}

export interface ContactLinkData {
  id: string;
  label: string;
  url: string;
  style: "primary" | "secondary" | "link";
}

export interface ContactBlockData {
  id: string;
  type: "contact";
  kicker?: string;
  title: string;
  description?: string;
  address?: string;
  instagram?: string;
  links?: ContactLinkData[];
}

export type ActionPageBlock =
  | HeroBlockData
  | ImageTextBlockData
  | TextBlockData
  | GalleryBlockData
  | CardsBlockData
  | StatsBlockData
  | QuoteBlockData
  | CtaBlockData
  | ContactBlockData;

export interface ActionMission {
  id: string;
  slug: string;
  title: string;
  /** Subtítulo curto exibido logo abaixo do título no dropdown "Nossas ações" */
  navSubtitle: string;
  kicker: string;
  description: string;
  coverImage: string;
  coverImageAlt: string;
  status: "published" | "draft";
  /** Define se entra no rodízio do dropdown de ações no cabeçalho */
  featuredInNav: boolean;
  createdAt: string;
  updatedAt: string;
  seoTitle?: string;
  seoDescription?: string;
  blocks: ActionPageBlock[];
}

export interface ActionNavSummary {
  id: string;
  slug: string;
  title: string;
  navSubtitle: string;
  coverImage: string;
  createdAt: string;
}
