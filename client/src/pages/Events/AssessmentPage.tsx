import CreateAssessmentForm from "@/components/Assessment/CreateAssessmentForm";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";

const AssessmentPage = () => {
  return (
    <section className="mx-auto mt-5 max-w-[800px] ">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-5 text-gradient-contrast "
      >
        Create and Assign Assessment
      </motion.h1>
      <Separator />
      <CreateAssessmentForm />
    </section>
  );
};

export default AssessmentPage;
