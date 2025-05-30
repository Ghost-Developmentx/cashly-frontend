interface OnboardingProgressProps {
    currentStep: number;
    totalSteps: number;
}

export default function OnboardingProgress({ currentStep, totalSteps }: OnboardingProgressProps) {
    const steps = [
        { number: 1, name: 'Personal Info' },
        { number: 2, name: 'Business Details' },
        { number: 3, name: 'Your Goals' },
        { number: 4, name: 'Profile Picture' },
    ];

    return (
        <div className="w-full">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => (
                    <div key={step.number} className="flex items-center flex-1">
                        <div className="relative">
                            <div
                                className={`
                  w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
                  ${currentStep >= step.number
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-200 text-gray-500'
                                }
                `}
                            >
                                {currentStep > step.number ? (
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                ) : (
                                    step.number
                                )}
                            </div>
                            <span className={`
                absolute top-12 left-1/2 transform -translate-x-1/2 text-xs whitespace-nowrap
                ${currentStep >= step.number ? 'text-gray-900' : 'text-gray-500'}
              `}>
                {step.name}
              </span>
                        </div>
                        {index < steps.length - 1 && (
                            <div className={`
                flex-1 h-1 mx-2 mt-0
                ${currentStep > step.number ? 'bg-blue-600' : 'bg-gray-200'}
              `} />
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}