import type { MetadataRoute } from "next";
import { SITE_CONFIG } from "@/lib/seo";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_CONFIG.legalName,
    short_name: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    start_url: "/",
    display: "standalone",
    background_color: "#fffaf5",
    theme_color: "#f58220",
    icons: [
      {
        src: "/images/logo-amor-em-acao.webp",
        sizes: "any",
        type: "image/webp",
      },
    ],
  };
}
