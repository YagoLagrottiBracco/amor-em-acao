import type { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Amor em Ação",
  legalName: "Associação Humanitária Amor em Ação",
  cnpj: "21.960.082/0001-96",
  title:
    "Associação Humanitária Amor em Ação | Casa Amarela, Gramacho, Nordeste e Malawi",
  description:
    "Portal oficial da Associação Humanitária Amor em Ação (CNPJ 21.960.082/0001-96). Acolhimento infantil, alimentação diária, reforço escolar na Casa Amarela (Jardim Gramacho, Duque de Caxias/RJ), ações no sertão do Nordeste e apoio humanitário no Malawi.",
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : "https://amoremacao.org"),
  locale: "pt_BR",
  themeColor: "#f97316",
  instagramUrl: "https://www.instagram.com/ahamoremacao/",
  instagramHandle: "@ahamoremacao",
  address: {
    streetAddress: "Rua Tocantins, nº 30",
    neighborhood: "Jardim Gramacho",
    addressLocality: "Duque de Caxias",
    addressRegion: "RJ",
    postalCode: "25055-000",
    addressCountry: "BR",
  },
  geo: {
    latitude: -22.7562,
    longitude: -43.2842,
  },
  developer: {
    name: "Yago Lagrotti Bracco",
    url: "https://lagrotti.dev",
  },
  defaultOgImage: "/images/casa-amarela-equipe-criancas.jpg",
  keywords: [
    "Associação Humanitária Amor em Ação",
    "Amor em Ação",
    "Casa Amarela Jardim Gramacho",
    "ONG Jardim Gramacho Duque de Caxias",
    "ONG acolhimento infantil Rio de Janeiro",
    "projetos sociais Baixada Fluminense",
    "voluntariado Jardim Gramacho RJ",
    "doação ONG crianças vulnerabilidade",
    "ações sociais sertão Matões do Norte MA",
    "ajuda humanitária poços de água Malawi",
    "transparência e prestação de contas ONG",
    "CNPJ 21.960.082/0001-96",
    "segurança alimentar terceiro setor",
    "educação comunitária reforço escolar",
    "apadrinhamento comunitário",
  ],
};

interface BuildMetadataParams {
  title: string;
  description: string;
  path?: string;
  image?: string;
  imageAlt?: string;
  keywords?: string[];
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image = SITE_CONFIG.defaultOgImage,
  imageAlt = "Associação Humanitária Amor em Ação — Casa Amarela",
  keywords = [],
  type = "website",
  publishedTime,
  modifiedTime,
  authors,
  noIndex = false,
}: BuildMetadataParams): Metadata {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  const canonicalUrl = `${SITE_CONFIG.url}${cleanPath === "/" ? "" : cleanPath}`;
  const fullImageUrl = image.startsWith("http")
    ? image
    : `${SITE_CONFIG.url}${image}`;

  const mergedKeywords = Array.from(
    new Set([...keywords, ...SITE_CONFIG.keywords])
  );

  return {
    title,
    description,
    keywords: mergedKeywords,
    authors: [
      { name: SITE_CONFIG.legalName, url: SITE_CONFIG.url },
      { name: SITE_CONFIG.developer.name, url: SITE_CONFIG.developer.url },
    ],
    creator: SITE_CONFIG.developer.name,
    publisher: SITE_CONFIG.legalName,
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
        { url: "/favicon-192x192.png", sizes: "192x192", type: "image/png" },
        { url: "/favicon.jpg", sizes: "512x512", type: "image/jpeg" },
      ],
      shortcut: ["/favicon.ico"],
      apple: [
        { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      ],
    },
    alternates: {
      canonical: canonicalUrl,
      languages: {
        "pt-BR": canonicalUrl,
      },
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            "max-video-preview": -1,
            "max-image-preview": "large",
            "max-snippet": -1,
          },
        },
    openGraph: {
      type,
      locale: SITE_CONFIG.locale,
      url: canonicalUrl,
      siteName: SITE_CONFIG.legalName,
      title,
      description,
      images: [
        {
          url: fullImageUrl,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
      ...(type === "article"
        ? {
            publishedTime,
            modifiedTime,
            authors: authors || [SITE_CONFIG.legalName],
          }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [fullImageUrl],
    },
  };
}

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "NGO",
    "@id": `${SITE_CONFIG.url}/#organization`,
    name: SITE_CONFIG.legalName,
    alternateName: [
      SITE_CONFIG.name,
      "Casa Amarela Jardim Gramacho",
      "Associação Amor em Ação",
      "Amor em Ação ONG",
    ],
    legalName: SITE_CONFIG.legalName,
    url: SITE_CONFIG.url,
    logo: {
      "@type": "ImageObject",
      url: `${SITE_CONFIG.url}/images/logo-amor-em-acao.webp`,
      caption: SITE_CONFIG.legalName,
    },
    image: `${SITE_CONFIG.url}${SITE_CONFIG.defaultOgImage}`,
    description: SITE_CONFIG.description,
    taxID: SITE_CONFIG.cnpj,
    foundingLocation: {
      "@type": "Place",
      name: "Jardim Gramacho, Duque de Caxias, Rio de Janeiro, Brasil",
    },
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      postalCode: SITE_CONFIG.address.postalCode,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.geo.latitude,
      longitude: SITE_CONFIG.geo.longitude,
    },
    areaServed: [
      {
        "@type": "AdministrativeArea",
        name: "Jardim Gramacho, Duque de Caxias - RJ",
      },
      {
        "@type": "AdministrativeArea",
        name: "Matões do Norte - MA",
      },
      {
        "@type": "Country",
        name: "Malawi",
      },
      {
        "@type": "Country",
        name: "Brasil",
      },
    ],
    knowsAbout: [
      "Acolhimento Comunitário Infantil",
      "Educação e Reforço Escolar",
      "Segurança Alimentar e Combate à Fome",
      "Acesso a Água Potável e Perfuração de Poços",
      "Voluntariado e Assistência Humanitária",
      "Transparência no Terceiro Setor",
      "Jardim Gramacho e Baixada Fluminense",
    ],
    sameAs: [SITE_CONFIG.instagramUrl],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Atendimento Geral e Voluntariado",
        email: "contato@amoremacao.org",
        url: `${SITE_CONFIG.url}/contato`,
        availableLanguage: ["pt-BR", "Portuguese"],
      },
    ],
    potentialAction: {
      "@type": "DonateAction",
      name: "Doar para Associação Humanitária Amor em Ação",
      target: `${SITE_CONFIG.url}/#doar`,
      recipient: {
        "@id": `${SITE_CONFIG.url}/#organization`,
      },
    },
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.legalName,
    alternateName: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    inLanguage: "pt-BR",
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    creator: {
      "@type": "Person",
      name: SITE_CONFIG.developer.name,
      url: SITE_CONFIG.developer.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_CONFIG.url}/blog?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function getBreadcrumbJsonLd(
  items: { name: string; path: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      item: `${SITE_CONFIG.url}${item.path === "/" ? "" : item.path}`,
    })),
  };
}

