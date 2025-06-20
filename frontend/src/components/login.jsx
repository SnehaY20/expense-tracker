import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Register from "./register";

const Login = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showRegister, setShowRegister] = useState(false);

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

  const loginUser = async ({ email, password }) => {
    const response = await fetch("/api/v1/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      const text = await response.text();
      throw new Error("Unexpected response: " + text.slice(0, 100));
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Login failed");
    }

    return response.json();
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: () => {
      setCurrentStep(currentStep + 1);
    },
  });

  const handleLogin = () => {
    mutation.mutate({ email, password });
  };

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {showRegister ? (
            <Register onBack={() => setShowRegister(false)} />
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2">
                  {onboardingSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (mutation.isSuccess || currentStep > 0)
                          goToStep(index);
                      }}
                      disabled={!(mutation.isSuccess || currentStep > 0)}
                      className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentStep
                          ? "w-8 bg-white"
                          : "w-2 bg-white/30"
                      } ${
                        !(mutation.isSuccess || currentStep > 0)
                          ? "cursor-not-allowed opacity-50"
                          : "hover:bg-white/50"
                      }`}
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

                {onboardingSteps[currentStep].isLogin && (
                  <div className="space-y-4">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Email"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Password"
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                    />
                    {mutation.isError && (
                      <div className="text-red-400 text-sm">
                        {mutation.error.message}
                      </div>
                    )}
                    {mutation.isSuccess && (
                      <div className="text-green-400 text-sm">
                        Login successful!
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={
                    currentStep === 0 ? () => setShowRegister(true) : prevStep
                  }
                  disabled={currentStep === 0 && showRegister}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-200 ${
                    currentStep === 0 && showRegister
                      ? "text-white/30 cursor-not-allowed"
                      : currentStep === 0
                      ? "text-white hover:bg-white/10 hover:scale-105"
                      : "text-white hover:bg-white/10 hover:scale-105"
                  }`}
                >
                  <ChevronLeft size={20} />
                  <span>{currentStep === 0 ? "Register" : "Back"}</span>
                </button>

                <button
                  onClick={
                    currentStep === 0
                      ? handleLogin
                      : currentStep === onboardingSteps.length - 1
                      ? () => alert("Welcome aboard! 🎉")
                      : nextStep
                  }
                  disabled={
                    mutation.isLoading ||
                    (currentStep === 0 ? false : !mutation.isSuccess)
                  }
                  className={`px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 shadow-lg ${
                    currentStep === onboardingSteps.length - 1
                      ? "bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:shadow-green-500/25"
                      : "bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-purple-500/25"
                  } ${
                    mutation.isLoading ||
                    (currentStep > 0 && !mutation.isSuccess)
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  {mutation.isLoading ? (
                    "Logging in..."
                  ) : currentStep === onboardingSteps.length - 1 ? (
                    <span className="flex items-center space-x-2">
                      <span>Get Started</span>
                      <span>🚀</span>
                    </span>
                  ) : currentStep === 0 ? (
                    <span className="flex items-center space-x-2">
                      <span>Login</span>
                      <ChevronRight size={20} />
                    </span>
                  ) : (
                    <span className="flex items-center space-x-2">
                      <span>Next</span>
                      <ChevronRight size={20} />
                    </span>
                  )}
                </button>
              </div>
            </>
          )}
        </div>

        <div className="flex justify-center mt-6 space-x-2">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className={`w-1 h-1 bg-white/20 rounded-full animate-pulse`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>
      </div>

      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl animate-pulse" />
      </div>
    </div>
  );
};

export default Login;
