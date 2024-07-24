import { ContactItemProps } from '@/lib/items/contactItem';
import { Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react';
import classNames from 'classnames';
import Link from 'next/link';

export type ContactCardProps = {
  item: ContactItemProps;
};

export default function ContactCard(props: ContactCardProps) {
  return (
    <Card
      isPressable
      as={Link}
      href={props.item.href}
      target='_blank'
      className={classNames(
        'shadow-none border-2 border-black w-full',
        props.item.className
      )}>
      <CardHeader>
        <div className={classNames('text-4xl', props.item.childrenClassName)}>
          {props.item.icon}
        </div>
      </CardHeader>
      <CardBody>
        <div className='h-16'></div>
      </CardBody>
      <CardFooter className='justify-between overflow-hidden py-1 absolute before:rounded-xl rounded-large bottom-1 w-[calc(100%_-_8px)] ml-1 z-10'>
        <h6 className={classNames('text-tiny', props.item.childrenClassName)}>
          {props.item.display}
        </h6>
      </CardFooter>
    </Card>
  );
}
