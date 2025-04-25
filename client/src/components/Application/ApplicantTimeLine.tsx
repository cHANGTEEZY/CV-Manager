import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { Button } from "../ui/button";

const ApplicantTimeline = ({ currentState }) => {
  const [currentStep, setCurrentStep] = useState(2);

  const timelineSteps = [
    { id: 1, label: "Application", description: "Submit your application" },
    { id: 2, label: "Review", description: "Application under review" },
    { id: 3, label: "Interview", description: "Schedule an interview" },
    { id: 4, label: "Assessment", description: "Complete assessments" },
    { id: 5, label: "Decision", description: "Final decision" },
    { id: 6, label: "Onboarding", description: "Welcome onboard!" },
  ];

  const handleStepClick = (stepId) => {
    setCurrentStep(stepId);
  };

  const getStepColor = (stepId: number, currentStep: number) => {
    if (stepId === currentStep) return "text-green-500";
    if (stepId > currentStep) return "text-foreground";
    if (stepId < currentStep) return "text-green-500";
  };

  const setStepMultiplier = (currentStep: number) => {
    if (currentStep === 1) return 150;
    if (currentStep === 2) return 140;
    if (currentStep === 3) return 120;
    if (currentStep === 4) return 110;
    if (currentStep === 5) return 100;
    if (currentStep === 6) return 100;
  };

  return (
    <>
      <h2 className="text-xl font-semibold mb-4 text-primary mt-7">
        Manage Timeline
      </h2>
      <Card>
        <CardHeader>
          <CardTitle>Applicant's Timeline</CardTitle>
          <CardDescription>Click and manage timeline</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pb-16">
            <div className="absolute top-5 left-0 h-1 bg-gray-200 w-full">
              <div
                className="h-full bg-primary transition-all duration-500 ease-in-out"
                style={{
                  width: `${
                    ((currentStep -
                      parseInt(`${currentStep === 1 ? "0" : "1"}`)) *
                      parseInt(`${setStepMultiplier(currentStep)}`)) /
                    (timelineSteps.length -
                      parseInt(`${currentStep === 1 ? "-10" : "1"}`))
                  }%`,
                }}
              ></div>
            </div>

            <div className="flex justify-between w-full relative">
              {timelineSteps.map((step) => (
                <div
                  key={step.id}
                  className="flex flex-col items-center cursor-pointer"
                  onClick={() => handleStepClick(step.id)}
                >
                  <Button
                    className={`w-10 cursor-pointer h-10 rounded-full flex items-center justify-center z-10 mb-2 transition-all duration-300 ${
                      step.id <= currentStep
                        ? "bg-primary text-white"
                        : "bg-white border-2 border-gray-300 text-gray-500"
                    }`}
                  >
                    {step.id}
                  </Button>
                  <p
                    className={`text-sm font-medium ${getStepColor(
                      step.id,
                      currentStep
                    )}`}
                  >
                    {step.label}
                  </p>
                  <p className="text-xs text-gray-400 max-w-xs text-center mt-1">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
};

export default ApplicantTimeline;
