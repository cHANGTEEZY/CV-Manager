import { motion } from "framer-motion";
import { Card, CardContent } from "../ui/card";
import { Button } from "../ui/button";
import { CheckCircle } from "lucide-react";

const FormSuccessMessage = ({ setIsSubmitted, setResumeFile }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-3xl mx-auto p-6"
    >
      <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
        <CardContent className="pt-6 flex flex-col items-center text-center">
          <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
          <h2 className="text-2xl font-bold mb-2">
            Application Submitted Successfully!
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            You can review the form clicking this link{" "}
            <span className="text-red-400">!!!Work to do!!!</span>
          </p>
          <Button
            onClick={() => {
              setIsSubmitted(false);
              setResumeFile(null);
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
