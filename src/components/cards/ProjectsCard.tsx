import HyperUIImage from '../images/HyperUIImage';
import { FeaturedProjectType } from '@/lib/schemas/project';
import { Link, Image } from '@nextui-org/react';

export default function ProjectsCard(props: FeaturedProjectType) {
  return (
    <Link className='flex flex-col space-y-4 w-full'>
      <div className='relative'>
        <Image
          src={props.thumbnail}
          alt={`Thumbnail of ${props.title}`}
          className='-z-10 rounded-md w-full aspect-video object-cover'
        />
        <div className='md:right-0 md:bottom-0 md:left-0 md:absolute md:bg-black/50 rounded-md w-full'>
          <div className='place-content-between gap-3 grid grid-cols-3 mt-4 md:p-8'>
            <h3 className='col-span-2 line-clamp-2 font-bold text-black text-lg md:text-2xl md:text-white'>
              {props.title}
            </h3>
            <p className='font-light text-black text-sm md:text-base md:text-white place-self-end self-start'>
              {props.period}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
