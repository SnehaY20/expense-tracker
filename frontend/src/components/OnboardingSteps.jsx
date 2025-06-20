import React, { useState } from "react";

const onboardingSteps = [
  {
    icon: "🔐",
    title: "Login",
    description:
      "Enter your credentials to access your account and continue your journey.",
    gradient: "from-purple-500 to-pink-500",
    isLogin: true,
  },
  {
    icon: "📊",
    title: "Track Progress",
    description:
      "Monitor your daily activities with beautiful charts and insights that keep you motivated.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: "🏆",
    title: "Achieve Success",
    description:
      "Celebrate your wins and build lasting habits that transform your life for the better.",
    gradient: "from-green-500 to-emerald-500",
  },
];

const OnboardingSteps = ({ onGetStarted }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToStep = (index) => {
    setCurrentStep(index);
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="flex justify-center mb-8">
          <div className="flex space-x-2">
            {onboardingSteps.map((_, index) => (
              <button
                key={index}
                onClick={() => goToStep(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentStep ? "w-8 bg-white" : "w-2 bg-white/30"
                } hover:bg-white/50`}
              />
            ))}
          </div>
        </div>

        <div className="text-center mb-8">
          <div
            className={`w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-r ${onboardingSteps[currentStep].gradient} flex items-center justify-center transform transition-all duration-500 hover:scale-110 shadow-lg`}
          >
            <span className="text-4xl animate-pulse">
              {onboardingSteps[currentStep].icon}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-white mb-4 transition-all duration-300">
            {onboardingSteps[currentStep].title}
          </h1>

          <p className="text-white/80 text-lg leading-relaxed mb-6">
            {onboardingSteps[currentStep].description}
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-white hover:bg-white/10 hover:scale-105 ${
              currentStep === 0 ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span>Back</span>
          </button>

          {currentStep === onboardingSteps.length - 1 ? (
            <button
              onClick={onGetStarted}
              className="px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/25"
            >
              <span className="flex items-center space-x-2">
                <span>Get Started</span>
                <span>🚀</span>
              </span>
            </button>
          ) : (
            <button
              onClick={nextStep}
              className="flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 text-white hover:bg-white/10 hover:scale-105"
            >
              <span>Next</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default OnboardingSteps;
