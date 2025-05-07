import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Customer } from '@/components/Landing/Customer';
import { Hero } from '@/components/Landing/Hero';
import { Header } from '@/components/Landing/Header';
import { Features } from '@/components/Landing/Features';
import Testimonials from '@/components/Landing/Testimonials';
import CarouselFeatures from '@/components/Landing/CarouselFeatures';
import AppFooter from '@/components/Footer/AppFooter';

const LandingPage = () => {
  return (
    <section className="bg-[oklch(0.14_0.02_260)] text-[oklch(0.9_0.01_270)]">
      <div className="sticky top-0 z-50">
        <Header />
      </div>
      <Hero />
      <div className="group relative mx-auto my-36 max-w-3xl items-center justify-center overflow-hidden rounded-lg border-[oklch(1_0_0/8%)] py-12">
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
      <section className="my-30">
        <h2 className="mb-12 text-center text-4xl font-bold sm:text-5xl">
          Product Features
        </h2>

        <CarouselFeatures />
      </section>

      <section className="m-auto max-w-3xl">
        <motion.div>
          <Features />
        </motion.div>
      </section>
      <div className="my-20">
        <Testimonials />
      </div>
      <AppFooter />
    </section>
  );
};

export default LandingPage;
