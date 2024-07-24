import { disconnect } from 'process';
import ShortSummaryCard from '../cards/ShortSummaryCard';

export default function ShortSummarySection() {
  return (
    <div className='space-y-4'>
      <h2 className='text-4xl font-bold'>Short Summary</h2>
      <ShortSummaryCard />
    </div>
  );
}
