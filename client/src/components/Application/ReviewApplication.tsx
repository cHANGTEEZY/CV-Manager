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

const dummyUserData = {
  name: "Sushank Gurung",
  email: "Sushank@gmail.com",
  phoneNo: "123123123123123123",
  appliedPosition: "Junior React Developer",
};

const dummyInterviewEvents = [
  {
    title: "Technical Interview",
    interviewDate: "Apr 14,2025 - 10:00 AM",
    status: "Passed",
  },
  {
    title: "HR Interview",
    interviewDate: "Apr 18,2025 - 02:00 PM",
    status: "Scheduled",
  },
  {
    title: "HR Interview",
    interviewDate: "Apr 18,2025 - 02:00 PM",
    status: "Failed",
  },
];

const dummyAssignmentData = [
  {
    title: "Assignment 1",
    remarks: "Completed in time",
    dueDate: "Apr 15,2025",
    submittedDate: "Apr 14,2025",
  },
  {
    title: "Assignent 2",
    remarks: "Late submission",
    dueDate: "Apr 15,2025",
    submittedDate: "Apr 18,2025",
  },
  {
    title: "Assignent 3",
    remarks: "Not submitted",
    dueDate: "Apr 15,2025",
    submittedDate: "NA",
  },
];

const ReviewApplicationForm = () => {
  const [userData, setUserData] = useState({});
  const [eventData, setEventData] = useState([]);
  const [assignmentData, setAssignmentData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setIsLoading(true);
      // await new Promise((resolve) => setTimeout(resolve, 500));
      setUserData(dummyUserData);
      setEventData(dummyInterviewEvents);
      setAssignmentData(dummyAssignmentData);
      setIsLoading(false);
    };
    getData();
  }, [userData]);

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
          <ApplicantTimeLine />
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
                    {eventData.map((event) => (
                      <div
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
                  {assignmentData.map((assignment) => {
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
                        key={assignment.title}
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
                  })}
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
