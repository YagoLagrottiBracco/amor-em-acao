import Link from "next/link";
import { getFeaturedBlogPostsAsync } from "@/lib/blog";
import { ActionBlogCard } from "@/components/ActionBlogCard";
import {
  HeroButtons,
  ImpactCalculator,
} from "@/components/HomeClientWidgets";
import { getFaqJsonLd } from "@/lib/seo";

export const dynamic = "force-dynamic";

const HOME_FAQS = [
  {
    question: "O que é a Associação Humanitária Amor em Ação e qual sua missão?",
    answer:
      "A Associação Humanitária Amor em Ação (CNPJ 21.960.082/0001-96) é uma organização sem fins lucrativos dedicada a servir pessoas em situação de extrema vulnerabilidade social e pobreza. Promovemos acolhimento infantil, alimentação diária, dignidade, apoio pedagógico e oportunidades de futuro.",
  },
  {
    question: "O que é a Casa Amarela em Jardim Gramacho?",
    answer:
      "A Casa Amarela é o polo comunitário da Amor em Ação no bairro de Jardim Gramacho, em Duque de Caxias/RJ. O espaço oferece às crianças banho diário, alimentação nutritiva, reforço escolar, oficinas pedagógicas, recreação e convivência afetuosa em um ambiente seguro.",
  },
  {
    question: "Quais são as outras frentes de atuação além de Jardim Gramacho?",
    answer:
      "Além da Baixada Fluminense, a Amor em Ação realiza projetos comunitários no sertão nordestino brasileiro (em Matões do Norte/MA) com suporte às famílias, e apoia missões humanitárias internacionais no Malawi (África), viabilizando poços artesianos para água potável e reformas escolares.",
  },
  {
    question: "Como posso doar e apoiar os projetos da Amor em Ação?",
    answer:
      "Você pode realizar doações seguras e diretas pelo nosso site com cartão de crédito via Stripe Checkout (doações únicas ou mensais recorrentes) ou via PIX institucional. Cada recurso é aplicado com transparência pública e prestação de contas.",
  },
  {
    question: "Como funciona o voluntariado na instituição?",
    answer:
      "Recebemos voluntários para atuação presencial em nossas ações comunitárias e eventos, e voluntários remotos em áreas como comunicação, design, captação e suporte administrativo. Acesse a página 'Seja voluntário' para registrar seu interesse.",
  },
];

