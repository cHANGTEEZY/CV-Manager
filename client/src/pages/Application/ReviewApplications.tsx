import { motion } from "framer-motion";
import { useParams } from "react-router-dom";

import ReviewApplicationFrom from "@/components/Application/ReviewApplication";

type paramsProp = {
  id: string;
};

const ReviewApplications = () => {
  const { id } = useParams<paramsProp>();

  return (
    <section className="mx-auto mt-5 max-w-[800px] ">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-5 text-gradient-contrast"
      >
        Monitor, Review and Update Applicants Data
      </motion.h1>

      <ReviewApplicationFrom eventId={id} />
    </section>
  );
};

export default ReviewApplications;
