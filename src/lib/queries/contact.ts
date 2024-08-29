import { useQuery } from '@tanstack/react-query';
import { getContacts } from '../requests/contact';

export default function useQueryContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getContacts,
  });
}
