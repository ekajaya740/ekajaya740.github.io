import { ExperienceItemProps } from '@/lib/items/experienceItem';
import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
} from '@nextui-org/react';

export type ExperienceCardProps = {
  item: ExperienceItemProps;
};

export default function ExperienceCard(props: ExperienceCardProps) {
  return (
    <Card className='w-full shadow-none border-2 border-black'>
      <CardHeader>
        <Chip color='default'>{props.item.period}</Chip>
      </CardHeader>
      <CardBody>
        <p className='text-black/60 text-small font-medium'>
          {props.item.occupation}
        </p>
        <h2 className='font-bold text-xl'>{props.item.title}</h2>
      </CardBody>
      <CardFooter>
        <div></div>
      </CardFooter>
    </Card>
  );
}
