import FeaturedProjectsList from '../lists/FeaturedProjectsList';

export default function FeaturedProjectsSection() {
  return (
    <section className='w-full'>
      <div className='space-y-6 md:space-y-10 px-36 py-16 w-full'>
        <div className='flex justify-between items-start w-full'>
          <h2 className='font-bold text-4xl'>
            Featured
            <br />
            Projects
          </h2>
          {/* <ResumeButton /> */}
        </div>
        <FeaturedProjectsList />
      </div>
    </section>
  );
}
