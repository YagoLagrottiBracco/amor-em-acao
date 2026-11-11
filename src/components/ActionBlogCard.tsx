import Link from "next/link";

export interface ActionBlogCardProps {
  title: string;
  description: string;
  image: string;
  imageAlt: string;
  /** Text displayed on the white pill badge in the top-left corner of the image */
  pillText: string;
  /** Customizable button/link label displayed at the bottom with arrow */
  buttonText: string;
  href: string;
  external?: boolean;
}

export function ActionBlogCard({
  title,
  description,
  image,
  imageAlt,
  pillText,
  buttonText,
  href,
  external = false,
}: ActionBlogCardProps) {
  return (
    <article className="action-card soft-card overflow-hidden flex flex-col group h-full">
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className="h-52 overflow-hidden relative block focus-ring"
        aria-label={`${title} — ${buttonText}`}
      >
        <img
          className="w-full h-full object-cover"
          src={image}
          alt={imageAlt}
          loading="lazy"
        />
        {pillText && (
          <span className="absolute top-4 left-4 bg-white text-orange-700 text-xs font-extrabold px-3 py-1.5 rounded-full shadow-sm">
            {pillText}
          </span>
        )}
      </Link>

      <div className="p-6 flex flex-col flex-grow">
        <h3 className="display text-xl font-extrabold text-stone-900 group-hover:text-orange-700 transition-colors">
          <Link
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            className="focus-ring rounded"
          >
            {title}
          </Link>
        </h3>

        <p className="text-stone-600 text-sm leading-relaxed mt-3 flex-grow">
          {description}
        </p>

        <Link
          href={href}
          target={external ? "_blank" : undefined}
          rel={external ? "noopener noreferrer" : undefined}
          className="text-orange-700 font-extrabold text-sm text-left mt-5 inline-flex items-center hover:text-orange-800 transition-colors focus-ring rounded w-fit"
        >
          <span>{buttonText || "Saiba mais"}</span>
          <i
            className="fa-solid fa-arrow-right ml-2 transition-transform group-hover:translate-x-1"
            aria-hidden="true"
          />
        </Link>
      </div>
    </article>
  );
}
