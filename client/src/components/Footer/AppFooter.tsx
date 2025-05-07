import { useState } from 'react';
import { motion } from 'framer-motion';

type FooterSection = {
  title: string;
  links: string[];
};

const footerContents: FooterSection[] = [
  {
    title: 'Company',
    links: ['About', 'Features', 'Pricing', 'Contact', 'Blog'],
  },
  {
    title: 'Resources',
    links: ['Documentation', 'FAQ', 'Support'],
  },
  {
    title: 'Connect',
    links: ['Twitter', 'LinkedIn', 'YouTube'],
  },
];

export default function AppFooter() {
  const [hoveredLink, setHoveredLink] = useState<string | null>(null);

  const footerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  };

  const childVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 },
    },
  };

  return (
    <motion.footer
      className="bg-black px-6 py-20 dark:border-slate-800"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      variants={footerVariants}
    >
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          <motion.div
            className="col-span-12 md:col-span-4"
            variants={childVariants}
          >
            <div className="flex flex-col space-y-4">
              <h2 className="text-primary text-2xl font-bold">CV Manager</h2>
              <p className="text-muted-foreground max-w-md text-sm">
                Elevate your digital experience with our innovative platform.
                Built for creators, designed for performance.
              </p>

              <div className="mt-6">
                <h4 className="mb-2 text-sm font-medium">
                  Subscribe to our newsletter
                </h4>
                <form className="mt-2 flex max-w-sm">
                  <input
                    type="email"
                    placeholder="Your email address"
                    className="focus:ring-primary w-full rounded-l border border-r-0 bg-black px-3 py-2 text-sm focus:ring-1 focus:outline-none"
                    required
                  />
                  <button
                    type="submit"
                    className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-r px-4 py-2 text-sm font-medium transition-colors"
                  >
                    Subscribe
                  </button>
                </form>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="col-span-12 grid grid-cols-1 gap-8 sm:grid-cols-3 md:col-span-8"
            variants={childVariants}
          >
            {footerContents.map((section, sectionIndex) => (
              <div key={sectionIndex} className="flex flex-col space-y-4">
                <h4 className="mb-1 text-sm font-medium">{section.title}</h4>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        href="#"
                        className="text-muted-foreground hover:text-primary flex items-center text-sm transition-colors duration-200"
                        onMouseEnter={() =>
                          setHoveredLink(`${sectionIndex}-${linkIndex}`)
                        }
                        onMouseLeave={() => setHoveredLink(null)}
                        whileHover={{ x: 5 }}
                      >
                        {link}
                        {hoveredLink === `${sectionIndex}-${linkIndex}` && (
                          <motion.span
                            className="text-primary ml-1"
                            initial={{ opacity: 0, x: -5 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            →
                          </motion.span>
                        )}
                      </motion.a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </div>

        <motion.div
          className="text-muted-foreground mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 text-sm md:flex-row"
          variants={childVariants}
        >
          <div>
            &copy; {new Date().getFullYear()} CV Manager. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Cookies
            </a>
          </div>
        </motion.div>
      </div>
    </motion.footer>
  );
}
