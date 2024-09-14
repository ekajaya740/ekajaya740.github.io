import AboutMeSection from '@/components/sections/AboutMeSection';
import FeaturedProjectsSection from '@/components/sections/FeaturedProjectsSection';
import HeroSection from '@/components/sections/HeroSection';
import Head from 'next/head';

export default function Home() {
  return (
    <>
      <Head>
        <title>Hello 👋 | Work of Ekajaya</title>
      </Head>
      <main>
        <HeroSection />
        <AboutMeSection />
        <FeaturedProjectsSection />
      </main>
    </>
  );
}
