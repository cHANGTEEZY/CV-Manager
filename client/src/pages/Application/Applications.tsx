import ApplicationTable from "@/components/Application/ApplicationTable";
import Spinner from "@/components/Loading/Spinner";
import useTableData from "@/hooks/use-table-data";
import { motion } from "framer-motion";

const Applications = () => {
  const data = useTableData();

  if (!data) {
    return <Spinner />;
  }

  return (
    <section className="mx-auto mt-5 max-w-[1100px]  ">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-4xl font-bold mb-5 text-gradient-contrast "
      >
        Monitor and Search All applications
      </motion.h1>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.2,
        }}
      >
        <ApplicationTable tableData={data} />
      </motion.div>
    </section>
  );
};

export default Applications;
