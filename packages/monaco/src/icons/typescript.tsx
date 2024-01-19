import { ComponentProps } from "react";

export function Typescript(props: ComponentProps<"svg">) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0px"
      y="0px"
      width={22}
      height={22}
      viewBox="0 0 48 48"
      {...props}
    >
      <path fill="#1976d2" d="M6 6H42V42H6z" />
      <path
        fill="#fff"
        d="M27.49 22L14.227 22 14.227 25.264 18.984 25.264 18.984 40 22.753 40 22.753 25.264 27.49 25.264z"
      />
      <path
        fill="#fff"
        d="M39.194 26.084s-1.787-1.192-3.807-1.192-2.747.96-2.747 1.986c0 2.648 7.381 2.383 7.381 7.712 0 8.209-11.254 4.568-11.254 4.568V35.22s2.152 1.622 4.733 1.622 2.483-1.688 2.483-1.92c0-2.449-7.315-2.449-7.315-7.878 0-7.381 10.658-4.469 10.658-4.469l-.132 3.509z"
      />
    </svg>
  );
}
