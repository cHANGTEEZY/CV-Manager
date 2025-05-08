import CreateInterviewerForm from '@/components/Calendar/create-interviewer';
import ManageInterviewerList from '@/components/Calendar/manage-interviewer';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';

const CreateInterviewer = () => {
  return (
    <section className="mx-auto mt-5 max-w-[800px]">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gradient-contrast mb-5 text-4xl font-bold"
      >
        Create and Manage Interviewer
      </motion.h1>
      <Separator />
      <ManageInterviewerList />
      <Separator />
      <CreateInterviewerForm />
    </section>
  );
};

export default CreateInterviewer;
