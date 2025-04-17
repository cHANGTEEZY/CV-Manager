import CreateEvent from "@/components/Calendar/add-even-info";
import { DateEvents } from "@/components/Calendar/date-events";
import { motion } from "framer-motion";

const EventPage = () => {
  return (
    <section className="flex-1/2 h-full m-5 py-2 space-y-2">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-3xl font-bold mb-5"
      >
        List and Create all your events
      </motion.h1>
      <DateEvents />
      <CreateEvent />
    </section>
  );
};

export default EventPage;
