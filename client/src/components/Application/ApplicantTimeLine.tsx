import { cn } from '@/lib/utils';

interface TimelineStep {
  id: number;
  label: string;
  description?: string;
}

interface StepTimelineProps {
  currentStep: number;
  steps: TimelineStep[];
  className?: string;
}

export default function StepTimeline({
  currentStep,
  steps,
  className,
}: StepTimelineProps) {
  return (
    <div className={cn('w-full px-4 py-8', className)}>
      <div className="relative">
        <div className="absolute top-5 left-0 h-1 w-full rounded-full bg-gray-200">
          <div
            className="bg-primary h-full rounded-full transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative flex w-full justify-between">
          {steps.map((step) => (
            <div key={step.id} className="flex flex-col items-center">
              <div
                className={cn(
                  'z-10 mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                  step.id <= currentStep
                    ? 'border-primary bg-primary text-white'
                    : 'border-gray-300 bg-white text-gray-500'
                )}
              >
                {step.id}
              </div>
              <p
                className={cn(
                  'text-sm font-medium',
                  step.id === currentStep && 'text-primary font-semibold',
                  step.id < currentStep && 'text-primary',
                  step.id > currentStep && 'text-muted-foreground'
                )}
              >
                {step.label}
              </p>
              {step.description && (
                <p className="text-muted-foreground mt-1 max-w-[100px] text-center text-xs">
                  {step.description}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
