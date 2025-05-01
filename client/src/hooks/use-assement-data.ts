import { supabase } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import { format } from 'date-fns';

type assessmentEventProps = {
  id: string;
  assessment_id: string;
  candidate_email: string;
  status: string;
  due_date: Date;
  title: string;
  type: string;
  level: string;
  requirements: string;
  formLink: string;
};

export const useAssessmentData = (date: Date) => {
  const [assessmentsData, setAssessmentsData] = useState<
    assessmentEventProps[]
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchAssessments = async () => {
      setIsLoading(true);
      try {
        const { data: assessmentEvents, error: eventError } = await supabase
          .from('assessment_event')
          .select('*');

        if (eventError || !assessmentEvents)
          throw eventError || new Error('No events found');

        const mergedAssessments: assessmentEventProps[] = [];

        for (const event of assessmentEvents) {
          const { data: assessmentDetails, error: detailsError } =
            await supabase
              .from('assessment_table')
              .select('*')
              .eq('id', event.assessment_id)
              .single();

          if (detailsError) {
            console.warn(
              `Missing assessment details for ID ${event.assessment_id}`
            );
            continue;
          }

          mergedAssessments.push({
            id: event.id,
            assessment_id: event.assessment_id,
            candidate_email: event.candidate_email,
            status: event.status,
            due_date: event.due_date,
            title: assessmentDetails.title,
            type: assessmentDetails.type,
            level: assessmentDetails.level,
            requirements: assessmentDetails.requirements,
            formLink: assessmentDetails.formLink,
          });
        }

        setAssessmentsData(mergedAssessments);
      } catch (error) {
        console.error('Error fetching assessments:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (date) {
      fetchAssessments();
    }
  }, [date]);

  const formatAssessmentDate = (date: string) => {
    const assessmentDate = new Date(date);
    return format(assessmentDate, 'd MMM, yyyy');
  };

  return { assessmentsData, isLoading, formatAssessmentDate };
};
