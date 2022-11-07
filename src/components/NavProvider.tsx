import { useRouter } from "next/router";
import { createContext, useEffect, useState } from "react";

interface InitialNavContextType {
  navOpen: boolean;
  setNav: (...args: any) => void;
  channelId: number | null;
  setChannelId: (value: number) => void;
}

const initialNavContext: InitialNavContextType = {
  navOpen: false,
  setNav: (value: boolean) => {},
  channelId: null,
  setChannelId: (value: number) => {},
};

export const NavContext =
  createContext<InitialNavContextType>(initialNavContext);

const NavProvider = ({ children }: { children: React.ReactNode }) => {
  const [navOpen, setNavOpen] = useState(false);
  const [channelId, setChannelId] = useState<number | null>(null);
  const router = useRouter();

  useEffect(() => {
    setNavOpen(false);
    if (router.query.slug) {
      setChannelId(Number(router.query.slug));
    } else {
      setChannelId(null);
    }
  }, [router.asPath]);

  return (
    <NavContext.Provider
      value={{
        navOpen,
        setNav: (value: boolean) => {
          setNavOpen(value);
        },
        channelId,
        setChannelId: (value: number) => setChannelId(value),
      }}
    >
      {children}
    </NavContext.Provider>
  );
};

export default NavProvider;