export function getFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
}

export function getItemListJsonLd(
  name: string,
  description: string,
  items: { name: string; path: string; description?: string; image?: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    description,
    itemListElement: items.map((item, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      name: item.name,
      url: `${SITE_CONFIG.url}${item.path.startsWith("/") ? item.path : `/${item.path}`}`,
      ...(item.description ? { description: item.description } : {}),
      ...(item.image
        ? {
            image: item.image.startsWith("http")
              ? item.image
              : `${SITE_CONFIG.url}${item.image}`,
          }
        : {}),
    })),
  };
}

export function getArticleJsonLd(post: {
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string;
  coverImageAlt?: string;
  publishedAt: string;
  updatedAt?: string;
  authorName?: string;
  category?: string;
  tags?: string[];
}) {
  const canonicalUrl = `${SITE_CONFIG.url}/blog/${post.slug}`;
  const fullImageUrl = post.coverImage.startsWith("http")
    ? post.coverImage
    : `${SITE_CONFIG.url}${post.coverImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
    headline: post.title,
    description: post.excerpt,
    image: [fullImageUrl],
    datePublished: post.publishedAt,
    dateModified: post.updatedAt || post.publishedAt,
    inLanguage: "pt-BR",
    author: {
      "@type": "Organization",
      name: post.authorName || SITE_CONFIG.legalName,
      url: SITE_CONFIG.url,
    },
    publisher: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    ...(post.category ? { articleSection: post.category } : {}),
    keywords: [post.category, ...(post.tags || [])].filter(Boolean).join(", "),
  };
}

export function getSocialProjectJsonLd(action: {
  title: string;
  description: string;
  slug: string;
  coverImage?: string;
  locationName?: string;
}) {
  const canonicalUrl = `${SITE_CONFIG.url}/acoes/${action.slug}`;
  const fullImageUrl = action.coverImage
    ? action.coverImage.startsWith("http")
      ? action.coverImage
      : `${SITE_CONFIG.url}${action.coverImage}`
    : `${SITE_CONFIG.url}${SITE_CONFIG.defaultOgImage}`;

  return {
    "@context": "https://schema.org",
    "@type": "Project",
    "@id": `${canonicalUrl}/#project`,
    name: action.title,
    description: action.description,
    url: canonicalUrl,
    image: fullImageUrl,
    inLanguage: "pt-BR",
    organizer: {
      "@id": `${SITE_CONFIG.url}/#organization`,
    },
    location: {
      "@type": "Place",
      name:
        action.locationName ||
        "Casa Amarela, Jardim Gramacho - Duque de Caxias/RJ",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.address.streetAddress,
        addressLocality: SITE_CONFIG.address.addressLocality,
        addressRegion: SITE_CONFIG.address.addressRegion,
        addressCountry: SITE_CONFIG.address.addressCountry,
      },
    },
  };
}
