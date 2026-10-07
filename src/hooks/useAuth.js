import { useCallback, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addUser, removeUser } from "../utils/userSlice";
import {
  setAuthInitializing,
  setAuthenticated,
  setUnauthenticated,
  AUTH_STATUS,
} from "../utils/authSlice";
import {
  loginUser,
  signUpUser,
  logoutUser,
  fetchProfile,
  getErrorMessage,
} from "../services/api";

// In-flight singleton promise to prevent duplicate concurrent session verification requests
let inFlightSessionCheck = null;

/**
 * Custom hook for authentication logic.
 * Manages user lifecycle, authentication states (INITIALIZING, AUTHENTICATED, UNAUTHENTICATED),
 * session restoration on browser refresh, and auth actions.
 */
const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((store) => store.user);
  const authState = useSelector((store) => store.auth) || {
    status: AUTH_STATUS.INITIALIZING,
    isAuthInitialized: false,
    isAuthLoading: true,
  };

  const clearError = useCallback(() => setError(""), []);

  const fetchUser = useCallback(async () => {
    // If already initialized and user exists, mark as authenticated and return
    if (user) {
      dispatch(setAuthenticated());
      return user;
    }

    // Reuse existing in-flight session verification promise if one is already running
    if (inFlightSessionCheck) {
      return inFlightSessionCheck;
    }

    dispatch(setAuthInitializing());
    setLoading(true);

    inFlightSessionCheck = (async () => {
      try {
        const res = await fetchProfile();
        const userData = res.data?.data || res.data;
        if (userData && (userData._id || userData.email)) {
          dispatch(addUser(userData));
          dispatch(setAuthenticated());
          return userData;
        } else {
          dispatch(removeUser());
          dispatch(setUnauthenticated());
          return null;
        }
      } catch (err) {
        dispatch(removeUser());
        dispatch(setUnauthenticated());
        if (err.response?.status !== 401) {
          setError(getErrorMessage(err));
        }
        return null;
      } finally {
        setLoading(false);
        inFlightSessionCheck = null;
      }
    })();

    return inFlightSessionCheck;
  }, [user, dispatch]);

  const login = useCallback(
    async (email, password) => {
      setError("");
      setLoading(true);
      try {
        const res = await loginUser(email, password);
        const userData = res.data?.data || res.data;
        dispatch(addUser(userData));
        dispatch(setAuthenticated());
        navigate("/feed");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate]
  );

  const signUp = useCallback(
    async ({ firstName, lastName, email, password }) => {
      setError("");
      setLoading(true);
      try {
        const res = await signUpUser({ firstName, lastName, email, password });
        const userData = res.data?.data || res.data;
        dispatch(addUser(userData));
        dispatch(setAuthenticated());
        navigate("/onboarding");
      } catch (err) {
        setError(getErrorMessage(err));
      } finally {
        setLoading(false);
      }
    },
    [dispatch, navigate]
  );

  const logout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      dispatch(removeUser());
      dispatch(setUnauthenticated());
      setLoading(false);
      navigate("/login");
    }
  }, [dispatch, navigate]);

  return {
    user,
    authStatus: authState.status,
    isAuthInitialized: authState.isAuthInitialized,
    isAuthLoading: authState.isAuthLoading || loading,
    loading: loading || authState.isAuthLoading,
    error,
    clearError,
    login,
    signUp,
    logout,
    fetchUser,
  };
};

export default useAuth;
