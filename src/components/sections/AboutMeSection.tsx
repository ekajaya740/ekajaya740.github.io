import { lora } from '@/lib/fonts/lora';
import Button from '../buttons/Button';
import classNames from 'classnames';
import ChipsGroup from '../groups/ChipsGroup';

export default function AboutMeSection() {
  const aboutMe =
    'Results-oriented full-stack developer with 3+ years of experience crafting scalable web applications. Proficient in Next.js, React, and Figma to deliver exceptional user experiences. Successfully architected and implemented a complex internal information system, including a geolocation-based absence management module. Passionate about driving innovation and creating impactful digital solutions.';
  return (
    <section>
      <div className='w-full h-full bg-secondary py-16 px-24'>
        <div className='md:rounded-md md:border md:border-white'>
          <div className='px-14 py-16 space-y-10'>
            <div className='flex justify-between items-center'>
              <h2 className='text-white font-bold text-5xl'>About Me</h2>
              <Button
                title='Look at My Resumé'
                icon='openmoji:eyes'
                className='bg-white'
              />
            </div>
            <div className='grid grid-cols-2 gap-20'>
              <div>
                <p
                  className={classNames(
                    lora.className,
                    'text-white text-xl text-justify'
                  )}>
                  {aboutMe}
                </p>
              </div>
              <div className='grid gap-10'>
                <ChipsGroup
                  title='Technical Skills'
                  titleClassName='text-white'
                  items={[
                    {
                      title: 'Next.js',
                      icon: 'logos:nextjs-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'React.js',
                      icon: 'logos:react',
                      className: 'bg-white',
                    },
                    {
                      title: 'Node.js',
                      icon: 'logos:nodejs-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'Flutter',
                      icon: 'logos:flutter',
                      className: 'bg-white',
                    },
                    {
                      title: 'Dart',
                      icon: 'logos:dart',
                      className: 'bg-white',
                    },
                    {
                      title: 'Figma',
                      icon: 'logos:figma',
                      className: 'bg-white',
                    },
                    {
                      title: 'Google Cloud',
                      icon: 'logos:google-cloud',
                      className: 'bg-white',
                    },
                    {
                      title: 'Google Maps API',
                      icon: 'logos:google-maps',
                      className: 'bg-white',
                    },
                    {
                      title: 'TypeScript',
                      icon: 'logos:typescript-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'JavaScript',
                      icon: 'logos:javascript',
                      className: 'bg-white',
                    },
                    {
                      title: 'Tailwind',
                      icon: 'logos:tailwindcss-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'Material UI',
                      icon: 'logos:material-ui',
                      className: 'bg-white',
                    },
                    {
                      title: 'HTML',
                      icon: 'logos:html-5',
                      className: 'bg-white',
                    },
                    {
                      title: 'CSS',
                      icon: 'logos:css-3',
                      className: 'bg-white',
                    },
                    {
                      title: 'Docker',
                      icon: 'logos:docker-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'Git',
                      icon: 'logos:git-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'GitHub',
                      icon: 'logos:github-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'Linux',
                      icon: 'logos:linux-tux',
                      className: 'bg-white',
                    },
                    {
                      title: 'SQL',
                      icon: 'vscode-icons:file-type-sql',
                      className: 'bg-white',
                    },
                    {
                      title: 'Strapi',
                      icon: 'logos:strapi-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'MySQL',
                      icon: 'logos:mysql-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'PostgreSQL',
                      icon: 'logos:postgresql',
                      className: 'bg-white',
                    },
                    {
                      title: 'Postman',
                      icon: 'logos:postman-icon',
                      className: 'bg-white',
                    },
                    {
                      title: 'REST API',
                      icon: 'dashicons:rest-api',
                      className: 'bg-white',
                    },
                  ]}
                />
                <ChipsGroup
                  title='Languages'
                  titleClassName='text-white'
                  items={[
                    {
                      title: 'Indonesia',
                      icon: 'twemoji:flag-indonesia',
                    },
                    { title: 'Englsh', icon: 'twemoji:flag-united-kingdom' },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
