import {
  Card,
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
} from '@/components/ui/card';
import { Check } from 'lucide-react';
import { pricingPlans } from '@/constants/LandingPage';
import { Button } from '../ui/button';
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
    <div>
      <h1 className="text-gradient-blaze mb-14 pt-15 text-center text-4xl font-bold">
        Find The Model which suits you best.
      </h1>
      <div className="mx-auto grid w-[1200px] grid-cols-1 gap-4 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <Card className="border-black bg-black shadow-slate-600">
            <CardHeader>
              <CardTitle
                className={cn(
                  'text-3xl font-light text-white',
                  getTitleColor(plan.title)
                )}
              >
                {plan.title}
              </CardTitle>
              <CardDescription className="max-w-[200px]">
                {plan.description}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-white">
                <h3 className={cn('mt-2 mb-5 text-5xl')}>{plan.price}</h3>
                <Button className="w-full bg-white text-black transition-all delay-50 ease-in hover:text-white">
                  {plan.buttonText}
                </Button>
                <div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li className="flex items-center gap-3">
                        <span className="bg-primary flex items-center justify-center rounded-full p-0.5">
                          <Check size={20} />
                        </span>{' '}
                        {feature}
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
