import classNames from "classnames";
import GlowingCircle from "./GlowingCircle";

export interface GlowingCirclesProps {
  hidden: boolean;
}

const GlowingCircles = (props: GlowingCirclesProps) => {
  return (
    <div
      className={classNames(
        "col-start-1 row-start-1 flex flex-col items-center justify-center -space-y-3 animate-pulse"
      )}
    >
      <div
        className={classNames({
          hidden: props.hidden,
        })}
      >
        <GlowingCircle color={"red"} />
      </div>
      <div className="flex -space-x-2">
        <div
          className={classNames({
            hidden: props.hidden,
          })}
        >
          <GlowingCircle color={"blue"} />
        </div>
        <div
          className={classNames({
            hidden: props.hidden,
          })}
        >
          <GlowingCircle color={"yellow"} />
        </div>
      </div>
    </div>
  );
};

export default GlowingCircles;
