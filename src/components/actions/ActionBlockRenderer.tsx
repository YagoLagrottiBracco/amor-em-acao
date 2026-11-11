import React from "react";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { ActionPageBlock } from "@/lib/action-types";

export function ActionBlockRenderer({ blocks }: { blocks: ActionPageBlock[] }) {
  if (!blocks || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-14 md:space-y-18">
      {blocks.map((block) => {
        switch (block.type) {
          case "hero":
            return (
              <div
                key={block.id}
                className="relative overflow-hidden bg-[#29231f] text-white -mt-0 py-16 md:py-24"
              >
                <div className="absolute inset-0 hero-pattern opacity-70" />
                <div className="absolute -right-24 -top-28 w-[400px] h-[400px] rounded-full bg-orange-500/20 blur-3xl pointer-events-none" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6">
                  {block.kicker && (
                    <p className="text-orange-300 text-xs font-extrabold uppercase tracking-widest">
                      {block.kicker}
                    </p>
                  )}
                  <h1 className="display text-4xl sm:text-5xl lg:text-6xl font-extrabold mt-3 max-w-4xl leading-tight">
                    {block.title}
                  </h1>
                  {block.subtitle && (
                    <p className="text-stone-300 text-lg md:text-xl max-w-3xl mt-5 leading-relaxed">
                      {block.subtitle}
                    </p>
                  )}
                  {(block.primaryButtonText || block.secondaryButtonText) && (
                    <div className="flex flex-wrap gap-4 mt-8">
                      {block.primaryButtonText && (
                        <Link
                          href={block.primaryButtonLink || "/voluntariado"}
                          className="gradient-brand text-white font-extrabold px-6 py-3.5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                          {block.primaryButtonText}
                        </Link>
                      )}
                      {block.secondaryButtonText && (
                        <Link
                          href={block.secondaryButtonLink || "/contato"}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl transition"
                        >
                          {block.secondaryButtonText}
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );

          case "image_text": {
            const isLeft = block.imagePosition === "left";
            return (
              <section
                key={block.id}
                className="max-w-7xl mx-auto px-4 sm:px-6"
              >
                <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 items-center">
                  <div className={isLeft ? "lg:order-1" : "lg:order-2"}>
                    <div className="overflow-hidden rounded-3xl shadow-soft border border-orange-100/60">
                      <img
                        src={block.image}
                        alt={block.imageAlt || block.title}
                        className="w-full h-[360px] md:h-[440px] object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                      />
                    </div>
                  </div>

                  <div className={isLeft ? "lg:order-2" : "lg:order-1"}>
                    {block.kicker && (
                      <p className="section-kicker">{block.kicker}</p>
                    )}
                    <h2 className="display text-3xl md:text-4xl font-extrabold text-stone-900 mt-2">
                      {block.title}
                    </h2>

                    <div className="text-stone-600 leading-relaxed mt-5 space-y-4 whitespace-pre-line text-base">
                      {block.text}
                    </div>

                    {block.bullets && block.bullets.length > 0 && (
                      <ul className="mt-6 space-y-2.5">
                        {block.bullets.map((bullet, idx) => (
                          <li
                            key={idx}
                            className="flex items-start gap-3 text-stone-700 font-medium text-sm"
                          >
                            <span className="w-5 h-5 rounded-full bg-orange-100 text-orange-700 grid place-items-center text-xs shrink-0 mt-0.5 font-bold">
                              ✓
                            </span>
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}

                    {block.buttonText && block.buttonLink && (
                      <div className="mt-8">
                        <Link
                          href={block.buttonLink}
                          className="gradient-brand text-white font-extrabold text-sm px-6 py-3.5 rounded-xl shadow-md inline-flex items-center gap-2 hover:opacity-95 transition"
                        >
                          {block.buttonText}
                          <i className="fa-solid fa-arrow-right text-xs" />
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            );
          }

          case "text":
            return (
              <section
                key={block.id}
                className="max-w-4xl mx-auto px-4 sm:px-6"
              >
                <div className="soft-card p-8 sm:p-12">
                  {block.kicker && (
                    <p className="section-kicker">{block.kicker}</p>
                  )}
                  {block.title && (
                    <h2 className="display text-2xl sm:text-3xl font-extrabold text-stone-900 mt-2 mb-6">
                      {block.title}
                    </h2>
                  )}
                  <div className="prose prose-stone max-w-none text-stone-700 leading-relaxed">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {block.content}
                    </ReactMarkdown>
                  </div>
                </div>
              </section>
            );

          case "gallery": {
            const colsClass =
              block.columns === 2
                ? "grid sm:grid-cols-2 gap-6"
                : block.columns === 4
                ? "grid sm:grid-cols-2 lg:grid-cols-4 gap-5"
                : "grid sm:grid-cols-2 lg:grid-cols-3 gap-6";

            return (
              <section
                key={block.id}
                className="max-w-7xl mx-auto px-4 sm:px-6"
              >
                {block.kicker && (
                  <p className="section-kicker">{block.kicker}</p>
                )}
                <h2 className="display text-2xl md:text-3xl font-extrabold text-stone-900 mt-2">
                  {block.title}
                </h2>
                {block.description && (
                  <p className="text-stone-600 text-sm md:text-base leading-relaxed mt-2 max-w-3xl">
                    {block.description}
                  </p>
                )}

                <div className={`${colsClass} mt-8`}>
                  {block.items.map((item) => (
                    <figure
                      key={item.id}
                      className="soft-card overflow-hidden group flex flex-col"
                    >
                      <div className="h-56 sm:h-60 overflow-hidden bg-stone-100">
                        <img
                          src={item.image}
                          alt={item.alt || item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          loading="lazy"
                        />
                      </div>
                      <figcaption className="p-4 flex-grow flex flex-col justify-between">
                        <b className="text-sm font-extrabold text-stone-900 group-hover:text-orange-700 transition-colors">
                          {item.title}
                        </b>
                        {item.subtitle && (
                          <p className="text-xs text-stone-500 mt-1">
                            {item.subtitle}
                          </p>
                        )}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </section>
            );
          }

          case "cards": {
            const colsClass =
              block.columns === 2
                ? "grid sm:grid-cols-2 gap-6"
                : block.columns === 3
                ? "grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
                : "grid sm:grid-cols-2 lg:grid-cols-4 gap-5";

            return (
              <section
                key={block.id}
                className="max-w-7xl mx-auto px-4 sm:px-6"
              >
                {block.kicker && (
                  <p className="section-kicker">{block.kicker}</p>
                )}
                {block.title && (
                  <h2 className="display text-2xl md:text-3xl font-extrabold text-stone-900 mt-2 mb-6">
                    {block.title}
                  </h2>
                )}
                <div className={colsClass}>
                  {block.items.map((card) => (
                    <div
                      key={card.id}
                      className="soft-card p-6 flex flex-col justify-between hover:border-orange-200 transition"
                    >
                      <div>
                        <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-600 grid place-items-center text-xl mb-4">
                          <i className={`fa-solid ${card.icon}`} />
                        </div>
                        <h3 className="font-extrabold text-lg text-stone-900">
                          {card.title}
                        </h3>
                        <p className="text-sm text-stone-600 mt-2 leading-relaxed">
                          {card.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            );
          }

          case "stats":
            return (
              <section
                key={block.id}
                className="max-w-7xl mx-auto px-4 sm:px-6"
              >
                {block.kicker && (
                  <p className="section-kicker text-center">{block.kicker}</p>
                )}
                {block.title && (
                  <h2 className="display text-2xl md:text-3xl font-extrabold text-stone-900 mt-2 mb-8 text-center">
                    {block.title}
                  </h2>
                )}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {block.items.map((stat) => (
                    <div
                      key={stat.id}
                      className="soft-card p-8 text-center border-t-4 border-t-orange-500"
                    >
                      <span className="display text-4xl sm:text-5xl font-extrabold text-orange-600 block">
                        {stat.number}
                      </span>
                      <strong className="block text-stone-900 text-lg font-extrabold mt-2">
                        {stat.label}
                      </strong>
                      {stat.description && (
                        <p className="text-xs text-stone-500 mt-1">
                          {stat.description}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </section>
            );

          case "quote":
            return (
              <section
                key={block.id}
                className="max-w-4xl mx-auto px-4 sm:px-6"
              >
                {block.variant === "note" ? (
                  <div className="fact-note">
                    <strong className="block mb-1">
                      <i className="fa-solid fa-circle-info mr-1.5" />
                      Nota de apuração:
                    </strong>
                    {block.quote}
                    {block.source && (
                      <span className="block text-xs text-stone-500 mt-2 font-bold">
                        Fonte: {block.source}
                      </span>
                    )}
                  </div>
                ) : (
                  <div className="soft-card p-8 md:p-10 border-l-4 border-l-orange-500 bg-orange-50/40">
                    <p className="display text-xl md:text-2xl font-bold text-stone-800 italic leading-relaxed">
                      “{block.quote}”
                    </p>
                    {block.source && (
                      <p className="text-xs font-extrabold uppercase tracking-wider text-orange-700 mt-4">
                        — {block.source}
                      </p>
                    )}
                  </div>
                )}
              </section>
            );

          case "cta":
            return (
              <section
                key={block.id}
                className="max-w-7xl mx-auto px-4 sm:px-6"
              >
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#29231f] to-[#1c1815] text-white p-8 sm:p-12 md:p-16 text-center shadow-xl">
                  <div className="absolute inset-0 hero-pattern opacity-40 pointer-events-none" />
                  <div className="relative max-w-2xl mx-auto">
                    {block.kicker && (
                      <p className="text-orange-400 text-xs font-extrabold uppercase tracking-widest mb-3">
                        {block.kicker}
                      </p>
                    )}
                    <h2 className="display text-3xl md:text-4xl font-extrabold">
                      {block.title}
                    </h2>
                    <p className="text-stone-300 mt-4 leading-relaxed text-sm md:text-base">
                      {block.description}
                    </p>

                    <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                      {block.buttonText && (
                        <Link
                          href={block.buttonLink}
                          className="gradient-brand text-white font-extrabold px-7 py-3.5 rounded-xl shadow-md hover:shadow-lg transition cursor-pointer"
                        >
                          {block.buttonText}
                        </Link>
                      )}
                      {block.secondaryButtonText && (
                        <Link
                          href={block.secondaryButtonLink || "/contato"}
                          className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold px-6 py-3.5 rounded-xl transition"
                        >
                          {block.secondaryButtonText}
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </section>
            );

          case "contact":
            return (
              <section
                key={block.id}
                className="max-w-7xl mx-auto px-4 sm:px-6"
              >
                <div className="soft-card p-7 md:p-10">
                  {block.kicker && (
                    <p className="section-kicker">{block.kicker}</p>
                  )}
                  <h2 className="display text-2xl md:text-3xl font-extrabold text-stone-900 mt-2">
                    {block.title}
                  </h2>
                  {block.description && (
                    <p className="text-stone-600 mt-3 leading-relaxed">
                      {block.description}
                    </p>
                  )}

                  {block.address && (
                    <div className="mt-4 flex items-start gap-2.5 text-stone-700 text-sm">
                      <i className="fa-solid fa-location-dot text-orange-600 mt-1" />
                      <span>{block.address}</span>
                    </div>
                  )}

                  {block.instagram && (
                    <div className="mt-2 flex items-center gap-2.5 text-stone-700 text-sm">
                      <i className="fa-brands fa-instagram text-orange-600" />
                      <a
                        href={block.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link"
                      >
                        {block.instagram}
                      </a>
                    </div>
                  )}

                  {block.links && block.links.length > 0 && (
                    <div className="flex flex-wrap gap-3 mt-6">
                      {block.links.map((link) => (
                        <a
                          key={link.id}
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={
                            link.style === "primary"
                              ? "gradient-brand text-white font-extrabold px-6 py-3 rounded-xl shadow-sm hover:opacity-95 transition"
                              : link.style === "secondary"
                              ? "border border-orange-200 text-orange-800 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition"
                              : "source-link text-sm self-center"
                          }
                        >
                          {link.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              </section>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
