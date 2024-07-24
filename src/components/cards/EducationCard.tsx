import { EducationItemProps } from '@/lib/items/educationItem';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from '@nextui-org/react';

export type EducationCardProps = {
  item: EducationItemProps;
};

export default function EducationCard(props: EducationCardProps) {
  return (
    <Card className='w-full shadow-none border-2 border-black'>
      <CardHeader>
        <Chip color='default'>{props.item.period}</Chip>
      </CardHeader>
      <CardBody>
        <div className='space-y-2'>
          <div className='space-y-1'>
            <p className='text-black/60 text-small font-medium'>
              {props.item.occupation}
            </p>
            <h2 className='font-bold text-xl'>{props.item.title}</h2>
          </div>
          {props.item.description}
        </div>
      </CardBody>
      <CardFooter>
        <div></div>
      </CardFooter>
    </Card>
  );
}
