import FeaturedProjectsList from '../lists/FeaturedProjectsList';

export default function FeaturedProjectsSection() {
  return (
    <section className='w-full'>
      <div className='space-y-6 md:space-y-10 px-2 md:px-24 py-16 w-full h-full'>
        <div className='flex justify-between items-start px-8 py-4 w-full'>
          <h2 className='font-bold text-4xl'>Featured Projects</h2>
        </div>
        <FeaturedProjectsList />
      </div>
    </section>
  );
}
