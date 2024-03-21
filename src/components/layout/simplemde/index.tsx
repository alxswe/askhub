import dynamic from "next/dynamic";
import { useMemo } from "react";
import rehypeSanitize from "rehype-sanitize";
import { MarkdownPreview } from "./preview";

export const SimpleMDE = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});
const rehypePlugins = [rehypeSanitize];

export const SimpleMDEPreview = (props: any) => {
  return (
    <MarkdownPreview
      {...props}
      rehypePlugins={rehypePlugins}
      wrapperElement={{
        "data-color-mode": "light",
        class: "wmde-markdown wmde-markdown-color",
      }}
    />
  );
};

export default function SimpleMDEEditor({
  value,
  onChange,
  preview = true,
}: {
  value: string;
  onChange: (...args: any) => any;
  preview?: boolean;
}) {
  const options = useMemo(
    () => ({
      spellChecker: true,
      sideBySideFullscreen: false,
      lineWrapping: true,
      tabSize: 4,
      syncSideBySidePreviewScroll: true,
      renderingConfig: {
        codeSyntaxHighlighting: true,
      },
    }),
    [],
  );

  return (
    <div id={"simple-mde"}>
      <div>
        <SimpleMDE value={value} options={options} onChange={onChange} />
      </div>
      {preview && <SimpleMDEPreview source={value} />}
    </div>
  );
}
