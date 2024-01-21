import Css from "./css";
import Git from "./git";
import Html from "./html";
import { Javascript } from "./javascript";
import Json from "./json";
import JSX from "./jsx";
import { Markdown } from "./markdown";
import Svg from "./svg";
import TSX from "./tsx";
import { Typescript } from "./typescript";
import Yaml from "./yaml";

export const Icons = {
  ".js": <Javascript />,
  ".md": <Markdown />,
  ".ts": <Typescript />,
  ".cjs": <Javascript />,
  ".jsx": <JSX />,
  ".mjs": <Javascript />,
  ".css": <Css />,
  ".svg": <Svg />,
  ".html": <Html />,
  ".json": <Json />,
  ".tsx": <TSX />,
  ".gitignore": <Git />,
  ".gitkeep": <Git />,
  ".yml": <Yaml />,
  ".yaml": <Yaml />,
};
