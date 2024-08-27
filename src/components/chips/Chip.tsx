import { Icon } from '@iconify/react/dist/iconify.js';
import classNames from 'classnames';

export type ChipType = {
  className?: string;
  title?: string;
  icon?: string;
};

export default function Chip(props: ChipType) {
  const Children = () => (
    <>
      {props.icon && <Icon icon={props.icon} />}
      {props.title}
    </>
  );

  return (
    <div
      className={classNames(
        'p-2 inline-flex items-center gap-3 rounded-xl text-xs',
        props.className,
        'bg-white'
      )}>
      <Children />
    </div>
  );
}