export default async function HomePage() {
  const featuredPosts = await getFeaturedBlogPostsAsync(3);
  const faqSchema = getFaqJsonLd(HOME_FAQS);

  return (
    <div>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      {/* HERO */}
      <div className="relative overflow-hidden bg-[#29231f] text-white">
        <div className="absolute inset-0 hero-pattern opacity-70" />
        <div className="absolute -right-24 -top-28 w-[460px] h-[460px] rounded-full bg-orange-500/20 blur-3xl" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-16 md:py-24 grid lg:grid-cols-[1.08fr_.92fr] gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 text-orange-200 bg-orange-400/10 border border-orange-300/25 px-4 py-2 rounded-full text-xs font-extrabold uppercase tracking-widest">
              <i className="fa-solid fa-hands-holding-circle" /> Solidariedade em
              movimento
            </span>
            <h1 className="display text-4xl sm:text-5xl lg:text-[3.65rem] leading-[1.12] font-extrabold mt-6">
              O amor ganha força quando se transforma em{" "}
              <span className="text-orange-400">ação.</span>
            </h1>
            <p className="text-stone-300 text-lg leading-relaxed mt-6 max-w-xl">
              Acreditamos que cuidado, oportunidade e dignidade podem
              transformar realidades. Conheça as frentes de atuação do Amor em
              Ação e descubra como fazer parte dessa corrente.
            </p>
            <HeroButtons />
            <p className="text-xs text-stone-400 mt-6">
              <i className="fa-solid fa-circle-info mr-1 text-orange-400" />
              Conheça as iniciativas apresentadas e confirme os dados
              institucionais antes de realizar uma contribuição.
            </p>
          </div>

          <div className="relative">
            <div className="rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/images/casa-amarela-equipe-criancas.jpg"
                alt="Crianças participando de uma atividade comunitária na Casa Amarela"
                className="w-full h-[340px] md:h-[430px] object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -left-3 md:-left-8 bg-white text-stone-800 rounded-2xl p-5 shadow-xl max-w-[245px]">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-orange-100 text-orange-600 grid place-items-center text-xl">
                  <i className="fa-solid fa-hand-holding-heart" />
                </span>
                <div>
                  <b className="display text-sm">Cuidado que chega</b>
                  <p className="text-xs text-stone-500">
                    Apoio que começa com presença.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ONDE ATUAMOS — CARDS INSTITUCIONAIS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <p className="section-kicker">Onde atuamos</p>
          <h2 className="display text-3xl md:text-4xl font-extrabold mt-3">
            Uma iniciativa, muitas formas de apoiar
          </h2>
          <p className="text-stone-600 mt-4 leading-relaxed">
            A atuação publicamente documentada que conseguimos identificar está
            concentrada na Casa Amarela, em Jardim Gramacho.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <ActionBlogCard
            title="Casa Amarela"
            description="Iniciativa comunitária da Associação Humanitária Amor em Ação em Jardim Gramacho, com acolhimento, alimentação, higiene, convivência e atividades para crianças."
            image="/images/casa-amarela-equipe-criancas.jpg"
            imageAlt="Crianças e equipe em frente à Casa Amarela"
            pillText="Duque de Caxias · RJ"
            buttonText="Conhecer a iniciativa"
            href="/acoes/casa-amarela"
          />

          <ActionBlogCard
            title="Voluntariado"
            description="Conheça formas de colaborar com tempo, habilidades, mobilização e divulgação. A disponibilidade deve ser confirmada diretamente com a organização."
            image="/images/acao-comunitaria-plantio-jardim.jpg"
            imageAlt="Ação comunitária de plantio com voluntários e crianças"
            pillText="Participe"
            buttonText="Quero participar"
            href="/voluntariado"
          />

          <ActionBlogCard
            title="Transparência"
            description="Consulte as informações encontradas, conheça os limites das fontes públicas e saiba quais documentos precisam ser solicitados à instituição."
            image="/images/casa-amarela-convivencia-afeto.jpg"
            imageAlt="Voluntários e crianças em atividade comunitária"
            pillText="Compromisso público"
            buttonText="Ver informações"
            href="/transparencia"
          />
        </div>
      </section>

      {/* FAÇA PARTE */}
      <section className="bg-orange-50 border-y border-orange-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="section-kicker">Faça parte</p>
            <h2 className="display text-3xl md:text-4xl font-extrabold mt-3">
              Pequenas atitudes podem abrir grandes caminhos.
            </h2>
            <p className="text-stone-600 leading-relaxed mt-4">
              Você pode contribuir com seu tempo, conhecimento, divulgação ou
              doação. Toda forma de participação deve ser construída com
              responsabilidade e respeito às necessidades de cada comunidade.
            </p>
            <div className="flex flex-wrap gap-3 mt-7">
              <Link
                href="/voluntariado"
                className="gradient-brand text-white font-extrabold px-6 py-3 rounded-xl shadow-sm hover:opacity-95 transition"
              >
                Quero ser voluntário
              </Link>
              <Link
                href="/contato"
                className="bg-white border border-orange-200 text-orange-800 font-bold px-6 py-3 rounded-xl hover:bg-orange-100/50 transition"
              >
                Falar com a equipe
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <i className="fa-solid fa-book-open text-2xl text-orange-600" />
              <h3 className="font-extrabold mt-4">Educação</h3>
              <p className="text-sm text-stone-500 mt-2">
                Aprendizagem e desenvolvimento.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <i className="fa-solid fa-droplet text-2xl text-orange-600" />
              <h3 className="font-extrabold mt-4">Água e saúde</h3>
              <p className="text-sm text-stone-500 mt-2">
                Condições básicas para viver com dignidade.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <i className="fa-solid fa-utensils text-2xl text-orange-600" />
              <h3 className="font-extrabold mt-4">Alimentação</h3>
              <p className="text-sm text-stone-500 mt-2">
                Apoio alimentar em situações de necessidade.
              </p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm">
              <i className="fa-solid fa-people-group text-2xl text-orange-600" />
              <h3 className="font-extrabold mt-4">Comunidade</h3>
              <p className="text-sm text-stone-500 mt-2">
                Fortalecimento de vínculos e autonomia.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* REGISTROS DA ASSOCIAÇÃO */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-14">
        <div className="grid md:grid-cols-[.9fr_1.1fr] gap-8 items-center">
          <img
            src="/images/atividade-manual-papel-colorido.jpg"
            alt="Trabalho manual feito com papel colorido em uma atividade comunitária"
            className="w-full h-[300px] md:h-[360px] object-cover rounded-3xl shadow-soft"
          />
          <div>
            <p className="section-kicker">Registros da associação</p>
            <h2 className="display text-2xl md:text-3xl font-extrabold mt-2">
              Criatividade também é uma forma de expressão
            </h2>
            <p className="text-stone-600 leading-relaxed mt-4">
              Registro de uma atividade manual compartilhada em publicação do
              perfil @ahamoremacao. O local e o projeto específico não aparecem
              na imagem enviada, por isso ela é apresentada aqui sem atribuição a
              uma unidade ou missão.
            </p>
          </div>
        </div>
      </section>

      {/* BLOG E PUBLICAÇÕES EM DESTAQUE (COM PILL E BOTÃO CUSTOMIZÁVEIS PELO ADMIN) */}
      {featuredPosts.length > 0 && (
        <section className="bg-white/70 border-y border-orange-100/80 py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
              <div className="max-w-2xl">
                <p className="section-kicker">Blog e Artigos</p>
                <h2 className="display text-3xl md:text-4xl font-extrabold mt-3">
                  Histórias, transparência e impacto social
                </h2>
                <p className="text-stone-600 mt-3 leading-relaxed">
                  Acompanhe nossas publicações estruturadas com informações
                  públicas, guias de voluntariado e registros das ações
                  comunitárias.
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <Link
                  href="/blog"
                  className="bg-orange-50 hover:bg-orange-100 text-orange-800 font-extrabold text-sm px-5 py-3 rounded-xl transition"
                >
                  Ver todos os artigos{" "}
                  <i className="fa-solid fa-arrow-right ml-1.5" />
                </Link>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {featuredPosts.map((post) => (
                <ActionBlogCard
                  key={post.id}
                  title={post.title}
                  description={post.excerpt}
                  image={post.coverImage}
                  imageAlt={post.coverImageAlt}
                  pillText={post.pillText}
                  buttonText={post.buttonText}
                  href={post.customLink || `/blog/${post.slug}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SIMULADOR EDUCATIVO INTEGRADO AO STRIPE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="text-center max-w-2xl mx-auto">
          <p className="section-kicker">Simulador educativo</p>
          <h2 className="display text-3xl font-extrabold mt-3">
            Explore possibilidades de contribuição
          </h2>
          <p className="text-stone-600 mt-3 text-sm">
            Este simulador é ilustrativo: não representa orçamento, preço real de
            itens ou garantia de impacto. Os valores devem ser validados pela
            organização.
          </p>
        </div>

        <ImpactCalculator />
      </section>

      {/* PERGUNTAS FREQUENTES (FAQ COM SCHEMA.ORG PARA SEO NO GOOGLE) */}
      <section className="bg-[#fffaf5] border-t border-orange-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <p className="section-kicker">Tire suas dúvidas</p>
            <h2 className="display text-3xl md:text-4xl font-extrabold mt-2 text-stone-900">
              Perguntas Frequentes sobre a Amor em Ação
            </h2>
            <p className="text-stone-600 mt-3 text-sm">
              Entenda como operamos, como os recursos são aplicados e de que
              maneiras você pode fazer a diferença na vida das nossas crianças.
            </p>
          </div>

          <div className="space-y-4">
            {HOME_FAQS.map((faq, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-2xl p-6 border border-stone-200/80 shadow-sm transition hover:border-orange-300"
              >
                <summary className="font-extrabold text-stone-900 cursor-pointer list-none flex justify-between items-center gap-4 text-base md:text-lg">
                  <span>{faq.question}</span>
                  <span className="w-8 h-8 rounded-full bg-orange-50 text-orange-600 grid place-items-center shrink-0 group-open:rotate-180 transition-transform">
                    <i className="fa-solid fa-chevron-down text-xs" />
                  </span>
                </summary>
                <p className="mt-4 text-stone-600 leading-relaxed text-sm md:text-base border-t border-stone-100 pt-4">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
