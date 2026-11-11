export interface BlogFaqItem {
  question: string;
  answer: string;
}

export interface StagedBlogAsset {
  id: string;
  filename: string;
  contentType: string;
  base64: string;
  alt: string;
  width: number;
  height: number;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Texto exibido no "pill" (badge arredondado) no canto superior esquerdo da foto do card */
  pillText: string;
  /** Texto exibido no botão de chamada para ação (CTA) no rodapé do card */
  buttonText: string;
  /** Link opcional customizado; se vazio, aponta automaticamente para /blog/[slug] */
  customLink?: string;
  coverImage: string;
  coverImageAlt: string;
  category: string;
  tags: string[];
  author: {
    name: string;
    role: string;
  };
  publishedAt: string;
  updatedAt: string;
  readingTimeMinutes: number;
  featured: boolean;
  /** Se verdadeiro, fica salvo como rascunho no painel admin e oculto nas páginas públicas */
  draft?: boolean;
  seoTitle: string;
  seoDescription: string;
  focusKeyword: string;
  content: string;
  faq?: BlogFaqItem[];
}

export const PROJECT_IMAGES: { url: string; label: string; defaultAlt: string }[] = [
  {
    url: "/images/casa-amarela-equipe-criancas.jpg",
    label: "Casa Amarela — Crianças e equipe na fachada",
    defaultAlt: "Crianças e equipe em frente à Casa Amarela em Jardim Gramacho",
  },
  {
    url: "/images/acao-comunitaria-plantio-jardim.jpg",
    label: "Voluntariado — Ação comunitária de plantio e pintura",
    defaultAlt: "Ação comunitária de plantio com voluntários e crianças",
  },
  {
    url: "/images/casa-amarela-convivencia-afeto.jpg",
    label: "Casa Amarela — Roda de convivência e afeto",
    defaultAlt: "Crianças reunidas com uma voluntária na Casa Amarela",
  },
  {
    url: "/images/atividade-manual-papel-colorido.jpg",
    label: "Oficina — Trabalho manual com papel colorido",
    defaultAlt: "Trabalho manual feito com papel colorido em uma atividade comunitária",
  },
  {
    url: "/images/casa-amarela-brincadeiras-agua.jpg",
    label: "Casa Amarela — Brincadeiras com água",
    defaultAlt: "Crianças brincando com água em um dia de calor",
  },
  {
    url: "/images/casa-amarela-infancia-sorriso.jpg",
    label: "Casa Amarela — Infância e espontaneidade",
    defaultAlt: "Duas crianças sorrindo para a câmera",
  },
  {
    url: "/images/casa-amarela-conquista-especial.jpg",
    label: "Casa Amarela — Conquista especial",
    defaultAlt: "Retrato sorridente de uma criança",
  },
  {
    url: "/images/nordeste-matoes-encontro-comunitario.jpg",
    label: "Nordeste (MA) — Encontro comunitário ao ar livre",
    defaultAlt: "Encontro de crianças e adultos em espaço ao ar livre em Matões do Norte",
  },
  {
    url: "/images/nordeste-matoes-atividade-desenho.jpg",
    label: "Nordeste (MA) — Atividade de desenho",
    defaultAlt: "Criança participando de atividade de desenho em Matões do Norte",
  },
  {
    url: "/images/nordeste-matoes-brincar-compartilhar.jpg",
    label: "Nordeste (MA) — Brincar e compartilhar",
    defaultAlt: "Criança segurando um brinquedo em Matões do Norte",
  },
  {
    url: "/images/nordeste-matoes-entrega-presente.jpg",
    label: "Nordeste (MA) — Entrega de presente",
    defaultAlt: "Menina segurando uma caixa de bonecas em Matões do Norte",
  },
  {
    url: "/images/malawi-acesso-agua-poco.jpg",
    label: "Malawi — Acesso à água",
    defaultAlt: "Criança bebendo água de uma torneira de poço",
  },
  {
    url: "/images/malawi-construcao-salas-aula.jpg",
    label: "Malawi — Construção de salas de aula",
    defaultAlt: "Construção de salas de aula no Malawi",
  },
  {
    url: "/images/malawi-construcao-comunitaria.jpg",
    label: "Malawi — Construção comunitária",
    defaultAlt: "Crianças carregando tijolos durante uma construção",
  },
  {
    url: "/images/malawi-dia-da-beleza-menina.jpg",
    label: "Malawi — Dia da Beleza (Retrato 1)",
    defaultAlt: "Retrato de uma menina no Malawi",
  },
  {
    url: "/images/malawi-dia-da-beleza-participante.jpg",
    label: "Malawi — Dia da Beleza (Retrato 2)",
    defaultAlt: "Retrato de uma participante do Dia da Beleza no Malawi",
  },
];
