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
        <Button variant="outline">Add Event Manually</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>Add Event</DrawerTitle>
          <DrawerDescription>
            <form
              onSubmit={handleSubmit(submitEvent)}
              className="space-y-2 mt-3"
            >
              <div>
                <Input
                  {...register("name")}
                  placeholder="Event Name"
                  type="text"
                />
              </div>
              <div>
                <Input
                  {...register("date")}
                  placeholder="Event Date"
                  type="date"
                />
              </div>
              <div>
                <Input
                  {...register("time")}
                  placeholder="Event Time"
                  type="time"
                />
              </div>
              <div>
                <Input
                  {...register("description")}
                  placeholder="Event Description"
                  type="text"
                />
              </div>
              <Button className="w-full" type="submit">
                Save
              </Button>
            </form>
          </DrawerDescription>
        </DrawerHeader>
        <DrawerFooter>
          <DrawerClose>
            <Button variant={"outline"} className="w-full">
              Cancel
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
};

export default AddEventInfo;
