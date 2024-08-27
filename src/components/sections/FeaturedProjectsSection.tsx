import Button from '../buttons/Button';
import FeaturedProjectsList from '../lists/FeaturedProjectsList';

export default function FeaturedProjectsSection() {
  const ResumeButton = () => (
    <Button
      title='More Projects'
      icon='material-symbols-light:computer'
      className='bg-white'
    />
  );

  return (
    <section className='w-full'>
      <div className='px-36 py-16 space-y-6 md:space-y-10 w-full'>
        <div className='flex items-start justify-between w-full'>
          <h2 className='text-4xl font-bold '>
            Featured
            <br />
            Projects
          </h2>
          <ResumeButton />
        </div>
        <FeaturedProjectsList />
      </div>
    </section>
  );
}
