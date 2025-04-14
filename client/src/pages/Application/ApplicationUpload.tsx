"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { CheckCircle } from "lucide-react";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import FileUpload from "@/components/Application/FileUpload";
import { applicantFormFields } from "@/constants/ApplicantForm";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  phoneNo: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address"),
  references: z.string().optional(),
  technology: z.string().min(1, "Please select a technology"),
  salary: z.string().min(1, "Please enter your salary expectation"),
  level: z.string().min(1, "Please select your experience level"),
  experience: z.string().min(1, "Please select your years of experience"),
});

type ApplicationFormData = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      phoneNo: "",
      email: "",
      references: "",
      technology: "",
      salary: "",
      level: "",
      experience: "",
    },
  });

  const handleFileChange = (file: File) => {
    setResumeFile(file);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate API call
      console.log("Submitting application:", data);
      console.log("Resume file:", {
        name: resumeFile.name,
        type: resumeFile.type,
        size: `${(resumeFile.size / 1024).toFixed(2)} KB`,
      });

      // Create FormData for submission
      const formData = new FormData();
      formData.append("file", resumeFile);

      // Add all form fields to FormData
      Object.entries(data).forEach(([key, value]) => {
        formData.append(key, value);
      });

      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("Application submitted successfully!");
      setIsSubmitted(true);
    } catch (error) {
      console.error("Error submitting application:", error);
      toast.error("Failed to submit application. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto p-6"
      >
        <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">
              Application Submitted Successfully!
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Thank you for submitting your application. We will review it and
              get back to you soon.
            </p>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                setResumeFile(null);
              }}
            >
              Submit Another Application
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6"
    >
      <div className="space-y-2 mb-6">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="font-bold text-3xl"
        >
          Job Application
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="text-sm text-slate-600 dark:text-slate-300"
        >
          Complete the form below to apply for the position
        </motion.p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          className="flex justify-center items-start"
        >
          <FileUpload onFileChange={handleFileChange} />
        </motion.div>

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-w-[800px]"
        >
          <h2 className="text-xl mt-6">Applicant Details</h2>
          <Card className="m-0">
            <CardContent>
              <div className="grid  grid-cols-1 md:grid-cols-2 gap-4">
                {applicantFormFields.map((field) => (
                  <div key={field.id} className="space-y-2 ">
                    <Label htmlFor={field.id} className="font-medium">
                      {field.label}
                    </Label>

                    {field.type === "select" ? (
                      <div>
                        <Controller
                          name={field.htmlFor as keyof ApplicationFormData}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Select
                              onValueChange={controllerField.onChange}
                              value={controllerField.value || ""}
                            >
                              <SelectTrigger id={field.id}>
                                <SelectValue placeholder={field.placeholder} />
                              </SelectTrigger>
                              <SelectContent>
                                {field.options?.map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        />
                        {errors[field.htmlFor as keyof ApplicationFormData] && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              errors[field.htmlFor as keyof ApplicationFormData]
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    ) : (
                      <div>
                        <Input
                          {...register(
                            field.htmlFor as keyof ApplicationFormData
                          )}
                          id={field.id}
                          type={field.type}
                          placeholder={field.placeholder}
                        />
                        {errors[field.htmlFor as keyof ApplicationFormData] && (
                          <p className="text-red-500 text-sm mt-1">
                            {
                              errors[field.htmlFor as keyof ApplicationFormData]
                                ?.message
                            }
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? "Submitting..." : "Submit Application"}
            </Button>
          </div>
        </motion.form>
      </div>
    </motion.div>
  );
}
