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

  const formattedDate = format(date, 'yyyy-MM-dd');

  useEffect(() => {
    const fetchAssessments = async () => {
      setIsLoading(true);
      try {
        const { data: assessmentEvents, error: eventError } = await supabase
          .from('assessment_event')
          .select('*')
          .eq('due_date', formattedDate)
          .eq('status', 'pending');

        if (eventError || !assessmentEvents)
          throw eventError || new Error('No events found');

        const assessmentIds = [
          ...new Set(assessmentEvents.map((e) => e.assessment_id)),
        ];

        const { data: assessmentDetailsList, error: detailsError } =
          await supabase
            .from('assessment_table')
            .select('*')
            .in('id', assessmentIds);

        if (detailsError || !assessmentDetailsList)
          throw detailsError || new Error('No assessment details found');

        const detailsMap = Object.fromEntries(
          assessmentDetailsList.map((item) => [item.id, item])
        );

        const merged = assessmentEvents
          .map((event) => {
            const details = detailsMap[event.assessment_id];
            if (!details) {
              console.warn(
                `Missing assessment details for ID ${event.assessment_id}`
              );
              return null;
            }

            return {
              id: event.id,
              assessment_id: event.assessment_id,
              candidate_email: event.candidate_email,
              status: event.status,
              due_date: event.due_date,
              title: details.title,
              type: details.type,
              level: details.level,
              requirements: details.requirements,
              formLink: details.formLink,
            };
          })
          .filter(Boolean) as assessmentEventProps[];

        setAssessmentsData(merged);
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
