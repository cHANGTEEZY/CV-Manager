'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import FileUpload from '@/components/Application/FileUpload';
import { applicantFormFields } from '@/constants/ApplicantForm';
import FormSuccessMessage from '@/components/Application/FormSuccess';
import { supabase } from '@/utils/supabaseClient';
import { FileIcon } from 'lucide-react';

const formSchema = z.object({
  username: z.string().min(2, 'Username must be at least 2 characters'),
  phoneNo: z.string().min(10, 'Phone number must be at least 10 digits'),
  email: z.string().email('Please enter a valid email address'),
  references: z.string().optional(),
  position: z.string().min(1, 'Please select a position'),
  technology: z.string().min(1, 'Please select a technology'),
  salary: z.string().min(1, 'Please enter your salary expectation'),
  level: z.string().min(1, 'Please select your experience level'),
  experience: z.string().min(1, 'Please select your years of experience'),
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
        .from('cv-file-storage')
        .upload(file_path, resumeFile);

      if (storageError) {
        console.error('Storage error:', storageError);
        toast.error('Error uploading resume file');
        return;
      }

      const applicant_file_path = storageData.path;

      const { error } = await supabase.from('applicant_details').insert([
        {
          applicant_name: data.username,
          applied_position: data.position,
          applicant_status: 'filled',
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
        toast.error('Error uploading applicant details: ' + error.message);
        return;
      }

      toast.success('Application submitted successfully!');
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting application:', error);
      toast.error('Failed to submit application. Please try again.');
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
    <section className="mx-auto mt-5 max-w-[800px]">
      <div className="mb-6 space-y-2">
        <motion.h1
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold"
        >
          Upload Application
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
          className="text-sm text-slate-600 dark:text-slate-300"
        >
          Complete the form to upload applicant's details
        </motion.p>
      </div>

      <Separator className="my-6" />

      <div className="flex flex-col">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.2 } }}
          className="flex items-start justify-center"
        >
          <FileUpload onFileChange={handleFileChange} showButton={false} />
        </motion.div>

        <Separator className="mt-12" />

        <motion.form
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0, transition: { delay: 0.3 } }}
          onSubmit={handleSubmit(onSubmit)}
          className="mt-3 mb-10 max-w-[800px] space-y-6"
        >
          <h2 className="text-primary mt-5 mb-4 flex items-center gap-2 text-xl font-semibold">
            <FileIcon className="h-5 w-5" /> Applicant Details
          </h2>
          <Card className="m-0">
            <CardContent>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {applicantFormFields.map((field) => (
                  <div key={field.id} className="space-y-2">
                    <Label htmlFor={field.id} className="font-medium">
                      {field.label}
                    </Label>

                    {field.type === 'select' ? (
                      <div>
                        <Controller
                          name={field.htmlFor as keyof ApplicationFormData}
                          control={control}
                          render={({ field: controllerField }) => (
                            <Select
                              onValueChange={controllerField.onChange}
                              value={controllerField.value || ''}
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
                          <p className="mt-1 text-sm text-red-500">
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
                          className=""
                        />
                        {errors[field.htmlFor as keyof ApplicationFormData] && (
                          <p className="mt-1 text-sm text-red-500">
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

          <div className="mt-3 flex justify-end">
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Application'}
            </Button>
          </div>
        </motion.form>
      </div>
    </section>
  );
}
