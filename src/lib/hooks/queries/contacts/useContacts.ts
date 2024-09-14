import { getAllContacts } from '@/lib/requests/contacts/getAll';
import { useQuery } from '@tanstack/react-query';

export default function useQueryContacts() {
  return useQuery({
    queryKey: ['contacts'],
    queryFn: getAllContacts,
  });
}
