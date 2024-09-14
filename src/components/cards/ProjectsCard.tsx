import HyperUIImage from '../images/HyperUIImage';
import { BaseProjectType } from '@/lib/schemas/project';
import { Link } from '@nextui-org/react';

export default function ProjectsCard(props: BaseProjectType) {
  return (
    <Link className='flex flex-col space-y-4 w-full group' href={props.href}>
      <HyperUIImage
        image={{
          src: 'https://static-cse.canva.com/blob/1300375/create_Free-Mockup-Generator_desktop2.jpg',
          alt: '',
          width: 200,
          height: 200,
        }}
      />
      <div className='w-full'>
        <div className='place-content-between gap-3 grid grid-cols-3'>
          <h3 className='col-span-2 line-clamp-2 font-bold text-2xl'>
            {props.title}
          </h3>
          <p className='font-light text-sm place-self-end self-start'>
            {props.period}
          </p>
        </div>
      </div>
    </Link>
  );
}
