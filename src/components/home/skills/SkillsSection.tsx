import Link from "next/link";
import SkillCard, { SkillProps } from "./components/SkillCard";
import {
  TbBrandFigma,
  TbBrandFlutter,
  TbBrandNextjs,
  TbBrandPython,
} from "react-icons/tb";

const SkillSection = () => {
  const skills: SkillProps[] = [
    {
      rank: 1,
      name: "NextJS",
      icon: {
        icon: <TbBrandNextjs />,
        className: "text-white",
      },
      description:
        "I mainly use NextJS for my web development projects. I'm very skillful with it. Other than web I can use it for building mobile apps with Capacitor and Desktop apps with Tauri",
      className: "hover:shadow-md duration-500 hover:shadow-white/40",
    },
    {
      rank: 2,
      name: "Flutter",
      icon: {
        icon: <TbBrandFlutter />,
        className: "text-blue-400",
      },
      description:
        "I love using Flutter for building mobile apps because of its reactivity and performance. I can also use it for building desktop apps with Flutter Desktop.",
      className: "hover:shadow-md duration-500 hover:shadow-blue-400/40",
    },
    {
      rank: 3,
      name: "Figma",
      icon: {
        icon: <TbBrandFigma />,
        className: "text-red-400",
      },
      description:
        "Designing the UI/UX of my projects is one of my favorite things to do. I use Figma for that.",
      className: "hover:shadow-md duration-500 hover:shadow-red-400/40",
    },
    {
      rank: 4,
      name: "Python",
      icon: {
        icon: <TbBrandPython />,
        className: "text-yellow-400",
      },
      description:
        "I currently learn Python for Machine Learning and AI. I found AI are helpful for the world and I want to contribute to it.",
      className: "hover:shadow-md duration-500 hover:shadow-yellow-400/40",
    },
  ];
  return (
    <section className="container mx-auto py-24 space-y-4" id="skills">
      <h1 className="text-center font-bold text-4xl">Skills</h1>
      <div className="flex flex-wrap justify-center gap-4">
        {skills.map((skill, index) => (
          <SkillCard {...skill} key={index} />
        ))}
      </div>
      <div className="flex justify-center space-x-1">
        <p>Intrested in my skills and what I've learned?</p>
        <Link
          href={"/skills"}
          className="hover:underline font-bold hover:animate-pulse"
        >
          Explore More
        </Link>
      </div>
    </section>
  );
};

export default SkillSection;
