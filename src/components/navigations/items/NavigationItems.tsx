import { navigationItems } from '@/lib/items/navigationItem';
import classNames from 'classnames';
import Link from 'next/link';

export type NavigationItemsType = {
  textColor?: 'dark' | 'light';
};

export default function NavigationItems(props: NavigationItemsType) {
  return (
    <div className='flex flex-col md:flex-row md:items-center gap-4 md:gap-10'>
      {navigationItems.map((item) => (
        <ul key={item.href}>
          <li>
            {/* TODO: hover effect */}
            <Link
              href={item.href}
              className={classNames({
                'text-accent':
                  props.textColor === undefined || props.textColor === 'dark',
                'text-white': props.textColor && props.textColor === 'light',
              })}>
              {item.title}
            </Link>
          </li>
        </ul>
      ))}
    </div>
  );
}
