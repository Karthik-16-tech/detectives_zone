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
      style={style}
      aria-label={words.map((w) => w.text).join(" ")}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: false, margin: "-12% 0px" }}
      variants={{
        hidden: {},
        visible: { transition: { staggerChildren: 0.07 } },
      }}
    >
      {words.map((word, i) => (
        <Fragment key={word.key}>
          <span className="inline-block overflow-hidden align-top">
            <motion.span
              className="inline-block"
              variants={{
                hidden: { x: 60, opacity: 0, skewY: 8 },
                visible: {
                  x: 0,
                  opacity: 1,
                  skewY: 0,
                  transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                },
              }}
            >
              {word.text}
            </motion.span>
          </span>
          {i < words.length - 1 ? "\u00A0" : null}
        </Fragment>
      ))}
    </motion.p>
  );
}
