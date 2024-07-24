import { AwardsCertificationsItemProps } from '@/lib/items/awardsCertificationsItem';
import { Chip } from '@nextui-org/react';

export type AwardsCertificationsListProps = {
  items: AwardsCertificationsItemProps[];
};

export default function AwardsCertificationsList(
  props: AwardsCertificationsListProps
) {
  return (
    <div className='flex flex-wrap justify-center gap-3'>
      {props.items.map((item, index) => (
        <Chip
          key={index}
          variant='flat'
          color={
            item.type === 'certification'
              ? 'success'
              : item.type === 'award'
              ? 'warning'
              : 'default'
          }>
          {item.title}
        </Chip>
      ))}
    </div>
  );
}
