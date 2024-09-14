'use client';

import React, { useState } from 'react';
import {
  Link,
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
  NavbarMenu,
  NavbarMenuToggle,
} from '@nextui-org/react';
import Logo from '../logo/Logo';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export type NavigationItemProps = {
  title: string;
  href: string;
};

export type TopNavigationProps = {
  items: NavigationItemProps[];
};

export default function TopNavigation(props: TopNavigationProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <Navbar
      maxWidth='2xl'
      className='bg-primary sm:py-4'
      shouldHideOnScroll
      onMenuOpenChange={setIsMenuOpen}>
      <NavbarBrand>
        <Logo />
      </NavbarBrand>
      <NavbarContent justify='end' className='sm:flex hidden'>
        {props.items.map((item) => (
          <NavbarItem key={item.href}>
            <Link href={item.href} className='text-[00BFFF]'>
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>
      <NavbarMenuToggle
        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
        className='sm:hidden'
      />
      <NavbarMenu className='bg-primary'>
        {props.items.map((item) => (
          <NavbarItem key={item.href}>
            <Link href={item.href} className='text-[00BFFF]'>
              {item.title}
            </Link>
          </NavbarItem>
        ))}
      </NavbarMenu>
    </Navbar>
  );
}
