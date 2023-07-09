import classNames from "classnames";

export interface GlowingCircleProps {
  color: "red" | "blue" | "yellow" | "white";
}
const GlowingCircle = (props: GlowingCircleProps) => {
  return (
    <div
      className={classNames(
        "shadow-xl shadow-red-500/50 ease-in transition-all duration-1000 rounded-full blur-md w-8 h-8",
        {
          "bg-red-400": props.color === "red",
          "bg-blue-400": props.color === "blue",
          "bg-yellow-400": props.color === "yellow",
          "bg-white": props.color === "white",
        }
      )}
    ></div>
  );
};

export default GlowingCircle;
