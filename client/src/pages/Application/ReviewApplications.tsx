import { motion } from "framer-motion";

const ReviewApplications = () => {
  return (
    <section className="m-5">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold mb-5 text-heading"
      >
        Monitor and Search All applications
      </motion.h1>
      <p className=""></p>
    </section>
  );
};

export default ReviewApplications;
