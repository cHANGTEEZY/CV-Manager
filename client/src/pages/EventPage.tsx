import AddEventInfo from "@/components/Calendar/add-even-info";
import { DateEvents } from "@/components/Calendar/date-events";

const EventPage = () => {
  return (
    <div className="flex-1/2 h-full px-5 py-2 space-y-2">
      <DateEvents />
      <AddEventInfo />
    </div>
  );
};

export default EventPage;
