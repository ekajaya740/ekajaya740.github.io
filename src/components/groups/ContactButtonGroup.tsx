'use client';

import classNames from 'classnames';
import Button, { ButtonProps } from '../buttons/Button';
import queryContacts from '@/lib/queries/contact';

export type ContactButtonGroupProps = {
  classNames?: string[];
  hideTitle?: boolean;
};

export default function ContactButtonGroup(props: ContactButtonGroupProps) {
  const contacts = queryContacts();

  console.log(props.classNames && props.classNames[0]);

  return (
    <div className='space-y-3'>
      {props.hideTitle ? (
        <></>
      ) : (
        <p className='font-bold text-xl'>Get In Touch</p>
      )}
      <div className='flex gap-x-4'>
        {contacts.data?.map((item, index) => (
          <Button
            key={index}
            title={item.name}
            as='link'
            hideTitle
            linkProps={{
              href: item.href,
            }}
            icon={item.icon}
            className={classNames(
              'text-2xl',
              props.classNames && props.classNames[0]
            )}
          />
        ))}
      </div>
    </div>
  );
}
