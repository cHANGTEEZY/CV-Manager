// import { z } from "zod";
import { motion } from "framer-motion";
import { Input } from "../ui/input";

const ApplicationDetailForm = () => {
  return (
    <section>
      <motion.h2
        initial={{
          opacity: 0,
          y: -10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="font-bold text-2xl"
      >
        Application Detail
      </motion.h2>
      {/* <motion.form
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
          transition: {
            delay: 0.1,
            type: "",
          },
        }}
      >
        <div>
          <label htmlFor="name">Applicant Name</label>
          <Input type="text" placeholder="john doe" />
        </div>
        <div>
          <label htmlFor="phone-no">Phone number</label>
          <Input type="number" placeholder="+977  984199999" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Input type="text" placeholder="+977  984199999" />
        </div>
        <div>
          <label htmlFor="references">References</label>
          <Input type="text" placeholder="+977  984199999" />
        </div>
        <div>
          <label htmlFor="applicant-phoneno">Phone text</label>
          <Input type="text" placeholder="+977  984199999" />
        </div>
        <div>
          <label htmlFor="applicant-phoneno">Phone text</label>
          <Input type="text" placeholder="+977  984199999" />
        </div>
        <div>
          <label htmlFor="applicant-phoneno">Phone text</label>
          <Input type="text" placeholder="+977  984199999" />
        </div>
        <div>
          <label htmlFor="applicant-phoneno">Phone text</label>
          <Input type="text" placeholder="+977  984199999" />
        </div>
      </motion.form> */}
    </section>
  );
};

export default ApplicationDetailForm;
