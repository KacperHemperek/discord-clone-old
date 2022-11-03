import React, { createContext, useContext } from "react";
import { NavContext } from "../pages/_app";

function useNav() {
  return useContext(NavContext);
}

export default useNav;
