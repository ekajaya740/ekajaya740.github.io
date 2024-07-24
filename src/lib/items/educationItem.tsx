import { ReactNode } from 'react';

export type EducationItemProps = {
  period: string;
  title: string;
  occupation: string;
  description: ReactNode;
};

export const educationItem: EducationItemProps[] = [
  {
    title: 'Bachelor of Computer Science',
    period: '2020 - 2024',
    occupation: 'Stikom Bali Technology and Business Institute',
    description: (
      <ul className='list-disc list-inside'>
        <li>Specialization in Information System.</li>
        <li>GPA 3.79 (out of 4).</li>
        <li>
          Thesis title: Website-based Confection Information System for CV.
          Khris Production.
        </li>
      </ul>
    ),
  },
];
