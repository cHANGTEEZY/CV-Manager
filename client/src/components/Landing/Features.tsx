import { Card, CardContent } from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { features } from '@/constants/LandingPage';

export const Features = () => {
  return (
    <div className="w-full">
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-4">
        {features.map((feature, index) => (
          <Card
            key={index}
            className="border-[oklch(1_0_0/8%)] bg-[oklch(0.18_0.02_260)] shadow-lg transition-all duration-300 hover:shadow-[oklch(0.65_0.23_25/20%)]"
          >
            <CardContent className="">
              <div className="flex flex-col items-center justify-center gap-4 text-center">
                <div className="rounded-full bg-[oklch(0.28_0.02_260)] p-3">
                  <feature.icon
                    size={24}
                    strokeWidth={2}
                    className="text-[oklch(0.9_0.01_270)]"
                  />
                </div>

                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger>
                      <h3 className="cursor-default text-lg font-medium text-[oklch(0.8_0.01_270)] transition-all duration-200 hover:text-[oklch(0.9_0.01_270)]">
                        {feature.title}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent
                      sideOffset={5}
                      className="max-w-[250px] bg-[oklch(0.28_0.02_260)] py-3 text-sm text-[oklch(0.9_0.01_270)]"
                    >
                      {feature.description}
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
