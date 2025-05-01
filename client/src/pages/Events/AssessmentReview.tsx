import ReviewAssessment from '@/components/Calendar/review-assessment';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

const ReviewEvent = () => {
  return (
    <section className="mx-auto mt-5 max-w-[800px]">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gradient-contrast mb-5 text-4xl font-bold"
      >
        Review Assessment Results
      </motion.h1>
      <Separator />
      <ReviewAssessment />
    </section>
  );
};

export default ReviewEvent;
