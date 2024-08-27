import { Icon } from '@iconify/react/dist/iconify.js';
import classNames from 'classnames';
import Link from 'next/link';

export type ButtonProps = {
  icon?: string;
  title?: string;
  className?: string;
  as?: 'link';
  href?: string;
};

export default function Button(props: ButtonProps) {
  const classes = classNames(
    'inline-flex rounded-xl shadow-md p-2',
    props.className
  );

  const Children = () => (
    <>
      {props.icon && <Icon icon={props.icon} />}
      {props.title}
    </>
  );

  if (props.as === 'link') {
    return (
      <Link href={props.href ?? ''} className={classes}>
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
