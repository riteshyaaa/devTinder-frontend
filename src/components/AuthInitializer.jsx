import { useEffect } from "react";
import useAuth from "../hooks/useAuth";

/**
 * AuthInitializer — Runs once on application mount.
 * Triggers session verification to restore the authenticated user if a valid session cookie exists.
 */
const AuthInitializer = ({ children }) => {
  const { isAuthInitialized, fetchUser } = useAuth();

  useEffect(() => {
    if (!isAuthInitialized) {
      fetchUser();
    }
  }, [isAuthInitialized, fetchUser]);

  return children;
};

export default AuthInitializer;
