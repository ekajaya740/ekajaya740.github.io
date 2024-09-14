'use client';

import { Button, Link } from '@nextui-org/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { contacts } from '@/lib/static/about-me';
import { twMerge } from 'tailwind-merge';
import clsx from 'clsx';

export type ContactButtonGroupProps = {
  hideTitle?: boolean;
  titleOrientation?: 'horizontal' | 'vertical';
  titleClassName?: string;
};

export default function ContactButtonGroup(props: ContactButtonGroupProps) {
  return (
    <div
      className={twMerge(
        clsx('flex gap-x-4 gap-y-2', {
          'items-center':
            props.titleOrientation === undefined ||
            props.titleOrientation === 'horizontal',
          'flex-col':
            props.titleOrientation && props.titleOrientation === 'vertical',
        }),
        props.titleClassName
      )}>
      {props.hideTitle ? (
        <></>
      ) : (
        <p className='sm:block hidden font-bold text-xl'>Get in touch</p>
      )}
      <div className='space-x-4'>
        {contacts.map((item, index) => (
          <Button
            size='lg'
            color='secondary'
            key={index}
            title={item.name}
            as={Link}
            isIconOnly
            className={'text-2xl'}>
            <Icon icon={item.icon} />
          </Button>
        ))}
      </div>
    </div>
  );
}
