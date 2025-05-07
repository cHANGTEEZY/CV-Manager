import { tableDefinition } from '@/schemas/tableDefinition';
import { supabase } from '@/utils/supabaseClient';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

const useTableData = () => {
  const [tableData, setTableData] = useState<tableDefinition[] | null>(null);
  const [secondInterviewPassed, setSecondInterviewPassed] = useState<
    tableDefinition[] | null
  >([]);
  const [thirdInterviewPassed, setThirdInterviewPassed] = useState<
    tableDefinition[] | null
  >([]);
  const [firstAssessmentPassed, setFirstAssessmentPassed] = useState<
    tableDefinition[] | null
  >([]);
  const [finalReviewCandidates, setFinalReviewCandidates] = useState<
    tableDefinition[] | null
  >([]);

  const fetchTableData = async () => {
    try {
      const { data, error } = await supabase.from('applicant_details').select();

      if (error) {
        throw new Error(error.message || 'Error retrieving table data');
      }

      if (Array.isArray(data)) {
        setTableData(data);
      } else {
        console.error('Data returned is not an array:', data);
        setTableData([]);
      }
    } catch (error: any) {
      console.error('Error fetching table data:', error);
      toast.error(error.message || 'Something went wrong');
      setTableData([]);
    }
  };

  useEffect(() => {
    fetchTableData();

    const subscription = supabase
      .channel('applicant_details_channel')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'applicant_details',
        },
        (payload) => {
          try {
            if (payload.eventType === 'INSERT') {
              setTableData((prev) => {
                if (!prev) return [payload.new as tableDefinition];
                // Prevent duplicates by checking id
                if (prev.some((item) => item.id === payload.new.id)) {
                  return prev;
                }
                return [...prev, payload.new as tableDefinition];
              });
            } else if (payload.eventType === 'UPDATE') {
              setTableData((prev) => {
                if (!prev) return null;
                return prev.map((item) =>
                  item.id === payload.new.id
                    ? (payload.new as tableDefinition)
                    : item
                );
              });
            } else if (payload.eventType === 'DELETE') {
              setTableData((prev) => {
                if (!prev) return null;
                return prev.filter((item) => item.id !== payload.old.id);
              });
            }
          } catch (error) {
            console.error('Error processing real-time update:', error);
            toast.error('Failed to process applicant data update');
          }
        }
      )
      .subscribe((status) => {
        if (status === 'SUBSCRIBED') {
          console.log('Real-time subscription active for applicant_details');
        } else if (status === 'CLOSED' || status === 'CHANNEL_ERROR') {
          console.error('Real-time subscription error or closed:', status);
        }
      });

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  useEffect(() => {
    if (!tableData) return;

    const secondInterviewPassedUsers = tableData.filter(
      (r) => r.applicant_status === 'Interview 2 Passed'
    );
    setSecondInterviewPassed(secondInterviewPassedUsers);

    const thirdInterviewPassedUsers = tableData.filter(
      (r) => r.applicant_status === 'Interview 3 Passed'
    );
    setThirdInterviewPassed(thirdInterviewPassedUsers);

    const firstAssessmentPassedUsers = tableData.filter(
      (r) => r.applicant_status === 'Assessment 1 Passed'
    );
    setFirstAssessmentPassed(firstAssessmentPassedUsers);

    const finalReviewUsers = tableData.filter(
      (r) => r.applicant_status === 'Assessment 2 Passed'
    );
    setFinalReviewCandidates(finalReviewUsers);
  }, [tableData]);

  return {
    tableData,
    secondInterviewPassed,
    thirdInterviewPassed,
    firstAssessmentPassed,
    finalReviewCandidates,
  };
};

export default useTableData;
