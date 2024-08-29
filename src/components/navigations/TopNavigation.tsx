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
import {
  NavigationItemProps,
  navigationItems,
} from '@/lib/items/navigationItem';
import classNames from 'classnames';
import Image from 'next/image';
import { useToggle } from '@uidotdev/usehooks';
import { Icon } from '@iconify/react';
import NavigationItems from './items/NavigationItems';

export type TopNavigationProps = {
  items: NavigationItemProps[];
};

export default function TopNavigation() {
  const [on, toggle] = useToggle(false);

  return (
    <nav className='sticky top-0 z-[9999] py-6 px-6 bg-primary'>
      <div className='flex items-center justify-between'>
        <Image
          src={'/logo.svg'}
          alt='Work of Ekajaya Logo'
          width={64}
          height={64}
        />
        <div className='hidden md:block'>
          <NavigationItems />
        </div>
        {/* TODO: add button effect */}
        <button
          onClick={() => {
            toggle();
          }}
          className='block md:hidden'>
          <Icon icon='charm:menu-hamburger' className='text-3xl' />
        </button>
      </div>
      {/* TODO: add animation */}
      <div className={classNames({ hidden: !on, block: on })}>
        <NavigationItems />
      </div>
    </nav>
  );
}

// export default function TopNavigation(props: TopNavigationProps) {
//   const [isMenuOpen, setIsMenuOpen] = React.useState(false);

//   const pathname = usePathname();

//   console.log(pathname.includes('/'));
//   return (
//     <Navbar
//       onMenuOpenChange={setIsMenuOpen}
//       className='bg-white border-b-1 border-black'
//       maxWidth='2xl'>
//       <NavbarContent justify='center'>
//         <NavbarBrand>
//           <Logo />
//         </NavbarBrand>
//       </NavbarContent>

//       {/* <NavbarContent className='hidden sm:flex gap-4' justify='end'>
//         {props.items.map((item, index) => (
//           <NavbarItem key={`${item}-${index}`}>
//             <Link
//               color={'foreground'}
//               className={classNames('w-full', {
//                 'font-bold': pathname === item.href,
//               })}
//               href={item.href}
//               size='lg'>
//               {item.title}
//             </Link>
//           </NavbarItem>
//         ))}
//       </NavbarContent>
//       <NavbarContent justify='end' className='sm:hidden flex'>
//         <NavbarMenuToggle
//           aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
//           className='sm:hidden text-black'
//         />
//       </NavbarContent> */}
//       {/* <NavbarMenu>
//         {props.items.map((item, index) => (
//           <NavbarMenuItem key={`${item}-${index}`}>
//             <Link
//               color={'foreground'}
//               className={classNames('w-full', {
//                 'font-bold': pathname === item.href,
//               })}
//               href={item.href}
//               size='lg'>
//               {item.title}
//             </Link>
//           </NavbarMenuItem>
//         ))}
//       </NavbarMenu> */}
//     </Navbar>
//   );
// }
