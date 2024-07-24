import {
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Chip,
  Image,
} from '@nextui-org/react';
import { ReactNode } from 'react';

export type ProjectsCardProps = {
  src: string;
  alt: string;
  title: string;
  description: ReactNode;
  period: string;
};

export default function ProjectsCard(props: ProjectsCardProps) {
  return (
    <Card className='shadow-none border-2 border-black'>
      <CardHeader className='justify-between'>
        <h3 className='text-xl font-bold'>{props.title}</h3>
        <Chip variant='flat' size='sm'>
          {props.period}
        </Chip>
      </CardHeader>
      <CardBody className='overflow-visible p-6'>
        <div className='space-y-3 flex flex-col justify-center'>
          <Image
            alt={props.alt}
            className='object-cover rounded-lg h-full border-1 border-[#1e1e1e] p-8 max-h-72'
            src={props.src}
          />
          <div className='px-2'>{props.description}</div>
        </div>
      </CardBody>
      <CardFooter></CardFooter>
    </Card>
  );
}
