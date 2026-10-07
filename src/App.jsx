import { lazy, Suspense } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Provider } from "react-redux";
import appStore from "./utils/appStore";
import ErrorBoundary from "./components/ErrorBoundary";
import ProtectedRoute from "./components/ProtectedRoute";
import AuthInitializer from "./components/AuthInitializer";
import { Spinner } from "./components/Shimmer";

// Lazy-loaded components for code splitting
const Body = lazy(() => import("./components/Body"));
const Feed = lazy(() => import("./components/Feed"));
const Login = lazy(() => import("./components/Login"));
const Profile = lazy(() => import("./components/Profile"));
const Connections = lazy(() => import("./components/Connections"));
const Requests = lazy(() => import("./components/Requests"));
const Chat = lazy(() => import("./components/Chat"));
const Onboarding = lazy(() => import("./components/Onboarding"));
const ProjectBoard = lazy(() => import("./components/ProjectBoard"));
const ActivityFeed = lazy(() => import("./components/ActivityFeed"));
const LandingPage = lazy(() => import("./components/LandingPage"));
const CodingChallenges = lazy(() => import("./components/CodingChallenges"));
const ProfileAnalytics = lazy(() => import("./components/ProfileAnalytics"));

function App() {
  return (
    <ErrorBoundary>
      <Provider store={appStore}>
        <BrowserRouter basename="/">
          <AuthInitializer>
            <Suspense fallback={<Spinner text="Loading..." />}>
              <Routes>
                {/* Standalone pages (no NavBar/Footer) */}
                <Route
                  path="/onboarding"
                  element={
                    <ProtectedRoute>
                      <Onboarding />
                    </ProtectedRoute>
                  }
                />

                {/* Main app layout */}
                <Route path="/" element={<Body />}>
                  {/* Public routes */}
                  <Route index element={<LandingPage />} />
                  <Route path="login" element={<Login />} />

                  {/* Protected routes (require authentication) */}
                  <Route
                    path="feed"
                    element={
                      <ProtectedRoute>
                        <Feed />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="connections"
                    element={
                      <ProtectedRoute>
                        <Connections />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="requests"
                    element={
                      <ProtectedRoute>
                        <Requests />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="chat/:targetId"
                    element={
                      <ProtectedRoute>
                        <Chat />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="projects"
                    element={
                      <ProtectedRoute>
                        <ProjectBoard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="activity"
                    element={
                      <ProtectedRoute>
                        <ActivityFeed />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="challenges"
                    element={
                      <ProtectedRoute>
                        <CodingChallenges />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="analytics"
                    element={
                      <ProtectedRoute>
                        <ProfileAnalytics />
                      </ProtectedRoute>
                    }
                  />
                </Route>
              </Routes>
            </Suspense>
          </AuthInitializer>
        </BrowserRouter>
      </Provider>
    </ErrorBoundary>
  );
}

export default App;
