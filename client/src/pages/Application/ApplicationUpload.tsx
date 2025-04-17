"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import FormSuccessMessage from "@/components/Application/FormSuccess";
import { supabase } from "@/utils/supabaseClient";

const formSchema = z.object({
  username: z.string().min(2, "Username must be at least 2 characters"),
  phoneNo: z.string().min(10, "Phone number must be at least 10 digits"),
  email: z.string().email("Please enter a valid email address"),
  references: z.string().optional(),
  position: z.string().min(1, "Please select a position"),
  technology: z.string().min(1, "Please select a technology"),
  salary: z.string().min(1, "Please enter your salary expectation"),
  level: z.string().min(1, "Please select your experience level"),
  experience: z.string().min(1, "Please select your years of experience"),
});

type ApplicationFormData = z.infer<typeof formSchema>;

export default function ApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [resumeFile, setResumeFile] = useState<File>();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ApplicationFormData>({
    resolver: zodResolver(formSchema),
  });

  const handleFileChange = (file: File) => {
    setResumeFile(file);
  };

  const onSubmit = async (data: ApplicationFormData) => {
    if (!resumeFile) {
      toast.error("Please upload the applicant's resume");
      return;
    }

    setIsSubmitting(true);

    try {
      const file_path = `applications/${Date.now()}_${resumeFile.name}`;

      const { data: storageData, error: storageError } = await supabase.storage
        .from("cv-file-storage")
        .upload(file_path, resumeFile);

      if (storageError) {
        console.error("Storage error:", storageError);
        toast.error("Error uploading resume file");
        return;
      }

      const applicant_file_path = storageData.path;

      const { error } = await supabase.from("applicant_details").insert([
        {
          applicant_name: data.username,
          applied_position: data.position,
          applicant_status: "filled",
          tech_stack: data.technology,
          applicant_email: data.email,
          applicant_phone_number: data.phoneNo,
          applicant_experience: data.experience,
          applicant_experience_level: data.level,
          expected_salary: data.salary,
          references: data.references,
          applicant_file_path,
        },
      ]);

      if (error) {
        toast.error("Error uploading applicant details: " + error.message);
        return;
      }

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
      <FormSuccessMessage
        setIsSubmitted={setIsSubmitted}
        setResumeFile={setResumeFile}
      />
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
          Upload Application
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
          <FileUpload onFileChange={handleFileChange} showButton={false} />
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

          <div className="flex justify-end mt-3">
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
