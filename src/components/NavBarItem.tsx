import classNames from "classnames";

export interface NavBarItemProps {
  name: string;
  selected?: boolean;
}

const NavBarItem = (props: NavBarItemProps) => {
  return (
    <p
      className={classNames("rounded-full text-white ease-in duration-1000", {
        "underline decoration-red-400/50 font-bold animate-pulse":
          props.selected,
      })}
    >
      {props.name}
    </p>
  );
};

export default NavBarItem;
