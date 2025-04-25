import { motion } from "framer-motion";

import ReviewApplicationFrom from "@/components/Application/ReviewApplication";

const ReviewApplications = () => {
  return (
    <section className="mx-auto mt-5 max-w-[800px] ">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-5 text-gradient-contrast"
      >
        Monitor, Review and Update Applicants Data
      </motion.h1>

      <ReviewApplicationFrom />
    </section>
  );
};

export default ReviewApplications;
