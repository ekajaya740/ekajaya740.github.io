import { featuredProjectsItem } from '@/lib/items/featuredProjectsItem';
import ProjectsCard from '../cards/ProjectsCard';
import FeaturedProjectsCarousel from '../carousel/FeaturedProjectsCarousel';

export default function FeaturedProjectsList() {
  return (
    <div>
      <FeaturedProjectsCarousel />
    </div>
  );
}
