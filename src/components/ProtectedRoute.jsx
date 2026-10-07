import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { Spinner } from "./Shimmer";

/**
 * ProtectedRoute — Wrapper that requires authentication.
 * 1. While authentication is initializing, renders a loading spinner.
 * 2. If authenticated, renders the protected children.
 * 3. If unauthenticated, redirects to /login with the target location saved.
 */
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.user);
  const isAuthInitialized = useSelector(
    (state) => state.auth?.isAuthInitialized
  );
  const location = useLocation();

  // If authentication state is still initializing / restoring session, wait
  if (!isAuthInitialized) {
    return <Spinner text="Verifying session..." />;
  }

  // Once initialized, if there is no authenticated user, redirect to /login
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
