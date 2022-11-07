import React, { createContext, useContext } from "react";
import { NavContext } from "../components/NavProvider";

function useNav() {
  return useContext(NavContext);
}

export default useNav;
