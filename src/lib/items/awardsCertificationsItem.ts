export type AwardsCertificationsItemProps = {
  type: 'certification' | 'award';
  title: string;
};

export const awardsCertificationsItem: AwardsCertificationsItemProps[] = [
  {
    type: 'certification',
    title: 'Certified Programmer (CPro)',
  },
  {
    type: 'certification',
    title: 'Test of English as Foreign Language (TOEFL) - Score: 453',
  },
  {
    type: 'award',
    title: '3rd Place in The Last Competition App Development (2022)',
  },
  {
    type: 'award',
    title: '3rd Place in STIKOMFEST Capture The Flag (2020)',
  },
  {
    type: 'award',
    title: '3rd Place in ITCC Udayana Programming Competition (2019)',
  },
];
