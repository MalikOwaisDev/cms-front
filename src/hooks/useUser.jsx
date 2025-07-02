import { useQuery } from "@tanstack/react-query";
import { getMe } from "../services/auth";

const fetchUser = async () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No token");
  const res = await getMe(token);
  return res.data;
};

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: fetchUser,
    retry: false, // Don't retry on unauthorized
    staleTime: 1000 * 60 * 60, // Cache the data for 30 minutes
    cacheTime: 1000 * 60 * 10, // Cache for an hour to prevent refetching on every component mount
  });
};
