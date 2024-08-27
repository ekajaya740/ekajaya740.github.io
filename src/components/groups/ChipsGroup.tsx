import classNames from 'classnames';
import Chip, { ChipType } from '../chips/Chip';

export type ChipGroupType = {
  title?: string;
  titleClassName?: string;
  items: ChipType[];
};

export default function ChipsGroup(props: ChipGroupType) {
  return (
    <div className='space-y-3'>
      <p className={classNames('text-2xl font-bold', props.titleClassName)}>
        {props.title}
      </p>
      <div className='flex flex-wrap gap-2'>
        {props.items.map((item, index) => (
          <Chip {...item} key={index} />
        ))}
      </div>
    </div>
  );
}
