import type { Metadata } from "next";

export const SITE_CONFIG = {
  name: "Amor em Ação",
  legalName: "Associação Humanitária Amor em Ação",
  cnpj: "21.960.082/0001-96",
  title: "Amor em Ação | Projetos Comunitários, Casa Amarela e Voluntariado",
  description:
    "Associação Humanitária Amor em Ação — informações públicas, ações sociais na Casa Amarela em Jardim Gramacho (Duque de Caxias/RJ), Nordeste, voluntariado, transparência e blog oficial.",
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
    addressCountry: "BR",
  },
  developer: {
    name: "Yago Lagrotti Bracco",
    url: "https://lagrotti.dev",
  },
  defaultOgImage: "/images/casa-amarela-equipe-criancas.jpg",
  keywords: [
    "Amor em Ação",
    "Associação Humanitária Amor em Ação",
    "Casa Amarela Jardim Gramacho",
    "ONG Duque de Caxias",
    "projetos sociais Jardim Gramacho",
    "voluntariado Rio de Janeiro",
    "doação ONG infantil",
    "acolhimento comunitário crianças",
    "ações sociais Nordeste Matões do Norte",
    "transparência terceiro setor",
    "CNPJ 21.960.082/0001-96",
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
    alternateName: SITE_CONFIG.name,
    url: SITE_CONFIG.url,
    logo: `${SITE_CONFIG.url}/images/logo-amor-em-acao.webp`,
    image: `${SITE_CONFIG.url}${SITE_CONFIG.defaultOgImage}`,
    description: SITE_CONFIG.description,
    taxID: SITE_CONFIG.cnpj,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.streetAddress,
      addressLocality: SITE_CONFIG.address.addressLocality,
      addressRegion: SITE_CONFIG.address.addressRegion,
      addressCountry: SITE_CONFIG.address.addressCountry,
    },
    sameAs: [SITE_CONFIG.instagramUrl],
  };
}

export function getWebsiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${SITE_CONFIG.url}/#website`,
    url: SITE_CONFIG.url,
    name: SITE_CONFIG.legalName,
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
