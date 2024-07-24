import { ReactNode } from 'react';
import { IoMail, IoLogoLinkedin, IoLogoGithub } from 'react-icons/io5';

export type ContactItemProps = {
  display: string;
  href: string;
  icon: ReactNode;
  className?: string;
  childrenClassName?: string;
};

export const contactItems: ContactItemProps[] = [
  {
    display: 'ekajaya740@gmail.com',
    href: 'mailto:ekajaya740@gmail.com',
    icon: <IoMail />,
    className: 'bg-[#1e1e1e] h-full hover:bg-[#4e4e4e]',
    childrenClassName: 'text-white',
  },
  {
    display: 'linkedin.com/ekajaya740',
    href: 'https://www.linkedin.com/in/ekajaya740/',

    icon: <IoLogoLinkedin />,
    className: 'bg-[#0300c7] h-full hover:bg-[#5c5af2]',
    childrenClassName: 'text-white',
  },
  {
    display: 'github.com/ekajaya740',
    href: 'https://github.com/ekajaya740',
    icon: <IoLogoGithub />,
    className: 'h-full hover:bg-[#bfbec4]',
  },
];
