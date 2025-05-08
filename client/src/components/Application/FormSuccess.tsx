import { motion } from 'framer-motion';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { CheckCircle } from 'lucide-react';
import { reload } from '@/utils/reload';

const FormSuccessMessage = ({
  setIsSubmitted,
  setResumeFile,
}: {
  setIsSubmitted: any;
  setResumeFile: any;
}) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="mx-auto max-w-3xl p-6"
    >
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="flex flex-col items-center pt-6 text-center">
          <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
          <h2 className="mb-2 text-2xl font-bold">
            Application Submitted Successfully!
          </h2>

          <Button
            onClick={() => {
              setIsSubmitted(false);
              setResumeFile(null);
              reload();
            }}
          >
            Submit Another Application
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default FormSuccessMessage;
