import { useEffect, useState } from "react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Send } from "lucide-react";
import { Separator } from "../ui/separator";
import ApplicantTimeLine from "./ApplicantTimeLine";
import { data, useParams } from "react-router-dom";
import { supabase } from "@/utils/supabaseClient";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { motion } from "framer-motion"; // 🚀 Import motion

const ReviewApplicationForm = () => {
  const { id } = useParams();
  const [userData, setUserData] = useState<any>({});
  const [eventData, setEventData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);

        const { data: userData, error: userError } = await supabase
          .from("applicant_details")
          .select("*")
          .eq("id", id)
          .single();

        if (userError) {
          throw userError;
        }

        const { data: allEvents, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .eq("applicant_email", userData.applicant_email);

        if (eventsError) {
          throw eventsError;
        }

        setUserData({
          name: userData.applicant_name,
          email: userData.applicant_email,
          phoneNo: userData.applicant_phone_number,
          appliedPosition: userData.applied_position,
          cvPath: userData.applicant_file_path,
        });

        const sortedEvents = [...allEvents].sort((a, b) => {
          const dateA = new Date(a.event_date_time);
          const dateB = new Date(b.event_date_time);
          const dateDiff = dateA.getTime() - dateB.getTime();
          return dateDiff !== 0
            ? dateDiff
            : dateA.getHours() - dateB.getHours();
        });

        const formattedEventData = sortedEvents.map((event) => {
          const eventDate = new Date(event.event_date_time);
          const formattedDate = eventDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const formattedTime = eventDate.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "2-digit",
            hour12: true,
          });

          let status = "Scheduled";
          if (event.interview_result && event.interview_result !== "pending") {
            const eventStatus = event.interview_result.toLowerCase();
            if (eventStatus.includes("passed")) {
              status = "Passed";
            } else if (
              eventStatus.includes("fail") ||
              eventStatus.includes("rejected")
            ) {
              status = "Failed";
            }
          }

          return {
            title: event.event_name,
            interviewDate: `${formattedDate} - ${formattedTime}`,
            status,
          };
        });

        setEventData(formattedEventData);
        setAssignmentData([]);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setIsLoading(false);
      }
    };

    if (id) {
      getData();
    }
  }, [id]);

  const motionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  return (
    <section>
      {isLoading ? (
        <div className="flex w-full items-center justify-center mt-50 text-muted-foreground">
          <h1 className="animate-pulse text-2xl">Loading user data...</h1>
        </div>
      ) : Object.keys(userData).length > 0 ? (
        <div>
          <Card>
            <CardContent>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <Avatar className="h-17 w-17">
                    <AvatarFallback>
                      {userData.name
                        ?.split(" ")
                        .map((n: string) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h2 className="text-xl font-semibold">
                      {userData.name || "NA"}
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      {userData.email || "NA"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userData.phoneNo || "NA"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {userData.appliedPosition || "NA"}
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="text-green-400 flex items-center gap-2"
                >
                  <Send size={16} /> Contact
                </Button>
              </div>
            </CardContent>
          </Card>

          <Separator className="mt-7" />

          <Tabs defaultValue="timeline" className="w-full mt-5">
            <TabsList className="bg-muted rounded-full p-1 ">
              <TabsTrigger
                value="timeline"
                className=" cursor-pointer rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition"
              >
                Applicant's Timeline
              </TabsTrigger>
              <TabsTrigger
                value="info"
                className="cursor-pointer rounded-full data-[state=active]:bg-primary data-[state=active]:text-white transition"
              >
                Applicant's Info
              </TabsTrigger>
            </TabsList>

            <TabsContent value="timeline" asChild>
              <motion.div
                variants={motionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <ApplicantTimeLine currentState={1} />
                <Separator className="mt-7" />
                <div className="mt-5">
                  <h2 className="text-xl font-semibold mb-4 text-primary">
                    View Applicant's Events
                  </h2>
                  <Card className="mb-10">
                    <CardHeader className="border-b">
                      <CardTitle>Interview Events</CardTitle>
                      <CardDescription>
                        Monitor applicant events
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {eventData.length > 0 ? (
                        <div className="space-y-4">
                          {eventData.map((event, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center border p-5 rounded-2xl"
                            >
                              <div>
                                <h4 className="font-extrabold text-gradient-destructive">
                                  {event.title}
                                </h4>
                                <p className="text-slate-500 text-sm">
                                  {event.interviewDate}
                                </p>
                              </div>
                              <span
                                className={`px-3 py-1 rounded-sm text-sm ${
                                  event.status === "Passed"
                                    ? "bg-green-300 text-green-600"
                                    : event.status === "Scheduled"
                                    ? "bg-amber-200 text-amber-600"
                                    : "bg-red-300 text-red-500"
                                }`}
                              >
                                {event.status}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center text-muted-foreground">
                          No Interview data found
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </motion.div>
            </TabsContent>

            <TabsContent value="info" asChild>
              <motion.div
                variants={motionVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="mt-6"
              >
                <h2 className="text-xl font-semibold mb-4 text-primary">
                  View Applicant's CV
                </h2>
                {userData.cvPath ? (
                  <div className="border rounded-lg overflow-hidden">
                    <iframe
                      src={`${import.meta.env.VITE_SUPABASE_BUCKET_URL}/${
                        userData.cvPath
                      }`}
                      className="w-full h-[700px]"
                      title="Applicant CV"
                    ></iframe>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    CV Not uploaded
                  </div>
                )}
              </motion.div>
            </TabsContent>
          </Tabs>
        </div>
      ) : (
        <div className="flex w-full items-center justify-center mt-50 text-muted-foreground">
          <h1 className="text-2xl">No user data found for the given user</h1>
        </div>
      )}
    </section>
  );
};

export default ReviewApplicationForm;
