'use client';

import { motion } from 'framer-motion';
import {
  Bird,
  Dribbble,
  Facebook,
  Instagram,
  Linkedin,
  Slack,
  Trello,
  Youtube,
} from 'lucide-react';

export const Customer = () => {
  const logos = [
    Dribbble,
    Bird,
    Linkedin,
    Youtube,
    Slack,
    Trello,
    Instagram,
    Facebook,
  ];

  return (
    <div className="px-4">
      <div className="grid grid-cols-2 gap-12 sm:grid-cols-4">
        {logos.map((Icon, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.1 }}
            className="flex items-center justify-center"
          >
            <Icon
              size={32}
              strokeWidth={1.5}
              className="text-[oklch(0.9_0.01_270)] opacity-70 transition-opacity duration-300 hover:opacity-100"
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};
