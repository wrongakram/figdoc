import { createContext, useMemo, useContext } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((res) => res.json());

const ProfileContext = createContext({});

export const ProfileProvider = ({ children }) => {
  const { data, error } = useSWR(
    "http://localhost:3000/api/getFigmaToken",
    fetcher
  );

  if (error) return <div>failed to load</div>;

  const value = useMemo(() => ({ data }), [data]);

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
