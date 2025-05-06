import { useState } from 'react';
import { motion } from 'framer-motion';

const applicationFooterContents = [
  {
    row: 1,
    contents: ['About', 'Features', 'Pricing', 'Contact', 'Blog'],
  },
  {
    row: 2,
    contents: ['Documentation', 'FAQ', 'Support'],
  },
  {
    row: 3,
    contents: ['X', 'Linkedin', 'Youtube'],
  },
];

const socialIcons = {
  X: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  ),
  Linkedin: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  Youtube: () => (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function EnhancedFooter() {
  const [hoveredLink, setHoveredLink] = useState(null);
  const [emailValue, setEmailValue] = useState('');

  const handleEmailChange = (e) => {
    setEmailValue(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Thank you for subscribing with: ${emailValue}`);
    setEmailValue('');
  };

  // Animation variants
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
      className="bg-background px-6 py-20 dark:border-slate-800"
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
              <svg
                viewBox="0 0 200.87 54"
                xmlns="http://www.w3.org/2000/svg"
                className="mb-4 h-12 w-auto"
              >
                <g fill="currentColor" className="text-primary">
                  <path d="m18 18h-18v18l18 18v-18h18l-18-18h18v-18h-36z" />
                  <path d="m63.37 41.89h6.01v-12.95h14.32v-5.04h-14.32v-8.13h15.39v-5.16h-21.4z" />
                  <path d="m98.17 19.53c-1.46 0-2.62.33-3.49.99s-1.5 1.64-1.91 2.94h-.06v-3.74h-5.54v22.17h5.75v-12.28c0-1.15.19-2.1.58-2.87.39-.76.91-1.33 1.59-1.71s1.43-.57 2.27-.57c.53 0 1.04.01 1.53.04s.84.06 1.05.08v-4.98c-.22-.01-.48-.03-.78-.05-.29-.02-.62-.03-.99-.03z" />
                  <path d="m117.48 22.79h-.06c-.45-.78-1.01-1.43-1.68-1.95s-1.42-.91-2.26-1.18c-.83-.27-1.73-.4-2.7-.4-1.89 0-3.56.49-5 1.46s-2.57 2.32-3.37 4.05-1.21 3.73-1.21 6.01.4 4.33 1.2 6.07 1.92 3.09 3.36 4.05 3.13 1.45 5.06 1.45c.97 0 1.87-.14 2.7-.43s1.58-.71 2.25-1.26 1.21-1.25 1.65-2.09h.08v3.32h5.61v-22.17h-5.63zm-.45 11.61c-.46 1.02-1.09 1.81-1.91 2.37s-1.78.84-2.89.84c-1.04 0-1.95-.27-2.73-.8s-1.39-1.31-1.83-2.32c-.43-1.01-.65-2.25-.65-3.71s.22-2.71.65-3.72 1.04-1.78 1.83-2.31 1.69-.8 2.73-.8c1.11 0 2.07.28 2.89.84s1.46 1.35 1.91 2.37c.46 1.02.68 2.23.68 3.61s-.23 2.59-.68 3.61z" />
                  <path d="m156.76 20.19c-1.12-.61-2.38-.91-3.78-.91-1.23 0-2.36.22-3.38.65s-1.89 1.05-2.6 1.86c-.46.52-.82 1.1-1.1 1.73-.38-1.13-1.04-2.06-1.99-2.79-1.25-.97-2.72-1.45-4.41-1.45-1.04 0-2.02.19-2.96.58-.94.38-1.76.98-2.47 1.77-.51.57-.93 1.25-1.27 2.03v-3.94h-5.54v22.17h5.75v-13.17c0-1.01.19-1.86.57-2.55s.89-1.22 1.52-1.57c.64-.36 1.33-.54 2.09-.54 1.15 0 2.08.35 2.79 1.06s1.07 1.66 1.07 2.84v13.92h5.56v-13.48c0-.85.17-1.61.5-2.27s.81-1.17 1.42-1.53 1.34-.55 2.19-.55c1.08 0 2 .33 2.77 1 .77.66 1.15 1.7 1.15 3.12v13.71h5.73v-14.66c0-1.72-.33-3.17-.98-4.36-.65-1.18-1.54-2.08-2.66-2.69z" />
                  <path d="m182.08 22.43c-.94-1.02-2.08-1.81-3.39-2.37-1.32-.56-2.79-.84-4.41-.84-2.1 0-3.96.5-5.57 1.49-1.62.99-2.88 2.37-3.8 4.12s-1.38 3.75-1.38 6 .45 4.23 1.34 5.97c.9 1.74 2.17 3.11 3.81 4.1s3.58 1.49 5.81 1.49c1.76 0 3.37-.32 4.83-.95s2.66-1.5 3.62-2.61 1.58-2.4 1.86-3.85h-5.31c-.2.59-.51 1.11-.95 1.56s-.98.81-1.64 1.06-1.41.38-2.25.38c-1.18 0-2.17-.25-2.99-.76-.82-.5-1.45-1.21-1.88-2.12-.39-.82-.6-1.77-.64-2.83h15.88v-1.55c0-1.69-.26-3.24-.77-4.65s-1.24-2.62-2.18-3.64zm-12.89 6.05c.09-.78.28-1.49.59-2.11.43-.86 1.04-1.53 1.83-2s1.72-.7 2.78-.7 2.03.23 2.81.7 1.39 1.13 1.82 2c.31.62.5 1.33.59 2.11h-10.41z" />
                  <path d="m200.09 19.56c-.29-.02-.62-.03-.99-.03-1.46 0-2.62.33-3.49.99s-1.5 1.64-1.91 2.94h-.06v-3.74h-5.54v22.17h5.75v-12.28c0-1.15.19-2.1.58-2.87.38-.76.91-1.33 1.58-1.71s1.43-.57 2.27-.57c.53 0 1.04.01 1.53.04s.84.06 1.05.08v-4.98c-.22-.01-.48-.03-.78-.05z" />
                </g>
              </svg>
              <p className="text-muted-foreground max-w-md text-sm">
                Elevate your digital experience with our innovative platform.
                Built for creators, designed for performance.
              </p>

              {/* Newsletter subscription */}
              <div className="mt-6">
                <h4 className="mb-2 text-sm font-medium">
                  Subscribe to our newsletter
                </h4>
                <form onSubmit={handleSubmit} className="mt-2 flex max-w-sm">
                  <input
                    type="email"
                    value={emailValue}
                    onChange={handleEmailChange}
                    placeholder="Your email address"
                    className="bg-background focus:ring-primary w-full rounded-l border border-r-0 px-3 py-2 text-sm focus:ring-1 focus:outline-none"
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
            {applicationFooterContents.map((footerSection, index) => (
              <div key={index} className="flex flex-col space-y-4">
                <h4 className="mb-1 text-sm font-medium">
                  {index === 0
                    ? 'Company'
                    : index === 1
                      ? 'Resources'
                      : 'Connect'}
                </h4>
                <ul className="space-y-3">
                  {footerSection.contents.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <motion.a
                        href="#"
                        className="text-muted-foreground hover:text-primary flex items-center text-sm transition-colors duration-200"
                        onMouseEnter={() =>
                          setHoveredLink(`${index}-${linkIndex}`)
                        }
                        onMouseLeave={() => setHoveredLink(null)}
                        whileHover={{ x: 5 }}
                      >
                        {index === 2 ? (
                          <span className="flex items-center gap-2">
                            {socialIcons[link] && socialIcons[link]()}
                            {link}
                          </span>
                        ) : (
                          link
                        )}
                        {hoveredLink === `${index}-${linkIndex}` && (
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
            &copy; {new Date().getFullYear()} Framer. All rights reserved.
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
