/* eslint-disable @next/next/no-img-element */
import React from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";

import { remarkBlogHeadingIds } from "@/lib/blog-outline";
import { safeBlogUrl } from "@/lib/blog-markdown-url";
import { BlogCopyCode } from "@/components/blog/BlogCopyCode";

type HastChild = {
  type?: string;
  value?: string;
  tagName?: string;
  children?: HastChild[];
  properties?: Record<string, unknown>;
};

function hastText(node: HastChild): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(hastText).join("");
}

function htmlProps<T extends { node?: unknown }>(props: T): Omit<T, "node"> {
  const { node, ...rest } = props;
  void node;
  return rest;
}

export function BlogMarkdown({
  content,
  assetPreviews,
  pageUrl,
}: {
  content: string;
  assetPreviews?: Record<string, string>;
  pageUrl?: string;
}) {
  void pageUrl;
  return (
    <div className="blog-prose max-w-none break-words text-stone-800">
      <ReactMarkdown
        remarkPlugins={[
          remarkGfm,
          remarkBlogHeadingIds,
        ]}
        rehypePlugins={[
          [rehypeHighlight, { detect: false, plainText: ["txt", "text"] }],
        ]}
        skipHtml
        urlTransform={(url, key) =>
          key === "src" && assetPreviews?.[url]
            ? url
            : (safeBlogUrl(url, key === "src" ? "image" : "link") ?? "")
        }
        components={{
          h2: (props) => (
            <h2
              {...htmlProps(props)}
              className="display mt-12 mb-4 scroll-mt-28 border-b border-orange-100 pb-3 text-2xl sm:text-3xl font-extrabold tracking-tight text-stone-900"
            />
          ),
          h3: (props) => (
            <h3
              {...htmlProps(props)}
              className="display mt-8 mb-3 scroll-mt-28 text-xl sm:text-2xl font-bold tracking-tight text-stone-900"
            />
          ),
          p: ({ node, children, ...props }) => {
            const only =
              node?.children.length === 1
                ? (node.children[0] as HastChild)
                : null;
            if (only?.type === "element" && only.tagName === "img") {
              const caption =
                typeof only.properties?.title === "string"
                  ? only.properties.title
                  : "";
              return (
                <figure className="my-8">
                  <div>{children}</div>
                  {caption && (
                    <figcaption className="mt-2.5 text-center text-xs font-medium text-stone-500">
                      {caption}
                    </figcaption>
                  )}
                </figure>
              );
            }
            return (
              <p
                className="my-5 text-[1.0625rem] leading-8 text-stone-700"
                {...props}
              >
                {children}
              </p>
            );
          },
          a: (props) => {
            const { href, ...rest } = htmlProps(props);
            return (
              <a
                {...rest}
                href={href ? safeBlogUrl(href, "link") : undefined}
                className="font-bold text-orange-700 underline decoration-orange-300 underline-offset-4 hover:text-orange-800 hover:decoration-orange-600"
              />
            );
          },
          img: (props) => {
            const { src, alt, ...rest } = htmlProps(props);
            const safe =
              typeof src === "string"
                ? (assetPreviews?.[src] ?? safeBlogUrl(src, "image"))
                : undefined;
            return safe ? (
              <img
                {...rest}
                src={safe}
                alt={alt ?? ""}
                loading="lazy"
                className="h-auto max-w-full rounded-2xl border border-orange-100 shadow-sm"
              />
            ) : (
              <span>{alt}</span>
            );
          },
          blockquote: (props) => (
            <blockquote
              {...htmlProps(props)}
              className="my-8 rounded-r-2xl border-l-4 border-orange-500 bg-orange-50/70 px-6 py-4 italic text-orange-950 font-medium"
            />
          ),
          ul: (props) => (
            <ul
              {...htmlProps(props)}
              className="my-6 list-disc space-y-2.5 pl-6 text-stone-700"
            />
          ),
          ol: (props) => (
            <ol
              {...htmlProps(props)}
              className="my-6 list-decimal space-y-2.5 pl-6 text-stone-700"
            />
          ),
          li: (props) => (
            <li {...htmlProps(props)} className="pl-1 leading-7" />
          ),
          hr: (props) => (
            <hr {...htmlProps(props)} className="my-10 border-orange-100" />
          ),
          table: (props) => (
            <div className="my-8 max-w-full overflow-x-auto rounded-2xl border border-orange-100">
              <table
                {...htmlProps(props)}
                className="min-w-full border-collapse text-left text-sm"
              />
            </div>
          ),
          th: (props) => (
            <th
              {...htmlProps(props)}
              className="border-b border-orange-100 bg-orange-50/60 px-4 py-3 font-bold text-stone-900"
            />
          ),
          td: (props) => (
            <td
              {...htmlProps(props)}
              className="border-b border-stone-100 px-4 py-3 align-top text-stone-700"
            />
          ),
          pre: ({ node, children }) => {
            const raw = hastText(node as HastChild).replace(/\n$/, "");
            const code = (node as HastChild).children?.find(
              (child) => child.tagName === "code"
            );
            const className = String(code?.properties?.className ?? "");
            const language = className.match(/language-([\w-]+)/)?.[1];
            return (
              <div className="my-8 min-w-0 overflow-hidden rounded-2xl border border-stone-200 bg-stone-900 text-stone-100">
                <div className="flex items-center justify-between border-b border-stone-800 bg-stone-950/60 px-4 py-2 text-xs text-stone-400">
                  <span className="font-mono uppercase">{language ?? "texto"}</span>
                  <BlogCopyCode code={raw} />
                </div>
                <pre className="overflow-x-auto p-4 text-sm leading-6">
                  {children}
                </pre>
              </div>
            );
          },
          code: (props) => {
            const { className, ...rest } = htmlProps(props);
            return (
              <code
                {...rest}
                className={
                  className
                    ? className + " scroll-mt-28"
                    : "scroll-mt-28 rounded-md bg-orange-50 px-1.5 py-0.5 font-mono text-[0.9em] text-orange-900 border border-orange-100"
                }
              />
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
