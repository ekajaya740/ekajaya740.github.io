export interface NavBarItemProps {
  name: string;
}

const NavBarItem = (props: NavBarItemProps) => {
  return <p className="rounded-full text-white">{props.name}</p>;
};

export default NavBarItem;
