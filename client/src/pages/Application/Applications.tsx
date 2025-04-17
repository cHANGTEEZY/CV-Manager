import ApplicationTable from "@/components/Application/ApplicationTable";
import Spinner from "@/components/Loading/Spinner";
import useTableData from "@/hooks/use-table-data";
import { motion } from "framer-motion";
import { tableData } from "@/constants/TableData";

const Applications = () => {
  // const data = useTableData();

  // if (!data) {
  //   return <Spinner />;
  // }

  return (
    <section className="m-5 overflow-hidden ">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold mb-5"
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
        <ApplicationTable tableData={tableData} />
      </motion.div>
    </section>
  );
};

export default Applications;
