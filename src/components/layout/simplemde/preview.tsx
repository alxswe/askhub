import dynamic from "next/dynamic";

export const MarkdownPreview = dynamic(
  () => import("@uiw/react-markdown-preview"),
  {
    ssr: false,
  },
);
