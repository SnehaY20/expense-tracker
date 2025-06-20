import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const AuthForm = ({
  mode,
  fields,
  onSubmit,
  error,
  success,
  loading,
  leftButton,
  rightButton,
  onboardingSteps,
  currentStep,
  setStep,
  mutation,
}) => {
  let formIcon = null;
  if (mode === "login") {
    formIcon = (
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m12 0A2.25 2.25 0 0016.5 8.25h-9A2.25 2.25 0 005.25 10.5m12 0v7.125c0 1.243-1.007 2.25-2.25 2.25h-6a2.25 2.25 0 01-2.25-2.25V10.5m12 0H5.25"
          />
        </svg>
      </div>
    );
  } else if (mode === "register") {
    formIcon = (
      <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center shadow-lg">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="w-10 h-10 text-white"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118A7.5 7.5 0 0112 17.25c2.086 0 3.977.797 5.499 2.118M19.5 10.5h-3m0 0v-3m0 3v3"
          />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
          {onboardingSteps && typeof currentStep === "number" ? (
            <>
              <div className="flex justify-center mb-8">
                <div className="flex space-x-2">
                  {onboardingSteps.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        if (mutation.isSuccess || currentStep > 0)
                          setStep(index);
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
                  <form className="space-y-4" onSubmit={onSubmit}>
                    {fields.map((field) => (
                      <input
                        key={field.name}
                        type={field.type}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={field.placeholder}
                        className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                    ))}
                    {error && (
                      <div className="text-red-400 text-sm text-left w-full">
                        {error}
                      </div>
                    )}
                    {success && (
                      <div className="text-green-400 text-sm">{success}</div>
                    )}
                    {rightButton}
                  </form>
                )}
              </div>
            </>
          ) : (
            <>
              {formIcon}
              <h2 className="text-2xl font-bold text-white mb-6 text-center">
                {mode === "register" ? "Register" : "Login"}
              </h2>
              <form className="space-y-4" onSubmit={onSubmit}>
                {fields.map((field) => (
                  <input
                    key={field.name}
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
                    className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                  />
                ))}
                {error && (
                  <div className="text-red-400 text-sm text-left w-full">
                    {error}
                  </div>
                )}
                {success && (
                  <div className="text-green-400 text-sm">{success}</div>
                )}
                {rightButton}
              </form>
            </>
          )}
          <div className="flex items-center justify-between mt-4">
            {leftButton}
          </div>
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

export default AuthForm;
