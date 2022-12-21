import { createContext, useMemo, useContext } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProfileContext = createContext({});

export const ProfileProvider = ({ children }: any) => {
  const { data, error } = useSWR("/api/getProfile", fetcher);

  const value = useMemo(() => ({ data }), [data]);

  if (error) return <div>failed to load</div>;

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export function useProfileStore() {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("You forgot to wrap ProfileStoreProvider");
  }

  return context;
}
