import { motion } from 'framer-motion';

import FinalReviewCandidates from '@/components/Application/FinalCandidates';
import { Separator } from '@/components/ui/separator';

const FinalReview = () => {
  return (
    <section className="mx-auto mt-5 max-w-[800px]">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gradient-contrast mb-5 text-4xl font-bold"
      >
        Final Review and Onboard Candidates
      </motion.h1>
      <Separator />
      <motion.div>
        <FinalReviewCandidates />
      </motion.div>
    </section>
  );
};

export default FinalReview;
