import {
  assessment,
  interviewEvents,
  latestEvents,
  monitorSingleApplicants,
  sendEmail,
  trackAllApplicants,
} from '@/assets/images';

export const carouselContent = [
  {
    title: ' All Applicants',
    description: 'Track all applicants in each step',
    image: trackAllApplicants,
  },
  {
    title: 'Applicant Profile',
    description: 'See detail description and overview of indiviual applicant',
    image: monitorSingleApplicants,
  },
  {
    title: 'Email',
    description: 'Send acceptance and rejection email to candidates',
    image: sendEmail,
  },
  {
    title: 'Assessment',
    description:
      'Assign Custom assignement to applicants to test their knowledge',
    image: assessment,
  },
  {
    title: 'Interview',
    description: 'Schedule Interview with applicants',
    image: interviewEvents,
  },
  {
    title: 'Latest Events',
    description: 'Track latest events and interview schdules live on dashbord',
    image: latestEvents,
  },
];
