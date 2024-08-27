import Image, { ImageProps } from 'next/image';
import { ReactNode } from 'react';

export type HyperUIImageProps = {
  image: ImageProps;
  children?: ReactNode;
};

export default function HyperUIImage(props: HyperUIImageProps) {
  return (
    <div>
      <div className='group relative block'>
        <span className='absolute inset-0 bg-secondary'></span>
        <div className='relative flex h-full transform items-end bg-white transition-transform group-hover:-translate-x-2 group-hover:-translate-y-2'>
          {props.children && (
            <div className='absolute p-4 grid'>{props.children}</div>
          )}
          <Image {...props.image} alt={props.image.alt} className='w-full' />
        </div>
      </div>
    </div>
  );
}
