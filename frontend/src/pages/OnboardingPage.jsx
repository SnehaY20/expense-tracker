import React from "react";
import { useNavigate } from "react-router-dom";
import OnboardingSteps from "../components/OnboardingSteps";
import BackgroundLayout from "../components/BackgroundLayout";

const OnboardingPage = () => {
  const navigate = useNavigate();
  return (
    <BackgroundLayout>
      <div className="min-h-screen flex items-center justify-center">
        <OnboardingSteps onGetStarted={() => navigate("/login")} />
      </div>
    </BackgroundLayout>
  );
};

export default OnboardingPage;
