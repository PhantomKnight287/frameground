/**
 * Ayu Dark, as a react-syntax-highlighter (Prism) style.
 *
 * Palette from the official ayu-colors definition:
 * bg #0B0E14 · fg #BFBDB6 · accent #E6B450 · line #11151C
 * tag #39BAE6 · func #FFB454 · entity #59C2FF · string #AAD94C
 * regexp #95E6CB · markup #F07178 · keyword #FF8F40 · special #E6B673
 * constant #D2A6FF · operator #F29668 · comment #ACB6BF8C
 */
/** JetBrains Mono, loaded in the root layout as `--font-mono`. */
const mono =
  'var(--font-mono), ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace';

const background = "#0B0E14";
const foreground = "#BFBDB6";
const comment = "#ACB6BF8C";
const string = "#AAD94C";
const keyword = "#FF8F40";
const constant = "#D2A6FF";
const operator = "#F29668";
const func = "#FFB454";
const entity = "#59C2FF";
const tag = "#39BAE6";
const regexp = "#95E6CB";
const markup = "#F07178";
const special = "#E6B673";

export const ayuDark: Record<string, React.CSSProperties> = {
  'code[class*="language-"]': {
    color: foreground,
    background: "none",
    fontSize: "13px",
    textShadow: "none",
    fontFamily: mono,
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
  },
  'pre[class*="language-"]': {
    color: foreground,
    background,
    fontSize: "13px",
    textShadow: "none",
    fontFamily: mono,
    direction: "ltr",
    textAlign: "left",
    whiteSpace: "pre",
    wordSpacing: "normal",
    wordBreak: "normal",
    lineHeight: "1.5",
    MozTabSize: "4",
    OTabSize: "4",
    tabSize: "4",
    WebkitHyphens: "none",
    MozHyphens: "none",
    msHyphens: "none",
    hyphens: "none",
    padding: "1em",
    margin: "0.5em 0",
    overflow: "auto",
  },
  ':not(pre) > code[class*="language-"]': {
    background,
    padding: "0.1em 0.3em",
    borderRadius: "0.3em",
    whiteSpace: "normal",
  },
  'pre[class*="language-"]::selection': { background: "#409FFF40" },
  'code[class*="language-"]::selection': { background: "#409FFF40" },

  comment: { color: comment, fontStyle: "italic" },
  prolog: { color: comment },
  doctype: { color: comment },
  cdata: { color: comment },

  punctuation: { color: foreground },
  operator: { color: operator },
  entity: { color: operator, cursor: "help" },
  url: { color: operator },

  string: { color: string },
  char: { color: string },
  "attr-value": { color: string },
  "attr-value-punctuation": { color: string },
  inserted: { color: string },

  number: { color: constant },
  boolean: { color: constant },
  constant: { color: constant },
  symbol: { color: constant },
  "unit": { color: constant },

  keyword: { color: keyword },
  atrule: { color: keyword },
  "rule": { color: keyword },
  important: { color: keyword, fontWeight: "bold" },

  tag: { color: tag },
  "attr-name": { color: tag },
  "property": { color: tag },
  "property-access": { color: tag },
  "namespace": { color: tag },
  selector: { color: tag },

  function: { color: func },
  "function-variable": { color: func },
  builtin: { color: func },
  "class-name": { color: entity },
  "maybe-class-name": { color: entity },
  "console": { color: entity },
  parameter: { color: foreground },
  variable: { color: foreground },

  regex: { color: regexp },
  "escape": { color: regexp },
  "template-punctuation": { color: string },
  "interpolation-punctuation": { color: operator },

  deleted: { color: markup },
  "deleted-sign": { color: markup },
  annotation: { color: special },
  "doc-comment": { color: comment, fontStyle: "italic" },
  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },

  // markdown / diff niceties
  title: { color: entity, fontWeight: "bold" },
  "list-punctuation": { color: keyword },
  "code-snippet": { color: string },
  "blockquote-punctuation": { color: special },
  "table-header": { color: entity },
};

export default ayuDark;
