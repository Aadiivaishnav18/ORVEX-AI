import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const components = {
  h1: (p) => <h1 className="mb-3 mt-6 text-2xl font-bold text-white" {...p} />,
  h2: (p) => <h2 className="mb-3 mt-6 text-xl font-semibold text-white" {...p} />,
  h3: (p) => <h3 className="mb-2 mt-5 text-lg font-semibold text-white" {...p} />,
  p: (p) => <p className="my-3 leading-7" {...p} />,
  strong: (p) => <strong className="font-semibold text-white" {...p} />,
  ul: (p) => <ul className="my-3 list-disc space-y-1.5 pl-6" {...p} />,
  ol: (p) => <ol className="my-3 list-decimal space-y-1.5 pl-6" {...p} />,
  li: (p) => <li className="leading-7 marker:text-neutral-500" {...p} />,
  hr: () => <hr className="my-6 border-white/10" />,
  a: (p) => (
    <a
      className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
      target="_blank"
      rel="noreferrer"
      {...p}
    />
  ),
  blockquote: (p) => (
    <blockquote className="my-3 border-l-2 border-white/20 pl-4 text-neutral-400" {...p} />
  ),
  pre: (p) => (
    <pre className="my-4 overflow-x-auto rounded-xl border border-white/10 bg-white/[0.04] p-4 text-sm" {...p} />
  ),
  code: ({ className, children, ...rest }) =>
    className ? (
      <code className={className} {...rest}>{children}</code>
    ) : (
      <code className="rounded bg-white/10 px-1.5 py-0.5 text-[0.9em]" {...rest}>
        {children}
      </code>
    ),
  table: (p) => (
    <div className="my-4 overflow-x-auto">
      <table className="w-full border-collapse text-left text-sm" {...p} />
    </div>
  ),
  th: (p) => <th className="border-b border-white/20 px-3 py-2 font-semibold" {...p} />,
  td: (p) => <td className="border-b border-white/10 px-3 py-2" {...p} />,
};

const Markdown = ({ children }) => (
  <div className="text-[15px] text-neutral-200 [&>*:first-child]:mt-0">
    <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
      {children}
    </ReactMarkdown>
  </div>
);

export default Markdown;