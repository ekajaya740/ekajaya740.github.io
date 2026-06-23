import { useQuery } from "@tanstack/react-query";
import { useApiClient } from "./blog";
import { usersCount } from "@ekajaya/http";

export function useUsersCount() {
  const client = useApiClient();
  return useQuery({
    queryKey: ["users", "count"],
    queryFn: () => usersCount(client),
  });
}
