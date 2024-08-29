import { Icon } from '@iconify/react/dist/iconify.js';
import classNames from 'classnames';
import Link, { LinkProps } from 'next/link';
import { ReactNode } from 'react';

export type ButtonProps = {
  icon?: string;
  title: string;
  hideTitle?: boolean;
  className?: string;
  as?: 'link';
  linkProps: LinkProps;
};

export default function Button(props: ButtonProps) {
  const classes = classNames(
    'inline-flex rounded-xl shadow-md p-2 items-center gap-3',
    props.className,
    'bg-white'
  );

  const Children = () => (
    <>
      {props.icon && <Icon icon={props.icon} />}
      <span className={props.hideTitle ? 'hidden' : 'block'}>
        {props.title}
      </span>
    </>
  );

  if (props.as === 'link') {
    return (
      <Link {...props.linkProps} className={classes}>
        <Children />
      </Link>
    );
  }

  return (
    <button className={classes}>
      <Children />
    </button>
  );
}
