import { z } from 'zod';

export const assessmentSchema = z.object({
  title: z.enum(
    [
      'Full Stack Assessment Round 1',
      'Full Stack Assessment Round 2',
      'Frontend Assessment Round 1',
      'Frontend Assessment Round 2',
      'Backend Assessment Round 1',
      'Backend Assessment Round 2',
      'AI/ML Assessment Round 1',
      'AI/ML Assessment Round 2',
      'Devops Assessment Round 1',
      'Devops Assessment Round 2',
      'UI/UX Assessment Round 1',
      'UI/UX Assessment Round 2',
    ],
    {
      required_error: 'Please select the assessment title',
    }
  ),
  type: z.enum(
    [
      'Full Stack Engineer',
      'Frontend Engineer',
      'Backend Engineer',
      'AI/ML Engineer',
      'Devops Engineer',
      'UI/UX Designer',
    ],
    {
      required_error: 'Please select the assessment type',
    }
  ),

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

export const enhancedAssessmentSchema = z
  .object({
    title: z.enum(
      [
        'Full Stack Assessment Round 1',
        'Full Stack Assessment Round 2',
        'Frontend Assessment Round 1',
        'Frontend Assessment Round 2',
        'Backend Assessment Round 1',
        'Backend Assessment Round 2',
        'AI/ML Assessment Round 1',
        'AI/ML Assessment Round 2',
        'Devops Assessment Round 1',
        'Devops Assessment Round 2',
        'UI/UX Assessment Round 1',
        'UI/UX Assessment Round 2',
      ],
      {
        required_error: 'Please select the assessment title',
      }
    ),
    type: z.enum(
      [
        'Full Stack Engineer',
        'Frontend Engineer',
        'Backend Engineer',
        'AI/ML Engineer',
        'Devops Engineer',
        'UI/UX Designer',
      ],
      {
        required_error: 'Please select the assessment type',
      }
    ),
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
  })
  .refine(
    (data) => {
      const titlePrefix = data.title.split(' ')[0]; // Get "Full Stack", "Frontend", etc.
      const typePrefix = data.type.split(' ')[0]; // Get "Full", "Frontend", etc.

      if (titlePrefix === 'Full' && typePrefix === 'Full') {
        return true;
      }

      return titlePrefix === typePrefix;
    },
    {
      message: 'Assessment title and type must match',
      path: ['type'], // Show error on the type field
    }
  );
