import React from "react";
import { UserContext } from "../components/Providers/UserProvider";
export function useAuth() {
  return React.useContext(UserContext);
}

export default useAuth;
