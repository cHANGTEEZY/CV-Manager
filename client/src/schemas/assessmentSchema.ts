import { z } from 'zod';

export const assessmentSchema = z.object({
  title: z
    .string()
    .nonempty({ message: 'Title is required' })
    .min(4, { message: 'Title must be at least 4 characters long' }),

  type: z.enum(['Full Stack', 'Frontend', 'Backend', 'Devops', 'UI/UX'], {
    required_error: 'Please select the assessment type',
  }),

  level: z.enum(['Intern', 'Junior', 'Intermediate', 'Senior'], {
    required_error: 'Please select the assessment level',
  }),

  formLink: z.string().min(1, {
    message: 'Assessment Link is required',
  }),

  submissionDate: z.date({
    required_error: 'Please specify the submission deadline',
  }),

  requirements: z
    .string()
    .nonempty({ message: 'Requirements cannot be empty' }),
});

export type AssessmentProps = z.infer<typeof assessmentSchema>;
