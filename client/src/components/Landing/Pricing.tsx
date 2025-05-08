import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { pricingPlans } from '@/constants/LandingPage';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Pricing = () => {
  const getTitleColor = (title: string) => {
    if (title === 'Starter') {
      return 'text-yellow-500';
    } else if (title === 'Pro') {
      return 'text-primary';
    } else {
      return 'text-purple-500';
    }
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-gradient-blaze mb-8 pt-8 text-center text-3xl font-bold md:mb-14 md:pt-15 md:text-4xl">
        Find The Model which suits you best.
      </h1>
      <div className="grid grid-cols-1 gap-6 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pricingPlans.map((plan, index) => (
          <Card key={index} className="border-black bg-black shadow-slate-600">
            <CardHeader>
              <CardTitle
                className={cn(
                  'text-2xl font-light text-white md:text-3xl',
                  getTitleColor(plan.title)
                )}
              >
                {plan.title}
              </CardTitle>
              <CardDescription className="max-w-[200px] text-sm md:text-base">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <h3 className={cn('mt-2 mb-5 text-4xl md:text-5xl')}>
                  {plan.price}
                </h3>
                <Button className="w-full bg-white text-black transition-all delay-50 ease-in hover:text-white">
                  {plan.buttonText}
                </Button>
                <div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature, featureIndex) => (
                      <li
                        key={featureIndex}
                        className="flex items-start gap-2 text-sm md:items-center md:gap-3 md:text-base"
                      >
                        <span className="bg-primary mt-0.5 flex flex-shrink-0 items-center justify-center rounded-full p-0.5 md:mt-0">
                          <Check size={16} className="md:size-[20px]" />
                        </span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
