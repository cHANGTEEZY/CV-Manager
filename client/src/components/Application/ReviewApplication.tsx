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
import { useParams } from "react-router-dom";
import { supabase } from "@/utils/supabaseClient";

// const dummyAssignmentData = [
//   {
//     title: "Assignment 1",
//     remarks: "Completed in time",
//     dueDate: "Apr 15,2025",
//     submittedDate: "Apr 14,2025",
//   },
//   {
//     title: "Assignent 2",
//     remarks: "Late submission",
//     dueDate: "Apr 15,2025",
//     submittedDate: "Apr 18,2025",
//   },
//   {
//     title: "Assignent 3",
//     remarks: "Not submitted",
//     dueDate: "Apr 15,2025",
//     submittedDate: "NA",
//   },
// ];

const ReviewApplicationForm = () => {
  const { id } = useParams();

  const [userData, setUserData] = useState({});
  const [eventData, setEventData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        setIsLoading(true);
        const { data: eventData, error: eventError } = await supabase
          .from("events")
          .select("*")
          .eq("id", id);
        if (eventError || !eventData) {
          throw eventError;
        }
        console.log("event data", eventData[0].applicant_email);

        const { data: userData, error: userError } = await supabase
          .from("applicant_details")
          .select("*")
          .eq("applicant_email", eventData[0].applicant_email);

        if (userError || !userData) {
          throw userError;
        }

        console.log("User data is ", userData[0]);

        setUserData({
          name: userData[0].applicant_name,
          email: userData[0].applicant_email,
          phoneNo: userData[0].applicant_phone_number,
          appliedPosition: userData[0].applied_position,
        });

        const formattedEventData = eventData.map((event) => {
          const eventDate = new Date(event.event_date_time);
          const formattedDate = eventDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          });
          const formattedTime = eventDate.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
          });

          let status = "Scheduled";
          if (event.interview_result === "pass") {
            status = "Passed";
          } else if (event.interview_result === "fail") {
            status = "Failed";
          }

          return {
            title: event.event_name,
            interviewDate: `${formattedDate} - ${formattedTime}`,
            status: status,
          };
        });

        setEventData(formattedEventData);
        setAssignmentData([]);
        setIsLoading(false);
      } catch (error) {
        console.error(error);
      }
    };
    getData();
  }, [id]);

  return (
    <section>
      {isLoading ? (
        <div className="flex w-full items-center justify-center mt-50 text-muted-foreground">
          <h1 className="animate-pulse text-2xl">Loading user data...</h1>
        </div>
      ) : Object.keys(userData).length > 0 ? (
        <div>
          <div>
            <Card>
              <CardContent>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4">
                    <Avatar className="h-17 w-17">
                      <AvatarFallback>
                        {userData.name
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h2 className="text-xl font-semibold">
                        {userData?.name || "NA"}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {userData?.email || "NA"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userData?.phoneNo || "NA"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {userData?.appliedPosition || "NA"}
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
          </div>

          <Separator className="mt-7" />
          <ApplicantTimeLine currentState={1} />
          <Separator className="mt-7" />
          <div className="mt-5">
            <h2 className="text-xl font-semibold mb-4 text-primary">
              View Applicant's events
            </h2>
            <Card className="mb-10">
              <CardHeader className="border-b">
                <CardTitle>Interview Events</CardTitle>
                <CardDescription>Monitor applicants events</CardDescription>
              </CardHeader>
              <CardContent>
                {eventData.length > 0 ? (
                  <div className="space-y-4">
                    {eventData.map((event, index) => (
                      <div
                        key={index}
                        className={`flex justify-between items-center border p-5 rounded-2xl`}
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
                          className={`${
                            event.status === "Passed"
                              ? "bg-green-300 text-green-600"
                              : event.status === "Scheduled"
                              ? "bg-amber-200 text-amber-600"
                              : "bg-red-300 text-red-500"
                          } px-3 py-1 rounded-sm text-sm`}
                        >
                          {event.status}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex w-full items-center justify-center text-muted-foreground">
                    <h1 className="text-2xl">
                      No Interview data found for the given user
                    </h1>
                  </div>
                )}
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="border-b ">
                <CardTitle>Assignment Status</CardTitle>
                <CardDescription>Monitor assignment Status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {assignmentData.length > 0 ? (
                    assignmentData.map((assignment, index) => {
                      const isNotSubmitted = assignment.submittedDate === "NA";
                      const isLate =
                        !isNotSubmitted &&
                        new Date(assignment.submittedDate) >
                          new Date(assignment.dueDate);

                      return (
                        <div
                          className={`flex justify-between items-center p-4 border rounded-2xl ${
                            isNotSubmitted
                              ? "bg-destructive/80 border-destructive border-2"
                              : isLate
                              ? "  bg-orange-200/20 border-orange-400 border-2"
                              : "bg-green-200/50 border-green-300 border-2"
                          }`}
                          key={index}
                        >
                          <div>
                            <h4 className="font-bold text-primary-text">
                              {assignment?.title}
                            </h4>
                            <p className="text-paragraph-text">
                              {assignment?.remarks}
                            </p>
                          </div>
                          <div className="text-sm text-right">
                            <p>Due: {assignment.dueDate}</p>
                            <p>Submitted: {assignment.submittedDate}</p>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="flex w-full items-center justify-center text-muted-foreground">
                      <h1 className="text-2xl">
                        No Assignment data found for the given user
                      </h1>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
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
