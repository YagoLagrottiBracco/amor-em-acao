import type { Metadata } from "next";
import { SITE_CONFIG, buildMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contato e Localização — Casa Amarela | Amor em Ação",
  description:
    "Entre em contato com a Associação Humanitária Amor em Ação (CNPJ 21.960.082/0001-96). Atendimento pelo Instagram oficial @ahamoremacao e localização da Casa Amarela em Jardim Gramacho, Duque de Caxias/RJ.",
  path: "/contato",
  image: "/images/casa-amarela-equipe-criancas.jpg",
  imageAlt: "Contato Associação Humanitária Amor em Ação",
  keywords: [
    "contato Amor em Ação",
    "endereço Casa Amarela Jardim Gramacho",
    "Instagram @ahamoremacao",
    "Rua Tocantins 30 Jardim Gramacho",
    "atendimento voluntariado Duque de Caxias",
  ],
});

export default function ContatoPage() {
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Contato", path: "/contato" },
  ]);

  const contactPageSchema = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    name: "Contato — Associação Humanitária Amor em Ação",
    url: `${SITE_CONFIG.url}/contato`,
    description:
      "Canais oficiais de atendimento, contato e localização da Associação Humanitária Amor em Ação e Casa Amarela em Jardim Gramacho.",
    mainEntity: {
      "@type": "NGO",
      name: SITE_CONFIG.legalName,
      taxID: SITE_CONFIG.cnpj,
      telephone: "+55-21-99999-9999",
      email: "contato@amoremacao.org",
      address: {
        "@type": "PostalAddress",
        streetAddress: SITE_CONFIG.address.streetAddress,
        neighborhood: SITE_CONFIG.address.neighborhood,
        addressLocality: SITE_CONFIG.address.addressLocality,
        addressRegion: SITE_CONFIG.address.addressRegion,
        postalCode: SITE_CONFIG.address.postalCode,
        addressCountry: SITE_CONFIG.address.addressCountry,
      },
      sameAs: [SITE_CONFIG.instagramUrl],
    },
  };

  return (
    <section id="page-contato" className="bg-[#fffaf5] min-h-screen pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(contactPageSchema) }}
      />

      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Canais de Atendimento
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Fale com a Amor em Ação
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto mt-5 leading-relaxed">
            Tem dúvidas sobre projetos, deseja doar, agendar uma visita ou propor
            uma parceria institucional? Conecte-se conosco.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="soft-card p-6">
            <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 grid place-items-center mb-3">
              <i className="fa-solid fa-envelope" />
            </span>
            <h3 className="font-extrabold text-stone-900 text-lg">E-mail</h3>
            <p className="text-sm text-stone-600 mt-1">
              Para parcerias, prestação de contas e imprensa:
            </p>
            <a
              href="mailto:contato@amoremacao.org"
              className="text-orange-600 font-bold text-sm hover:underline mt-2 inline-block"
            >
              contato@amoremacao.org
            </a>
          </div>

          <div className="soft-card p-6">
            <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 grid place-items-center mb-3">
              <i className="fa-brands fa-instagram" />
            </span>
            <h3 className="font-extrabold text-stone-900 text-lg">
              Instagram Oficial
            </h3>
            <p className="text-sm text-stone-600 mt-1">
              Canal ativo de atualizações diárias, fotos de campo e mensagens:
            </p>
            <a
              href="https://www.instagram.com/ahamoremacao/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-orange-600 font-bold text-sm hover:underline mt-2 inline-block"
            >
              @ahamoremacao
            </a>
          </div>

          <div className="soft-card p-6">
            <span className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 grid place-items-center mb-3">
              <i className="fa-solid fa-location-dot" />
            </span>
            <h3 className="font-extrabold text-stone-900 text-lg">
              Sede da Casa Amarela
            </h3>
            <p className="text-sm text-stone-600 mt-1 leading-relaxed">
              Rua Tocantins, nº 30 — Jardim Gramacho, Duque de Caxias/RJ (CEP
              25055-000).
            </p>
            <p className="text-xs text-stone-400 mt-2">
              *Visitas e entregas presenciais devem ser agendadas previamente
              pelo canal oficial.
            </p>
          </div>
        </div>

        <div className="soft-card p-6 md:p-8 space-y-6 flex flex-col justify-center">
          <h2 className="display text-2xl font-extrabold text-stone-900">
            Atendimento Rápido e Direto
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            Para doações materiais pontuais, dúvidas imediatas sobre as
            crianças atendidas na Casa Amarela ou engajamento voluntário rápido,
            fale diretamente com os coordenadores pelo perfil verificado no
            Instagram.
          </p>
          <a
            href="https://www.instagram.com/ahamoremacao/"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-brand text-white font-extrabold w-full py-4 rounded-xl text-center block shadow-md hover:shadow-lg transition"
          >
            <i className="fa-brands fa-instagram mr-2" />
            Enviar Mensagem para @ahamoremacao
          </a>
          <div className="text-xs text-stone-500 border-t border-stone-100 pt-4 space-y-1">
            <p>
              <strong>Associação Humanitária Amor em Ação</strong>
            </p>
            <p>CNPJ Oficial: 21.960.082/0001-96</p>
            <p>Duque de Caxias · Rio de Janeiro · Brasil</p>
          </div>
        </div>
      </div>
    </section>
  );
}
