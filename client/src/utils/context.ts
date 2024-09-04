import { createContext } from "react";

interface UserContextValue {
  userToken: string | null;
  setUserToken: (token: string | null) => void;
}

export const UserContext = createContext<UserContextValue | null>(null);
