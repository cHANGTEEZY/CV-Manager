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

  useEffect(() => {
    const getTableData = async () => {
      try {
        const { data, error } = await supabase
          .from('applicant_details')
          .select();

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

    getTableData();
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
