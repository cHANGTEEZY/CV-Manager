import { cn } from '@/lib/utils';
import { CheckCircle, Circle, XCircle } from 'lucide-react';

export interface TimelineStep {
  id: number;
  label: string;
  description?: string;
}

interface HorizontalTimelineProps {
  currentStep: number;
  steps: TimelineStep[];
  className?: string;
  status?: string; // Add status prop to track if applicant is rejected
}

export default function HorizontalTimeline({
  currentStep,
  steps,
  className,
  status = 'active',
}: HorizontalTimelineProps) {
  // Check if applicant is rejected
  const isRejected =
    status === 'rejected' || status === 'Pending Email Rejection';

  // Determine timeline color based on status
  const timelineColor = isRejected ? 'bg-red-500' : 'bg-emerald-500';

  // Return null check should only happen if there are no steps
  if (steps.length === 0) return null;

  return (
    <div className={cn('w-full overflow-x-auto', className)}>
      <div className="relative w-full">
        <div className="absolute top-4 left-0 h-1 w-full max-w-[800px] overflow-hidden rounded-full bg-gray-200">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-500 ease-in-out',
              timelineColor
            )}
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
                  {isRejected &&
                  (step.id === currentStep || step.id === steps.length) ? (
                    // Show x-circle for rejection at current or final step
                    <XCircle className="h-8 w-8 fill-red-100 text-red-600" />
                  ) : isCompleted ? (
                    <CheckCircle
                      className={cn(
                        'h-8 w-8',
                        isRejected
                          ? 'fill-red-100 text-red-600'
                          : 'fill-emerald-100 text-emerald-600'
                      )}
                    />
                  ) : isCurrent ? (
                    <Circle
                      className={cn(
                        'h-8 w-8 animate-pulse stroke-2',
                        isRejected
                          ? 'fill-red-200 text-red-600'
                          : 'fill-purple-200 text-purple-600'
                      )}
                    />
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
                      isRejected && (isCompleted || isCurrent)
                        ? 'text-red-700'
                        : isCompleted
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
                        isRejected && (isCompleted || isCurrent)
                          ? 'text-red-600'
                          : isCompleted
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
