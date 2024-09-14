'use client';

import { featuredProjectsItem } from '@/lib/items/featuredProjectsItem';
import ProjectsCard from '../cards/ProjectsCard';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Button } from '@nextui-org/react';
import { Icon } from '@iconify/react/dist/iconify.js';
import { useCallback } from 'react';

export default function FeaturedProjectsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay()]);

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  return (
    <div className='space-y-4'>
      <div className='flex justify-end space-x-3'>
        <Button isIconOnly color='secondary' onPress={scrollPrev}>
          <Icon icon={'ion:chevron-back-circle-outline'} />
        </Button>
        <Button isIconOnly color='secondary' onPress={scrollNext}>
          <Icon icon={'ion:chevron-forward-circle-outline'} />
        </Button>
      </div>
      <div className='embla' ref={emblaRef}>
        <div className='embla__container'>
          {featuredProjectsItem.map((item, index) => (
            <div className='px-4 embla__slide'>
              <ProjectsCard {...item} key={index} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
