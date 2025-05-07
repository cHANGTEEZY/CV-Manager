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
