import { lora } from '@/lib/fonts/lora';
import ChipsGroup from '../groups/ChipsGroup';

import { Icon } from '@iconify/react/dist/iconify.js';
import { languages, techStacks } from '@/lib/static/about-me';
import clsx from 'clsx';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export default function AboutMeSection() {
  const ResumeButton = () => (
    <Button color='primary' className='dark' as={Link} href='/resume'>
      <Icon icon={'openmoji:eyes'} /> Look at My Resumé
    </Button>
  );

  const aboutMe =
    'Results-oriented full-stack developer with 3+ years of experience crafting scalable web applications. Proficient in Next.js, React, and Figma to deliver exceptional user experiences. Successfully architected and implemented a complex internal information system, including a geolocation-based absence management module. Passionate about driving innovation and creating impactful digital solutions.';
  return (
    <section>
      <div className='bg-secondary px-2 md:px-24 py-16 w-full h-full'>
        <div className='md:border-white md:border md:rounded-md'>
          <div className='space-y-6 md:space-y-10 px-8 md:px-14 py-4 md:py-16'>
            <div className='flex justify-between items-center'>
              <h2 className='font-bold text-4xl text-white md:text-5xl'>
                About Me
              </h2>
              <div className='md:block hidden'>
                <ResumeButton />
              </div>
            </div>
            <div className='gap-20 grid lg:grid-cols-2'>
              <div>
                <p
                  className={clsx(
                    lora.className,
                    'text-white text-xl text-justify'
                  )}>
                  {aboutMe}
                </p>
              </div>
              <div className='gap-10 grid'>
                <ChipsGroup
                  title='Technical Skills'
                  titleClassName='text-white font-bold text-xl'
                  items={techStacks.map((item) => ({
                    children: item.name,
                    startContent: <Icon icon={item.icon} />,
                  }))}
                />
                <ChipsGroup
                  title='Languages'
                  titleClassName='text-white font-bold text-xl'
                  items={languages.map((item) => ({
                    children: item.name,
                    startContent: <Icon icon={item.icon} />,
                  }))}
                />
              </div>
              <div className='flex justify-center items-center md:hidden'>
                <ResumeButton />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
