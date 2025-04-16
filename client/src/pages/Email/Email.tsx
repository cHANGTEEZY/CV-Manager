import { motion } from "framer-motion";
import { Separator } from "@/components/ui/separator";
import EmailDraft from "@/components/Email/EmailDraft";

const Email = () => {
  return (
    <section className="m-5">
      <div className="space-y-2 mb-6">
        <motion.h1 className="text-3xl font-bold">Email</motion.h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Send email to applicants
        </p>
      </div>
      <Separator className="my-6" />
      <EmailDraft />
    </section>
  );
};

export default Email;
