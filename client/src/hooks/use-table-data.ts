import { tableDefinition } from "@/schemas/tableDefinition";
import { supabase } from "@/utils/supabaseClient";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const useTableData = () => {
  const [tableData, setTableData] = useState<tableDefinition[] | null>(null);

  useEffect(() => {
    const getTableData = async () => {
      try {
        const { data, error } = await supabase
          .from("applicant_details")
          .select();

        if (error) {
          throw new Error(error.message || "Error retrieving table data");
        }

        if (Array.isArray(data)) {
          setTableData(data);
        } else {
          console.error("Data returned is not an array:", data);
          setTableData([]);
        }
      } catch (error: any) {
        console.error("Error fetching table data:", error);
        toast.error(error.message || "Something went wrong");
        setTableData([]);
      }
    };

    getTableData();
  }, []);

  return tableData;
};

export default useTableData;
