import Image from 'next/image';
import ContactButtonGroup from '../groups/ContactButtonGroup';
import DisplayLocationGroup from '../groups/DisplayLocationGroup';
import { ButtonProps } from '../buttons/Button';

export default function HeroSection() {
  const contactsItems: ButtonProps[] = [
    {
      icon: 'line-md:github-loop',
      className: 'bg-github text-white',
      as: 'link',
    },
    {
      icon: 'line-md:linkedin',
      className: 'bg-linkedin text-white',
      as: 'link',
    },
    {
      icon: 'material-symbols:mail',
      as: 'link',
      className: 'bg-white',
    },
  ];

  return (
    <section className='relative h-full'>
      <div className='hidden md:grid z-10 absolute h-full w-full grid-cols-2 px-6 items-end py-6'>
        <ContactButtonGroup items={contactsItems} />
        <DisplayLocationGroup />
      </div>
      <div className='md:hidden grid z-10 absolute h-full w-full px-6 py-3 items-end place-items-center'>
        <div className='w-fit'>
          <ContactButtonGroup hideTitle items={contactsItems} />
        </div>
      </div>
      <div className='px-6 md:px-0'>
        <div className='flex flex-col items-center -space-y-6 md:-space-y-16'>
          <div className='space-y-2 md:space-y-4 '>
            <p className='text-xs md:text-lg text-center'>
              Hi, My name is <span className='font-bold'>Ekajaya</span> and{' '}
              {"I'm"} a
            </p>
            <h1 className='font-bold text-2xl sm:text-6xl xl:text-8xl text-center leading-normal'>
              Fullstack <span className='text-white text-stroke'>Website</span>
              <br /> & <span className='text-white text-stroke'>
                Mobile
              </span>{' '}
              Developer
            </h1>
          </div>
          <Image
            src='/me.webp'
            alt='A potrait of myself'
            width={520}
            height={520}
            className='grayscale'
          />
        </div>
      </div>
    </section>
  );
}
