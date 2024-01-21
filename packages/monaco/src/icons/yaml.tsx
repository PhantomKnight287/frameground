import { ComponentProps } from "react";

function Yaml(props: ComponentProps<"svg">) {
  return (
    <svg
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      width={20}
      height={20}
      {...props}
    >
      <g fill="none" fillRule="evenodd">
        <path fill="#F98B9E" fillOpacity={0.7} d="M1 16L16 16 16 9 1 9z" />
        <path fill="#9AA7B0" fillOpacity={0.8} d="M7 1L3 5 7 5z" />
        <path
          fill="#9AA7B0"
          fillOpacity={0.8}
          d="M8 1L8 6 3 6 3 8 13 8 13 1z"
        />
        <path
          fill="#231F20"
          fillOpacity={0.7}
          transform="translate(1 10)"
          d="M1.996 5L1.996 3.029 0 0 1.05 0 2.496 2.207 3.95 0 5 0 3 3.007 3 5z"
        />
        <path
          fill="#231F20"
          fillOpacity={0.7}
          transform="translate(6 10)"
          d="M0 0L0.936 0 2.5 2 3.979 0 5 0 5 5 4 5 4 1.7 2.5 3.5 1 1.7 1 5 0 5z"
        />
        <path
          fill="#231F20"
          fillOpacity={0.7}
          transform="translate(12 10)"
          d="M0 0L1 0 1 4 3.5 4 3.5 5 0 5z"
        />
      </g>
    </svg>
  );
}

export default Yaml;
