import { framerWhite } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
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
} from "lucide-react";
import { Link } from "react-router-dom";
import { features, pricingPlans } from "@/constants/LandingPage";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import useLogout from "@/hooks/use-logout";

const LandingPage = () => {
  return (
    <section className="bg-[oklch(0.14_0.02_260)] text-[oklch(0.9_0.01_270)] h-[3000px]">
      <Header />
      <Hero />
      <div className="relative group mx-auto max-w-3xl rounded-lg  border-[oklch(1_0_0/8%)] py-12 justify-center items-center overflow-hidden my-16">
        <motion.div className="transition-all duration-300 group-hover:blur-sm">
          <Customer />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute inset-0 flex items-center justify-center bg-[oklch(0.14_0.02_260/50%)] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        >
          <motion.span
            whileHover={{
              opacity: 0.8,
              scale: 0.98,
            }}
            className="text-[oklch(0.98_0.01_270)] text-xl font-medium flex items-center gap-2"
          >
            Meet our customers <ChevronDown className="ml-1" size={16} />
          </motion.span>
        </motion.div>
      </div>
      <section className="max-w-3xl m-auto">
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
    if (user?.aud === "authenticated") {
      setIsAuthenticated(true);
    } else {
      setIsAuthenticated(false);
    }
  }, [user]);

  return (
    <header className="bg-[oklch(0.14_0.02_260)] border-b border-[oklch(1_0_0/8%)] ">
      <nav className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <span className="font-medium text-lg text-[oklch(0.9_0.01_270)] flex gap-1 items-center ">
          <img src={framerWhite} alt="framer company logo" className="h-10" />
        </span>
        {isAuthenticated ? (
          <div>
            <Popover>
              <PopoverTrigger>
                <User className="cursor-pointer" />
              </PopoverTrigger>
              <PopoverContent className="grid gap-2 bg-slate-900 w-[100px]  m-0 border-none place-content-center">
                <Button
                  variant={"outline"}
                  className=" cursor-pointer w-[100px]"
                >
                  <Link to={"/dashboard"}>Dashboard</Link>
                </Button>

                <Button className="w-[100px] cursor-pointer" onClick={signout}>
                  Logout
                </Button>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <div className="space-x-2">
            <Link to={"/auth/signin"}>
              <Button
                variant="ghost"
                className="cursor-pointer text-[oklch(0.9_0.01_270)] hover:bg-[oklch(0.25_0.01_270)] hover:text-[oklch(0.98_0.01_270)]"
              >
                Signin
              </Button>
            </Link>
            <Link to={"/auth/signup"}>
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
    <section className="h-96 flex items-center w-full justify-center  border-[oklch(1_0_0/8%)]">
      <div className="grid place-items-center gap-6">
        <h1 className="text-8xl font-bold text-center text-[oklch(0.9_0.01_270)]">
          Manage it <br /> with Framer
        </h1>
        <p className="text-[oklch(0.65_0.02_270)] text-2xl">
          The website CRM loved by HR
        </p>
        <span className="space-x-3 mt-2">
          <Button className="bg-[oklch(0.65_0.23_25)] text-[oklch(0.98_0.01_25)] hover:bg-[oklch(0.65_0.23_25/90%)] cursor-pointer">
            Get Started
          </Button>
          <Dialog>
            <DialogTrigger>
              <Button className="bg-[oklch(0.28_0.02_260)] text-[oklch(0.92_0.01_270)] hover:bg-[oklch(0.28_0.02_260/80%)] cursor-pointer">
                Find your plan <BanknoteArrowUp />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-black border-none w-[max-content] p-0">
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
    <motion.div className="w-full grid grid-cols-2 sm:grid-cols-4 gap-10 place-items-center py-8">
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
          className="opacity-70 hover:opacity-100 transition-opacity duration-300 text-[oklch(0.9_0.01_270)]"
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
      <h2 className="text-center text-6xl font-bold ">
        Everything you need to find <br /> and manage top talent.
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-2 gap-y-3 mt-20 px-10">
        {features.map((feature) => (
          <Card className="bg-black border-black shadow-blue-900">
            <CardContent>
              <div className="flex items-center justify-center flex-col gap-5">
                <feature.icon size={30} strokeWidth={2} color="white" />
                <TooltipProvider>
                  <Tooltip delayDuration={50}>
                    <TooltipTrigger>
                      <h3 className="text-gray-400 hover:text-gray-100 transition-all delay-50 ease-in-out cursor-default">
                        {feature.title}
                      </h3>
                    </TooltipTrigger>
                    <TooltipContent
                      arrowClassName="bg-white fill-white"
                      sideOffset={45}
                      className="bg-white text-gray-800 max-w-[200px] text-sm py-3"
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
    if (title === "Starter") {
      return "text-yellow-500";
    } else if (title === "Pro") {
      return "text-primary";
    } else {
      return "text-purple-500";
    }
  };

  return (
    <div>
      <h1 className="text-gradient-blaze text-4xl mb-14 font-bold text-center">
        Find The Model which suits you best.
      </h1>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-3 w-[1200px] mx-auto">
        {pricingPlans.map((plan) => (
          <Card className="bg-black border-black shadow-slate-600">
            <CardHeader>
              <CardTitle
                className={cn(
                  "text-white text-3xl font-light",
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
                <h3 className={cn("text-5xl mt-2 mb-5 ")}>{plan.price}</h3>
                <Button className="w-full bg-white text-black hover:text-white delay-50 transition-all ease-in">
                  {plan.buttonText}
                </Button>
                <div>
                  <ul className="mt-4 space-y-2">
                    {plan.features.map((feature) => (
                      <li className="flex gap-3 items-center">
                        <span className="bg-primary p-0.5  rounded-full flex items-center justify-center">
                          <Check size={20} />
                        </span>{" "}
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
