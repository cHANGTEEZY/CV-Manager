import { framerWhite } from "@/assets/images";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Bird,
  ChevronDown,
  Dribbble,
  Facebook,
  FramerIcon,
  Instagram,
  Linkedin,
  Slack,
  Trello,
  Youtube,
} from "lucide-react";

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
    </section>
  );
};

export default LandingPage;

const Header = () => {
  return (
    <header className="bg-[oklch(0.14_0.02_260)] border-b border-[oklch(1_0_0/8%)] ">
      <nav className="max-w-6xl mx-auto p-4 flex items-center justify-between">
        <span className="font-medium text-lg text-[oklch(0.9_0.01_270)] flex gap-1 items-center ">
          <img src={framerWhite} alt="framer company logo" className="h-10" />
        </span>
        <div className="space-x-2">
          <Button
            variant="ghost"
            className="cursor-pointer text-[oklch(0.9_0.01_270)] hover:bg-[oklch(0.25_0.01_270)] hover:text-[oklch(0.98_0.01_270)]"
          >
            Login
          </Button>
          <Button className="cursor-pointer bg-[oklch(0.65_0.23_25)] text-[oklch(0.98_0.01_25)] hover:bg-[oklch(0.65_0.23_25/90%)]">
            Signup
          </Button>
        </div>
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
          <Button className="bg-[oklch(0.65_0.23_25)] text-[oklch(0.98_0.01_25)] hover:bg-[oklch(0.65_0.23_25/90%)]">
            Get Started
          </Button>
          <Button className="bg-[oklch(0.28_0.02_260)] text-[oklch(0.92_0.01_270)] hover:bg-[oklch(0.28_0.02_260/80%)]">
            Learn More <ChevronDown className="ml-1" size={16} />
          </Button>
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
          <Icon size={30} strokeWidth={1.2} />
        </motion.div>
      ))}
    </motion.div>
  );
};
