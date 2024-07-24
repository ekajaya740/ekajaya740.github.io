import EducationCard from '../cards/EducationCard';
import { educationItem } from '@/lib/items/educationItem';

export default function EducationSection() {
  return (
    <div className='space-y-8 w-full'>
      <h2 className='text-4xl font-bold'>Education</h2>
      <div className='space-y-4'>
        {educationItem.map((item, index) => (
          <EducationCard key={index} item={{ ...item }} />
        ))}
      </div>
    </div>
  );
}
