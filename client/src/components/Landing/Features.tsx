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
    <div className="my-5">
      <h2 className="text-center text-6xl font-bold">
        Everything you need to find <br /> and manage top talent.
      </h2>
      <div className="mt-20 grid grid-cols-1 gap-x-2 gap-y-3 px-10 md:grid-cols-2 lg:grid-cols-3">
        {features.map((feature) => (
          <Card className="border-black bg-black shadow-blue-900">
            <CardContent>
              <div className="flex flex-col items-center justify-center gap-5">
                <feature.icon size={30} strokeWidth={2} color="white" />
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger>
                      <h3 className="cursor-default text-gray-400 transition-all delay-50 ease-in-out hover:text-gray-100">
                        {feature.title}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent
                      arrowClassName="bg-white fill-white"
                      sideOffset={45}
                      className="max-w-[200px] bg-white py-3 text-sm text-gray-800"
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
