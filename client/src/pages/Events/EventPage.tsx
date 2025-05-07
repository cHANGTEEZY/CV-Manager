import { useState } from 'react';
import CreateEvent from '@/components/Calendar/add-even-info';
import { DateEvents } from '@/components/Calendar/date-events';
import { Separator } from '@/components/ui/separator';
import { motion } from 'framer-motion';
import { useEvents } from '@/hooks/use-event-data';

const EventPage = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { events, isLoading, formatEventTime } = useEvents(date);

  return (
    <section className="mx-auto mt-5 max-w-[800px]">
      <motion.h1
        initial={{ opacity: 0, x: -7 }}
        animate={{ opacity: 1, x: 0 }}
        className="text-gradient-contrast mb-5 text-4xl font-bold"
      >
        List and Create all your events
      </motion.h1>
      <Separator />
      <div>
        <DateEvents
          date={date}
          setDate={setDate}
          events={events}
          isLoading={isLoading}
          formatEventTime={formatEventTime}
        />
        <Separator />
        <CreateEvent setDate={setDate} />
      </div>
    </section>
  );
};

export default EventPage;
