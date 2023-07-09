import GlowingCircle from "@/components/GlowingCircle";
import classNames from "classnames";
import { ReactNode } from "react";
import Balancer from "react-wrap-balancer";

export interface SkillProps {
  rank: number;
  name: string;
  icon: {
    icon: ReactNode;
    className?: string;
  };
  description: string;
  className?: string;
}

const SkillCard = (props: SkillProps) => {
  return (
    <div
      className={classNames(
        "bg-zinc-900 rounded-lg max-w-md p-6 flex space-x-4 items-center w-full justify-evenly",
        props.className
      )}
    >
      <div
        className={classNames(
          "text-8xl col-start-1 row-start-1 z-10",
          props.icon.className
        )}
      >
        {props.icon.icon}
      </div>
      <div className="space-y-1">
        <h2 className="font-bold text-2xl">{props.name}</h2>
        <p>
          <Balancer>{props.description}</Balancer>
        </p>
      </div>
    </div>
  );
};

export default SkillCard;
