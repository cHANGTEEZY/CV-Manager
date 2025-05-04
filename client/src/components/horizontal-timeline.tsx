import { cn } from '@/lib/utils';
import { CheckCircle, Circle } from 'lucide-react';

export interface TimelineStep {
  id: number;
  label: string;
  description?: string;
}

interface HorizontalTimelineProps {
  currentStep: number;
  steps: TimelineStep[];
  className?: string;
}

export default function HorizontalTimeline({
  currentStep,
  steps,
  className,
}: HorizontalTimelineProps) {
  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="relative w-full">
        <div className="absolute top-4 left-0 h-1 w-full rounded-full bg-gray-200">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500 ease-in-out"
            style={{
              width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
            }}
          />
        </div>

        <div className="grid w-full grid-cols-6">
          {steps.map((step) => {
            const isCompleted = step.id < currentStep;
            const isCurrent = step.id === currentStep;

            return (
              <div
                key={step.id}
                className="flex flex-col items-center px-1 text-center"
              >
                <div className="z-10 mb-2">
                  {isCompleted ? (
                    <CheckCircle className="h-8 w-8 fill-emerald-100 text-emerald-600" />
                  ) : isCurrent ? (
                    <Circle className="h-8 w-8 animate-pulse fill-purple-200 stroke-2 text-purple-600" />
                  ) : (
                    <Circle className="h-8 w-8 stroke-1 text-gray-400" />
                  )}
                </div>

                <div
                  className={cn(
                    'text-center',
                    isCompleted || isCurrent ? 'opacity-100' : 'opacity-70'
                  )}
                >
                  <h3
                    className={cn(
                      'text-sm font-medium',
                      isCompleted
                        ? 'text-emerald-700'
                        : isCurrent
                          ? 'font-semibold text-purple-700'
                          : 'text-gray-600'
                    )}
                  >
                    {step.label}
                  </h3>
                  {step.description && (
                    <p
                      className={cn(
                        'mt-1 max-w-[100px] text-xs',
                        isCompleted
                          ? 'text-emerald-600'
                          : isCurrent
                            ? 'text-purple-500'
                            : 'text-gray-500'
                      )}
                    >
                      {step.description}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
