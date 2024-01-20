import { ComponentProps } from "react";

function Css(props: ComponentProps<"svg">) {
  return (
    <svg
      width="20px"
      height="20px"
      viewBox="0 0 17 17"
      xmlns="http://www.w3.org/2000/svg"
      fill="#3c93da"
      stroke="#3c93da"
      {...props}
    >
      <path
        d="M16.5 1.26l-2.407 12.064-7.277 2.416L.5 13.324l.643-3.223h2.688l-.263 1.33 3.818 1.457 4.398-1.457.614-3.068H1.469l.524-2.686h10.94l.345-1.73H2.347L2.88 1.26H16.5z"
        fill="3c93da"
      />
    </svg>
  );
}

export default Css;
