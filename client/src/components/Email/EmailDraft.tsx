import { motion } from "framer-motion";
import EmailBody from "./EmailBody";
import { MailPlus } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";

const EmailDraft = () => {
  const [candidateStatus, setCandidateStatus] = useState("");
  const [matchingCandidates, setMatchingCandidates] = useState([]);

  useEffect(() => {
    if (!candidateStatus) return;

    let condition = "";
    if (candidateStatus === "SuccessMail") condition = "Offer";
    else if (candidateStatus === "RejectionMail") condition = "Fail";
    else if (candidateStatus === "AssignmentMail") condition = "Task";
    else return;

    const getMatchingCandidates = async () => {
      try {
        const { data: candidatesData, error } = await supabase
          .from("applicant_details")
          .select("id, applicant_email, applicant_name")
          .eq("applicant_verdict", condition);

        if (error) {
          console.error("Error fetching candidates:", error);
          return;
        }

        // Transform the data structure to match what EmailBody expects
        const formattedCandidates =
          candidatesData?.map((candidate) => ({
            id: candidate.id,
            email: candidate.applicant_email,
            name:
              candidate.applicant_name ||
              candidate.applicant_email.split("@")[0],
          })) || [];

        console.log("Formatted candidates:", formattedCandidates);
        setMatchingCandidates(formattedCandidates);
      } catch (err) {
        console.error("Exception in fetching candidates:", err);
      }
    };

    getMatchingCandidates();
  }, [candidateStatus]);

  return (
    <motion.section
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        duration: 0.32,
      }}
      className="relative"
    >
      <h3 className="text-xl font-semibold mb-2 text-primary flex gap-2 items-center">
        <MailPlus className="h-5 w-5" />
        Create a Draft
      </h3>

      <div className="mt-4">
        <EmailBody
          setCandidateStatus={setCandidateStatus}
          matchingCandidates={matchingCandidates}
        />
      </div>
    </motion.section>
  );
};

export default EmailDraft;
