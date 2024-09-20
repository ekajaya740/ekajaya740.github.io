'use client';

import Image from 'next/image';
import ContactButtonGroup from '../groups/ContactButtonGroup';
import { navigationItems } from '@/lib/items/navigationItem';
import { Link } from '@nextui-org/react';

export default function Footer() {
  const copyright = `Copyright © ${new Date(
    Date.now()
  ).getFullYear()} Work of Ekajaya`;

  return (
    <footer className='bottom-0 space-y-8 bg-secondary p-8 w-full'>
      <div className='gap-4 grid md:grid-cols-2 w-full'>
        <Image
          src='/logo_dark.svg'
          alt='Work of Ekajaya Logo'
          width={64}
          height={64}
        />
        <div className='block md:hidden'>
          <ContactButtonGroup hideTitle color='primary' />
        </div>
        <div className='space-y-4 md:place-self-end'>
          <p className='font-bold text-white text-xl'>Explore Site</p>
          <div className='space-x-4'>
            {navigationItems.map((item) => (
              <Link href={item.href}>{item.title}</Link>
            ))}
          </div>
        </div>
        <div className='md:block hidden'>
          <ContactButtonGroup hideTitle color='primary' />
        </div>
        <p className='md:block hidden font-thin text-sm text-white place-self-end'>
          {copyright}
        </p>
      </div>
      <p className='block md:hidden w-full font-thin text-center text-white text-xs'>
        {copyright}
      </p>
    </footer>
  );
}
