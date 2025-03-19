import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

// Custom hook to use the AuthContext
export function useAuth() {
  return useContext(AuthContext);
}
