import HeroSection from '@/components/sections/HeroSection';

export default function Home() {
  return (
    <main>
      <HeroSection />
    </main>
  );
  // return (
  //   <main>
  //     <div className='px-4 py-8 space-y-24'>
  //       <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
  //         <div className='md:col-span-2 lg:col-span-1'>
  //           <PhotoCard />
  //         </div>
  //         <div className='md:col-span-2 flex flex-col justify-evenly space-y-10'>
  //           <ShortSummarySection />
  //           <Divider />
  //           <Divider />
  //           <ContactSection />
  //         </div>
  //       </div>
  //       <div className='flex lg:flex-row flex-col h-full items-start gap-8'>
  //         <ExperienceSection />
  //         <AdditionalInformationSection />
  //         <EducationSection />
  //       </div>
  //       <FeaturedProjectsSection />
  //     </div>
  //   </main>
  // );
}
