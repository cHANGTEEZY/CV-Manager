import { motion } from "framer-motion";
import EmailBody from "./EmailBody";

const EmailDraft = () => {
  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.32,
      }}
    >
      <h2 className="text-2xl mb-2 text-primary">Create a Draft</h2>
      <section>
        <EmailBody />
      </section>
    </motion.section>
  );
};

export default EmailDraft;
