import { useContext } from "react";

import { NavContext } from "@components/Providers/NavProvider";

function useNav() {
  return useContext(NavContext);
}

export default useNav;
