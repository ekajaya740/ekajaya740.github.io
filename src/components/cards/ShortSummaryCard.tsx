import { Card, CardBody, CardHeader } from '@nextui-org/react';

export default function ShortSummaryCard() {
  return (
    <Card className='shadow-none border-2 border-black h-full'>
      <CardHeader>
        <h1 className='text-xl font-bold'>Programmer based in Bali</h1>
      </CardHeader>
      <CardBody>
        <p>
          I am a programmer with 3 years of experience in developing web
          applications with Next.js and native cross-platform Flutter
          frameworks. Experienced with cloud-based serverless environments,
          especially with Google Cloud and Vercel, continuous integration and
          delivery with GitHub Action, designing user interfaces, and experience
          with Figma, and has some skills in operating Unix-based operating
          systems like Linux for software development purposes. I love to
          explore the software development world to increase my developer
          experience. Capable of working in a team and has good English skills.
        </p>
      </CardBody>
    </Card>
  );
}
