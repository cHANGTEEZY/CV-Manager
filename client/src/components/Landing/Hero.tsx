'use client';

import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { BanknoteIcon as BanknoteArrowUp } from 'lucide-react';
import { Pricing } from './Pricing';
import UseRedirect from '@/hooks/use-redirect';
import { bgauth, heroProuct } from '@/assets/images';
import { motion } from 'framer-motion';
import { WordRotate } from '../magicui/word-rotate';

export const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden pt-24 pb-32 md:pt-32 md:pb-48">
      <div className="absolute inset-0 z-0">
        <img
          src={bgauth || '/placeholder.svg'}
          alt=""
          className="h-full w-full object-cover"
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <div className="flex flex-col items-center justify-center text-center">
          <motion.h1
            className="text-5xl leading-tight font-bold sm:text-6xl md:text-6xl lg:text-7xl xl:text-8xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <span className="inline-block bg-gradient-to-r from-[oklch(0.7_0.4_25)] via-[oklch(0.65_0.35_320)] to-[oklch(0.6_0.3_280)] bg-clip-text text-transparent">
              Manage it <br /> With Framer
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            className="mt-4 max-w-md text-sm font-normal text-white md:text-3xl"
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
          >
            The HR management tool for{' '}
            <WordRotate words={['Employees', 'Teams', 'Success']} />
          </motion.p>

          <motion.div
            className="mt-12 flex flex-wrap items-center justify-center gap-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease: 'easeOut' }}
          >
            <Button
              onClick={UseRedirect('/dashboard')}
              className="cursor-pointer bg-[oklch(0.65_0.23_25)] text-[oklch(0.98_0.01_25)] hover:bg-[oklch(0.65_0.23_25/90%)]"
              size="lg"
            >
              Get Started
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  className="cursor-pointer bg-[oklch(0.28_0.02_260)] text-[oklch(0.92_0.01_270)] hover:bg-[oklch(0.28_0.02_260/80%)]"
                  size="lg"
                >
                  Find your plan <BanknoteArrowUp className="ml-2 h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="w-[max-content] border-none bg-black p-0">
                <Pricing />
              </DialogContent>
            </Dialog>
          </motion.div>
        </div>
      </div>

      <motion.div
        className="relative z-10 mt-24 flex h-[600px] w-full items-center justify-center"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.6, ease: 'easeOut' }}
      >
        <div className="relative">
          <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-purple-600 via-blue-500 to-purple-600 opacity-70 blur-lg"></div>
          <img
            src={heroProuct || '/placeholder.svg'}
            alt="Product dashboard"
            className="relative z-10 max-h-full max-w-full rounded-lg shadow-2xl md:max-w-[85%] lg:max-w-[1200px]"
          />
        </div>
      </motion.div>
    </section>
  );
};
