import { featuredProjectsItem } from '@/lib/items/featuredProjectsItem';
import ProjectsCard from '../cards/ProjectsCard';

export default function FeaturedProjectsList() {
  return (
    <div className='grid md:grid-cols-2 gap-8'>
      {featuredProjectsItem.map((item, index) => (
        <ProjectsCard key={index} {...item} />
      ))}
    </div>
  );
}
