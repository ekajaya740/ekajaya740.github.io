import { Divider } from '@nextui-org/react';
import TechnicalSkillsList from '../lists/TechnicalSkillsList';
import { technicalSkillsItem } from '@/lib/items/technicalSkillsItem';
import LanguagesList from '../lists/LanguagesList';
import AwardsCertificationsList from '../lists/AwardsCertificationsList';
import { awardsCertificationsItem } from '@/lib/items/awardsCertificationsItem';

export type AdditionalInformationProps = {};

export default function AdditionalInformationSection() {
  return (
    <div className='w-full space-y-8'>
      <div className='space-y-4'>
        <h2 className='text-4xl font-bold text-center'>Technical Skills</h2>
        <TechnicalSkillsList items={technicalSkillsItem} />
      </div>
      <Divider />
      <div className='space-y-4'>
        <h2 className='text-4xl font-bold text-center'>Languages</h2>
        <LanguagesList />
      </div>
      {/* <Divider /> */}
      {/* <div className='space-y-4'>
        <h2 className='text-4xl font-bold text-center'>
          Awards & Certifications
        </h2>
        <AwardsCertificationsList items={awardsCertificationsItem} />
      </div> */}
    </div>
  );
}
