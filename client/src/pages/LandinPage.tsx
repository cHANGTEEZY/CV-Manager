import { framerWhite } from '@/assets/images';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import {
  BanknoteArrowUp,
  Bird,
  Check,
  ChevronDown,
  Dribbble,
  Facebook,
  Instagram,
  Linkedin,
  Slack,
  Trello,
  User,
  Youtube,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { features, pricingPlans } from '@/constants/LandingPage';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/components/ui/popover';
import useLogout from '@/hooks/use-logout';

const LandingPage = () => {
  return (
    <section className="h-[3000px] bg-[oklch(0.14_0.02_260)] text-[oklch(0.9_0.01_270)]">
      <Header />
      <Hero />
      <div className="group relative mx-auto my-16 max-w-3xl items-center justify-center overflow-hidden rounded-lg border-[oklch(1_0_0/8%)] py-12">
        <motion.div className="transition-all duration-300 group-hover:blur-sm">
          <Customer />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-[oklch(0.14_0.02_260/50%)] opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        >
          <motion.span
            whileHover={{
              opacity: 0.8,
              scale: 0.98,
            }}
            className="flex items-center gap-2 text-xl font-medium text-[oklch(0.98_0.01_270)]"
          >
            Meet our customers <ChevronDown className="ml-1" size={16} />
          </motion.span>
        </motion.div>
      </div>
      <section className="m-auto max-w-3xl">
        <motion.div>
          <Features />
        </motion.div>
      </section>
    </section>
  );
};

export default LandingPage;

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const signout = useLogout();

  const { user } = useAuth();
  useEffect(() => {
    if (user?.aud === 'authenticated') {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  return (
    <header className="border-b border-[oklch(1_0_0/8%)] bg-[oklch(0.14_0.02_260)]">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <span className="flex items-center gap-1 text-lg font-medium text-[oklch(0.9_0.01_270)]">
          <img src={framerWhite} alt="framer company logo" className="h-10" />
        </span>
        {isAuthenticated ? (
          <div>
            <Popover>
              <PopoverTrigger>
                <User className="cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="m-0 grid w-[100px] place-content-center gap-2 border-none bg-slate-900">
                <Button
                  variant={'outline'}
                  className="w-[100px] cursor-pointer"
                >
                  <Link to={'/dashboard'}>Dashboard</Link>
                </Button>

                <Button className="w-[100px] cursor-pointer" onClick={signout}>
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="space-x-2">
            <Link to={'/auth/signin'}>
              <Button
                variant="ghost"
                className="cursor-pointer text-[oklch(0.9_0.01_270)] hover:bg-[oklch(0.25_0.01_270)] hover:text-[oklch(0.98_0.01_270)]"
              >
                Signin
              </Button>
            </Link>
            <Link to={'/auth/signup'}>
              <Button className="cursor-pointer bg-[oklch(0.65_0.23_25)] text-[oklch(0.98_0.01_25)] hover:bg-[oklch(0.65_0.23_25/90%)]">
                Signup
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

const Hero = () => {
  return (
    <section className="flex h-96 w-full items-center justify-center border-[oklch(1_0_0/8%)]">
      <div className="grid place-items-center gap-6">
        <h1 className="text-center text-8xl font-bold text-[oklch(0.9_0.01_270)]">
          Manage it <br /> with Framer
        </h1>
        <p className="text-2xl text-[oklch(0.65_0.02_270)]">
          The website CRM loved by HR
        </p>
        <span className="mt-2 space-x-3">
          <Button className="cursor-pointer bg-[oklch(0.65_0.23_25)] text-[oklch(0.98_0.01_25)] hover:bg-[oklch(0.65_0.23_25/90%)]">
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

const Customer = () => {
  return (
    <motion.div className="grid w-full grid-cols-2 place-items-center gap-10 py-8 sm:grid-cols-4">
      {[
        Dribbble,
        Bird,
        Linkedin,
        Youtube,
        Slack,
        Trello,
        Instagram,
        Facebook,
      ].map((Icon, index) => (
        <motion.div
          key={index}
          whileHover={{ scale: 0.9 }}
          className="text-[oklch(0.9_0.01_270)] opacity-70 transition-opacity duration-300 hover:opacity-100"
        >
          <Icon size={30} strokeWidth={1.5} />
        </motion.div>
      ))}
    </motion.div>
  );
};

const Features = () => {
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

// const Carousel = () => {
//   return <div></div>;
// };

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
