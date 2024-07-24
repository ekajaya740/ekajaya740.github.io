import { TechnicalSkillsItemProps } from '@/lib/items/technicalSkillsItem';
import { Chip } from '@nextui-org/react';

export type TechnicalSkillsProps = {
  items: TechnicalSkillsItemProps[];
};

export default function TechnicalSkillsList(props: TechnicalSkillsProps) {
  return (
    <div className='flex flex-wrap justify-center gap-3'>
      {props.items.map((item, index) => (
        <Chip key={index} variant='dot' color='warning'>
          {item.title}
        </Chip>
      ))}
    </div>
  );
}
