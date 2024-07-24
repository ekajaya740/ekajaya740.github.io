import { ProjectsCardProps } from '@/components/cards/ProjectsCard';

export const featuredProjectsItem: ProjectsCardProps[] = [
  {
    title: 'Story Kami',
    src: '/projects/1.webp',
    alt: 'Preview Story Kami',
    description: (
      <ul className='list-disc list-inside'>
        <li>Designing event invitation for website themes with Figma.</li>
        <li>Implementing website front-end design with Next.js framework.</li>
        <li>
          Implementing and integrating Next.js front-end with Strapi CMS REST
          API.
        </li>
      </ul>
    ),
    period: 'Jun 2024 - Present',
  },
  {
    title: 'Sistem Informasi Konveksi CV. Khris Production',
    src: '/projects/2.webp',
    alt: 'Preview Sistem Informasi Konveksi CV. Khris Production',
    description: (
      <ul className='list-disc list-inside'>
        <li>Designed website wireframe and interface with Figma.</li>
        <li>Implemented website design with Next.js framework.</li>
        <li>
          Integrated Golang Fiber framework based REST API with the front-end.
        </li>
        <li>Collaborated with team in organization with GitHub.</li>
        <li>
          Set up CI/CD with GitHub Actions and deploy the front-end website to
          Google Cloud Artifact Registry and Cloud Run services.
        </li>
      </ul>
    ),
    period: 'Jan 2024 - May 2024',
  },
  {
    title: 'Legong Kraton',
    src: '/projects/3.webp',
    alt: 'Preview Legong Kraton',
    description: (
      <ul className='list-disc list-inside'>
        <li>Designing website interface with Figma.</li>
        <li>Implementing website design with Next.js framework.</li>
        <li>Integrating Ruby on Rails based REST API with the front-end.</li>
        <li>
          Integrating Google Maps JavaScript API as form with React Hook Form to
          get location coordinates.
        </li>
        <li>
          Integrating selfie and geolocation for workers attendance feature.
        </li>
      </ul>
    ),
    period: 'Nov 2023 - Present',
  },
  {
    title: 'M2 Monorepo',
    src: '/projects/4.webp',
    alt: 'Preview M2 Monorepo',
    description: (
      <ul className='list-disc list-inside'>
        <li>
          Re-implemented and updated old website from separated project to
          Turborepo.
        </li>
        <li>Integraed custom REST API with the front-end. </li>
      </ul>
    ),
    period: 'May - Jun 2023',
  },
];
