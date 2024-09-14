import { useQueryClient } from '@tanstack/react-query';

export type InheritQueryType = {
  queryKey: string[];
};

export function useInteritQuery<T>(props: InheritQueryType) {
  const qc = useQueryClient();

  return qc.getQueryData<T>(props.queryKey);
}
