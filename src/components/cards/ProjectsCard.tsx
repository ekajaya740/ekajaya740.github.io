import { ReactNode } from 'react';
import HyperUIImage from '../images/HyperUIImage';
import { BaseProjectType } from '@/lib/schemas/project';

export default function ProjectsCard(props: BaseProjectType) {
  return (
    <div className='group space-y-4'>
      <HyperUIImage
        image={{
          src: 'https://static-cse.canva.com/blob/1300375/create_Free-Mockup-Generator_desktop2.jpg',
          alt: '',
          width: 200,
          height: 200,
        }}
      />
      <div className=''>
        <div className='grid grid-cols-3 place-content-between gap-3'>
          <h3 className='font-bold text-2xl col-span-2 line-clamp-2'>
            {props.title}
          </h3>
          <p className='place-self-end self-start text-sm'>{props.period}</p>
        </div>
      </div>
    </div>
  );
  // return (
  //   <Card className='shadow-none border-2 border-black'>
  //     <CardHeader className='justify-between'>
  //       <h3 className='text-xl font-bold'>{props.title}</h3>
  //       <Chip variant='flat' size='sm'>
  //         {props.period}
  //       </Chip>
  //     </CardHeader>
  //     <CardBody className='overflow-visible p-6'>
  //       <div className='space-y-3 flex flex-col justify-center'>
  //         <Image
  //           alt={props.alt}
  //           className='object-cover rounded-lg h-full border-1 border-[#1e1e1e] p-8 max-h-72'
  //           src={props.src}
  //         />
  //         <div className='px-2'>{props.description}</div>
  //       </div>
  //     </CardBody>
  //     <CardFooter></CardFooter>
  //   </Card>
  // );
}
