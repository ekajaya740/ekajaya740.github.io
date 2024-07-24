import { experienceItem } from '@/lib/items/experienceItem';
import ExperienceCard from '../cards/ExperienceCard';

export default function ExperienceSection() {
  return (
    <div className='space-y-8 w-full'>
      <h2 className='text-4xl font-bold'>Experience</h2>
      <div className='space-y-4'>
        {experienceItem.map((item, index) => (
          <ExperienceCard key={index} item={{ ...item }} />
        ))}
      </div>
    </div>
  );
}
