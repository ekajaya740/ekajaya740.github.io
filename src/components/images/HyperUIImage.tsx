import Image, { ImageProps } from 'next/image';
import { ReactNode } from 'react';

export type HyperUIImageProps = {
  image: ImageProps;
  children?: ReactNode;
};

export default function HyperUIImage(props: HyperUIImageProps) {
  return (
    <div>
      <div className='block relative w-full group'>
        <span className='absolute inset-0 bg-secondary'></span>
        <div className='relative flex items-center bg-white w-full h-full transform transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2'>
          {props.children && (
            <div className='absolute grid p-4'>{props.children}</div>
          )}
          <Image
            {...props.image}
            alt={props.image.alt}
            className='w-full aspect-video object-center object-cover'
          />
        </div>
      </div>
    </div>
  );
}
