import { Chip, ChipProps } from '@nextui-org/react';
import { twMerge } from 'tailwind-merge';

export type ChipsGroupProps = {
  items: ChipProps[];
  title?: string;
  titleClassName?: string;
};

export default function ChipsGroup(props: ChipsGroupProps) {
  return (
    <div className='space-y-3'>
      <p className={twMerge(props.titleClassName)}>{props.title}</p>
      <div className='flex flex-wrap gap-2'>
        {props.items.map((item, index) => (
          <Chip key={index} {...item} color='primary' variant='flat' />
        ))}
      </div>
    </div>
  );
}
