import React from 'react';
import { Image } from '@nextui-org/react';

export default function Logo() {
  return (
    <Image
      src='/logo.svg'
      alt='Work of Ekajaya Logo'
      width={64}
      height={64}
      className='w-8 sm:w-64'
    />
  );
}
