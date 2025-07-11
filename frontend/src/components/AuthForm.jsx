import React from "react";
import Input from "./Input";
import { User, UserPlus } from "lucide-react";

const AuthForm = ({
  mode,
  fields,
  onSubmit,
  error,
  success,
  leftButton,
  rightButton,
  onboardingSteps,
  currentStep,
  setStep,
  mutation,
}) => {
  let formIcon = null;
  let icon =
    mode === "login" ? (
      <User size={40} className="text-white" />
    ) : (
      <UserPlus size={40} className="text-white" />
    );
  formIcon = (
    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
      {icon}
    </div>
  );

  return (
    //bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900
    <div className="min-h-screen  flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-4 shadow-2xl border border-white/20 overflow-hidden max-h-[520px]">
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
                      <Input
                        key={field.name}
                        name={field.name}
                        type={field.type}
                        value={field.value}
                        onChange={field.onChange}
                        placeholder={field.placeholder}
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
                  <Input
                    key={field.name}
                    name={field.name}
                    type={field.type}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder={field.placeholder}
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
