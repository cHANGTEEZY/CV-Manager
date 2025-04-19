import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import ReviewApplicationFrom from "@/components/Application/ReviewApplication";

const ReviewApplications = () => {
  const { id } = useParams();

  return (
    <section className="mx-auto mt-5 max-w-[800px] ">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold mb-5 text-heading"
      >
        Monitor and Search All applications
      </motion.h1>
      <ReviewApplicationFrom eventId={id} />
    </section>
  );
};

export default ReviewApplications;
