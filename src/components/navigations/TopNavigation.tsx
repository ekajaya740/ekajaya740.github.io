'use client';

import React from 'react';
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle,
  NavbarMenu,
  NavbarMenuItem,
  Link,
} from '@nextui-org/react';
import Logo from '../logo/Logo';
import { usePathname } from 'next/navigation';
import { NavigationItemProps } from '@/lib/items/navigationItem';
import classNames from 'classnames';

export type TopNavigationProps = {
  items: NavigationItemProps[];
};

export default function TopNavigation(props: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  const pathname = usePathname();

  console.log(pathname.includes('/'));
  return (
    <Navbar
      onMenuOpenChange={setIsMenuOpen}
      className='bg-white border-b-1 border-black'
      maxWidth='2xl'>
      <NavbarContent justify='start'></NavbarContent>
      <NavbarContent justify='start'>
        <NavbarBrand>
          <Logo />
        </NavbarBrand>
      </NavbarContent>

      {/* <NavbarContent className='hidden sm:flex gap-4' justify='end'>
        {props.items.map((item, index) => (
          <NavbarItem key={`${item}-${index}`}>
            <Link
              color={'foreground'}
              className={classNames('w-full', {
                'font-bold': pathname === item.href,
              })}
              href={item.href}
              size='lg'>
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarContent justify='end' className='sm:hidden flex'>
        <NavbarMenuToggle
          aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          className='sm:hidden text-black'
        />
      </NavbarContent> */}
      {/* <NavbarMenu>
        {props.items.map((item, index) => (
          <NavbarMenuItem key={`${item}-${index}`}>
            <Link
              color={'foreground'}
              className={classNames('w-full', {
                'font-bold': pathname === item.href,
              })}
              href={item.href}
              size='lg'>
              {item.title}
            </Link>
          </NavbarMenuItem>
        ))}
      </NavbarMenu> */}
    </Navbar>
  );
}