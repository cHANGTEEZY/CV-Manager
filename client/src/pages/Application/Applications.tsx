import ApplicationTable from '@/components/Application/ApplicationTable';
import Spinner from '@/components/Loading/Spinner';
import useTableData from '@/hooks/use-table-data';
import { motion } from 'framer-motion';

const Applications = () => {
  const { tableData } = useTableData();

  if (!tableData) {
    return <Spinner />;
  }

  return (
    <section className="mx-auto mt-5 max-w-[1100px]">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gradient-contrast mb-5 text-4xl font-bold"
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
