'use client'

import Markdown from "react-markdown";
import styles from "./styles.module.css";
import remarkBreaks from "remark-breaks";
import remarkGfm from "remark-gfm";

export default function RenderMarkdown({ markdown }: { markdown: string }) {
  return (
    <div className={styles.markdown}>
      <Markdown remarkPlugins={[remarkBreaks, remarkGfm]}>
        {markdown}
      </Markdown>
    </div>
  );
}