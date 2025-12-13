import { CheckIcon } from './AppIcons';

const steps = [
  { id: 1, name: 'Shopping Cart' },
  { id: 2, name: 'Checkout' },
  { id: 3, name: 'Order Complete' },
];

export function CheckoutSteps({ currentStep }) {
  return (
    <div className="flex items-center justify-center gap-4 md:gap-8">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step.id < currentStep
                  ? 'bg-[#C41E3A] text-white'
                  : step.id === currentStep
                    ? 'bg-[#C41E3A] text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step.id < currentStep ? <CheckIcon className="w-4 h-4" /> : step.id}
            </div>
            <span
              className={`hidden sm:inline text-sm font-medium ${
                step.id <= currentStep ? 'text-gray-900' : 'text-gray-400'
              }`}
            >
              {step.name}
            </span>
          </div>
          {index < steps.length - 1 && <div className="w-8 md:w-16 h-px bg-gray-300 ml-4" />}
        </div>
      ))}
    </div>
  );
}
