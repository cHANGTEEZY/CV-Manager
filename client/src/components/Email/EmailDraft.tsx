import { motion } from "framer-motion";
import EmailBody from "./EmailBody";
import { MailPlus } from "lucide-react";

const EmailDraft = () => {
  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.32,
      }}
    >
      <h3 className="text-xl font-semibold mb-2 text-primary flex gap-2 items-center">
        <MailPlus className="h-5 w-5" />
        Create a Draft
      </h3>
      <section>
        <EmailBody />
      </section>
    </motion.section>
  );
};

export default EmailDraft;
