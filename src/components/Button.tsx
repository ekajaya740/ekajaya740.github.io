import { cva, VariantProps } from "class-variance-authority";
import React from "react";

const button = cva("button", {
  variants: {
    intent: {
      primary: [
        "uppercase",
        "bg-white",
        "text-black",
        "font-bold",
        "px-4",
        "py-2",
        "hover:bg-slate-300",
        "rounded-md",
      ],
      secondary: [
        "uppercase",
        "border",
        "border-white",
        "text-white",
        "font-bold",
        "px-4",
        "py-2",
        "rounded-md",
        "hover:bg-slate-950",
      ],
      text: ["uppercase", "text-white", "underline", "font-bold"],
    },
  },
  defaultVariants: {
    intent: "primary",
  },
});

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof button> {
  name: string;
}

const Button: React.FC<ButtonProps> = ({
  className,
  intent,
  name,

  ...props
}) => {
  return (
    <button className={button({ intent, className })} {...props}>
      {name}
    </button>
  );
};

export default Button;
