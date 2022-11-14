import { createContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

import { noop } from "@helpers/noop";

interface InitialNavContextType {
  navOpen: boolean;
  setNav: (...args: any) => void;
  channelId: number | null;
  setChannelId: (...args: any) => void;
}

const initialNavContext: InitialNavContextType = {
  navOpen: false,
  /* tslint:disable:no-empty */
  setNav: () => {
    noop();
  },
  channelId: null,
  /* tslint:disable:no-empty */
  setChannelId: () => {
    noop();
  },
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
  }, [router.query.slug]);

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
