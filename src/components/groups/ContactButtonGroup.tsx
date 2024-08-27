import classNames from 'classnames';
import Button, { ButtonProps } from '../buttons/Button';

export type ContactButtonGroupProps = {
  items: ButtonProps[];
  hideTitle?: boolean;
};

export default function ContactButtonGroup(props: ContactButtonGroupProps) {
  return (
    <div className='space-y-3'>
      {props.hideTitle ? (
        <></>
      ) : (
        <p className='font-bold text-xl'>Get In Touch</p>
      )}
      <div className='flex gap-x-4'>
        {props.items.map((item, index) => (
          <Button
            key={index}
            {...item}
            className={classNames('text-2xl', item.className)}
          />
        ))}
      </div>
    </div>
  );
}
