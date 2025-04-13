import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

const AddEventInfo = () => {
  const schema = z.object({
    name: z.string().min(2).max(100),
    date: z.string().min(10).max(10),
    time: z.string().min(5).max(5),
    description: z
      .string()
      .min(10, {
        message: "Event description must be at least 10 characters long",
      })
      .max(500, {
        message: "Event description must be at most 500 characters long",
      })
      .optional(),
  });

  type EventSchema = z.infer<typeof schema>;

  const { register, handleSubmit } = useForm<EventSchema>({
    defaultValues: {
      name: "",
      date: "",
      time: "",
    },
    resolver: zodResolver(schema),
  });

  const submitEvent = (event: EventSchema) => {
    console.log(event);
  };

  return (
    <Drawer>
      <DrawerTrigger>
        <Button variant="default" className="cursor-pointer">
          Add Event Manually
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <form
          onSubmit={handleSubmit(submitEvent)}
          className="space-y-2 mt-3 flex justify-center items-center flex-col"
        >
          <DrawerHeader>
            <DrawerTitle className="text-center">Add Event</DrawerTitle>
            <DrawerDescription className="space-y-2 mt-4">
              <div className="w-md">
                <Input
                  {...register("name")}
                  placeholder="Event Name"
                  type="text"
                />
              </div>

              <div className="w-md">
                <Popover>
                  <PopoverTrigger className="w-full">
                    <Input
                      {...register("date")}
                      placeholder="Event Date"
                      type="text"
                    />
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="w-md">
                <Input
                  {...register("time")}
                  placeholder="Event time"
                  type="time"
                />
              </div>
              <div className="w-md">
                <Input
                  {...register("description")}
                  placeholder="Event Description"
                  type="text"
                />
              </div>
            </DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <DrawerClose>
              <Button variant={"outline"} className="w-md">
                Cancel
              </Button>
            </DrawerClose>
            <Button className="w-md" type="submit">
              Save
            </Button>
          </DrawerFooter>
        </form>
      </DrawerContent>
    </Drawer>
  );
};

export default AddEventInfo;
