import { Fragment, isValidElement, type CSSProperties, type ReactNode } from "react";
import { motion } from "motion/react";

function extractWords(node: ReactNode, keyPrefix: string, out: { text: string; key: string }[]) {
  if (node == null || typeof node === "boolean") return;
  if (typeof node === "string" || typeof node === "number") {
    node
      .toString()
      .split(" ")
      .filter(Boolean)
      .forEach((word, i) => out.push({ text: word, key: `${keyPrefix}-${i}` }));
    return;
  }
  if (Array.isArray(node)) {
    node.forEach((child, i) => extractWords(child, `${keyPrefix}-${i}`, out));
    return;
  }
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode } | null;
    extractWords(props?.children, `${keyPrefix}-${node.key ?? out.length}`, out);
  }
}

export function SkiperTextRevealH({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const words: { text: string; key: string }[] = [];
  extractWords(children, "w", words);

  return (
    <motion.p
      className={className}
      style={{ ...style, wordBreak: "break-word" }}
      aria-label={words.map((w) => w.text).join(" ")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.04 } },
      }}
    >
      {words.map((word, i) => (
        <Fragment key={word.key}>
          <span className="inline-block overflow-hidden align-top">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { y: "100%", opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word.text}
            </motion.span>
          </span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.p>
  );
}
