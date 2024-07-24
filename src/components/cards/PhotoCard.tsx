import { Card, CardFooter, CardHeader, Image } from '@nextui-org/react';

export default function PhotoCard() {
  return (
    <Card className='h-full shadow-none'>
      <CardHeader className='absolute z-10 top-1 flex-col !items-start'>
        <p className='text-small md:text-large text-white/60 font-medium'>
          Hi, My name is
        </p>
        <h4 className='text-white font-bold md:text-3xl'>
          I Putu Ekajaya Awidya Putra
        </h4>
      </CardHeader>
      <Image
        src='/myself.webp'
        alt=''
        removeWrapper
        className='z-0 w-full h-full object-cover brightness-50 border-2 border-black'
      />
      <CardFooter className='justify-between overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] ml-1 z-10'>
        <p className='text-tiny text-white/80'>Love to code for you!</p>
      </CardFooter>
    </Card>
  );
}
