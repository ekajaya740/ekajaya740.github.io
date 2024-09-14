import Image from 'next/image';
import ContactButtonGroup from '../groups/ContactButtonGroup';
import DisplayLocationGroup from '../groups/DisplayLocationGroup';

export default function HeroSection() {
  return (
    <section className='relative h-full'>
      <div className='z-10 absolute items-end hidden md:grid grid-cols-2 px-6 py-6 w-full h-full'>
        <ContactButtonGroup titleOrientation='vertical' />
        <DisplayLocationGroup />
      </div>
      <div className='z-10 absolute items-end place-items-center md:hidden grid px-6 py-3 w-full h-full'>
        <div className='w-fit'>
          <ContactButtonGroup hideTitle />
        </div>
      </div>
      <div className='px-6 md:px-0'>
        <div className='flex flex-col items-center -space-y-6 md:-space-y-16'>
          <div className='space-y-2 md:space-y-4'>
            <p className='text-center text-xs md:text-lg'>
              Hi, My name is <span className='font-bold'>Ekajaya</span> and{' '}
              {"I'm"} a
            </p>
            <h1 className='font-bold text-2xl text-center sm:text-6xl xl:text-8xl leading-normal'>
              Fullstack <span className='text-stroke text-white'>Website</span>
              <br /> & <span className='text-stroke text-white'>
                Mobile
              </span>{' '}
              Developer
            </h1>
          </div>
          <Image
            src='/me.webp'
            alt='A potrait of myself'
            width={560}
            height={560}
            className='grayscale'
          />
        </div>
      </div>
    </section>
  );
}
