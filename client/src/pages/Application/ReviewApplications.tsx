import ApplicationTable from "@/components/Application/ApplicationTable";
import Spinner from "@/components/Loading/Spinner";
import useTableData from "@/hooks/use-table-data";

const ReviewApplications = () => {
  const data = useTableData();

  if (!data) {
    return <Spinner />;
  }

  return (
    <section className="m-5 overflow-hidden">
      <ApplicationTable tableData={data} />
    </section>
  );
};

export default ReviewApplications;
