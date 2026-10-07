import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Hero from "./landing/Hero";
import CapabilitiesGrid from "./landing/CapabilitiesGrid";
import HowItWorks from "./landing/HowItWorks";
import DiscoveryShowcase from "./landing/DiscoveryShowcase";
import ChatShowcase from "./landing/ChatShowcase";
import VideoShowcase from "./landing/VideoShowcase";
import ProjectShowcase from "./landing/ProjectShowcase";
import GithubShowcase from "./landing/GithubShowcase";
import ChallengesShowcase from "./landing/ChallengesShowcase";
import FinalCTA from "./landing/FinalCTA";

const LandingPage = () => {
  const user = useSelector((state) => state.user);
  const isAuthInitialized = useSelector(
    (state) => state.auth?.isAuthInitialized
  );
  const navigate = useNavigate();

  // Redirect authenticated users to feed once session initialization is verified
  useEffect(() => {
    if (isAuthInitialized && user) {
      navigate("/feed", { replace: true });
    }
  }, [isAuthInitialized, user, navigate]);

  // Show landing page for unauthenticated visitors
  return (
    <div className="min-h-screen bg-brand-dark text-slate-100 selection:bg-violet-500/30 selection:text-violet-200 overflow-x-hidden">
      {/* 1. Hero Section */}
      <Hero />

      {/* 2. Capabilities Grid */}
      <CapabilitiesGrid />

      {/* 3. 3-Step Workflow */}
      <HowItWorks />

      {/* 4. Interactive Feature Deep Dives & Showcases */}
      <section id="interactive-demo" className="relative">
        <DiscoveryShowcase />
        <ChatShowcase />
        <VideoShowcase />
        <ProjectShowcase />
        <GithubShowcase />
        <ChallengesShowcase />
      </section>

      {/* 5. Final Conversion CTA */}
      <FinalCTA />
    </div>
  );
};

export default LandingPage;
