import { Icon } from '@iconify/react/dist/iconify.js';
import Image from 'next/image';

export default function DisplayLocationGroup() {
  return (
    <div className='grid place-items-end gap-2'>
      <Image
        src={'/bali-island.svg'}
        alt='Bali island'
        width={80}
        height={80}
      />
      <div className='flex gap-1 items-end '>
        <Icon icon='carbon:location-filled' className='text-3xl' />
        <p className='text-xl'>Based in Bali</p>
      </div>
    </div>
  );
}
