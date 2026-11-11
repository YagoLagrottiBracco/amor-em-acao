import type { Metadata } from "next";
import { buildMetadata, getBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Contato e Localização — Casa Amarela | Amor em Ação",
  description:
    "Entre em contato com a Associação Humanitária Amor em Ação pelo canal oficial @ahamoremacao ou veja a localização de referência da Casa Amarela em Jardim Gramacho.",
  path: "/contato",
  image: "/images/casa-amarela-equipe-criancas.jpg",
  imageAlt: "Contato Associação Humanitária Amor em Ação",
  keywords: [
    "contato Amor em Ação",
    "endereço Casa Amarela Jardim Gramacho",
    "Instagram @ahamoremacao",
    "Rua Tocantins 30 Jardim Gramacho",
  ],
});

export default function ContatoPage() {
  const breadcrumbSchema = getBreadcrumbJsonLd([
    { name: "Início", path: "/" },
    { name: "Contato", path: "/contato" },
  ]);

  return (
    <section id="page-contato">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />

      <div className="bg-[#29231f] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 text-center">
          <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
            Estamos à disposição
          </p>
          <h1 className="display text-4xl md:text-5xl font-extrabold mt-3">
            Entre em contato
          </h1>
          <p className="text-stone-300 max-w-2xl mx-auto mt-5">
            Tem dúvidas, quer propor uma parceria ou conhecer melhor as ações?
            Envie uma mensagem.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-14 grid md:grid-cols-2 gap-8">
        <div className="space-y-5">
          <div className="soft-card p-6">
            <i className="fa-solid fa-envelope text-2xl text-orange-600" />
            <h3 className="font-extrabold mt-3">E-mail</h3>
            <p className="text-sm text-stone-600 mt-1">
              Não localizamos um e-mail institucional atual em fonte oficial.
              Use o Instagram público para solicitar informações.
            </p>
          </div>

          <div className="soft-card p-6">
            <i className="fa-brands fa-whatsapp text-2xl text-orange-600" />
            <h3 className="font-extrabold mt-3">WhatsApp</h3>
            <p className="text-sm text-stone-600 mt-1">
              Não foi possível confirmar um telefone/WhatsApp atual em fonte
              institucional pública.
            </p>
          </div>

          <div className="soft-card p-6">
            <i className="fa-solid fa-location-dot text-2xl text-orange-600" />
            <h3 className="font-extrabold mt-3">Localização</h3>
            <p className="text-sm text-stone-600 mt-1">
              A reportagem da Rádio 93 FM informa Rua Tocantins, nº 30, Jardim
              Gramacho, Duque de Caxias/RJ. Confirme antes de visitar.
            </p>
          </div>
        </div>

        <div className="soft-card p-6 md:p-8 space-y-5 flex flex-col justify-center">
          <h2 className="display text-2xl font-extrabold">
            Canal público encontrado
          </h2>
          <p className="text-sm text-stone-600 leading-relaxed">
            O perfil abaixo foi citado na reportagem da Rádio 93 FM. Envie uma
            mensagem diretamente por lá para confirmar informações, doações e
            voluntariado.
          </p>
          <a
            href="https://www.instagram.com/ahamoremacao/"
            target="_blank"
            rel="noopener noreferrer"
            className="gradient-brand text-white font-extrabold w-full py-4 rounded-xl text-center block shadow-md hover:shadow-lg transition"
          >
            <i className="fa-brands fa-instagram mr-2" />
            Falar com @ahamoremacao
          </a>
          <p className="text-xs text-stone-400">
            Para parcerias institucionais e visitas presenciais à Casa Amarela,
            valide sempre os horários diretamente pelo canal oficial.
          </p>
        </div>
      </div>
    </section>
  );
}
