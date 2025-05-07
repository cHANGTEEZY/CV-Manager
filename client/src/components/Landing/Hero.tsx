import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { BanknoteArrowUp } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { cn } from '@/lib/utils';
import { pricingPlans } from '@/constants/LandingPage';
import { Check } from 'lucide-react';
import UseRedirect from '@/hooks/use-redirect';

export const Hero = () => {
  return (
    <section className="flex h-96 w-full items-center justify-center border-[oklch(1_0_0/8%)]">
      <div className="grid place-items-center gap-6">
        <h1 className="text-center text-8xl font-bold text-[oklch(0.9_0.01_270)]">
          Manage it <br /> With Framer
        </h1>

        <span className="mt-2 space-x-3">
          <Button
            onClick={UseRedirect('/dashboard')}
            className="cursor-pointer bg-[oklch(0.65_0.23_25)] text-[oklch(0.98_0.01_25)] hover:bg-[oklch(0.65_0.23_25/90%)]"
          >
            Get Started
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button className="cursor-pointer bg-[oklch(0.28_0.02_260)] text-[oklch(0.92_0.01_270)] hover:bg-[oklch(0.28_0.02_260/80%)]">
                Find your plan <BanknoteArrowUp />
              </Button>
            </DialogTrigger>
            <DialogContent className="w-[max-content] border-none bg-black p-0">
              <Pricing />
            </DialogContent>
          </Dialog>
        </span>
      </div>
    </section>
  );
};

const Pricing = () => {
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
