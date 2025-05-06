import { MetricsCards } from '@/components/Dashboard/MetricsCard';
import {
  ApplicationChart,
  ApplicationStatusChart,
} from '@/components/Dashboard/Chart';
import { ApplicationTimeline } from '@/components/Dashboard/Timeline';

import useTableData from '@/hooks/use-table-data';
import Spinner from '@/components/Loading/Spinner';
import { useDashboardData } from '@/hooks/use-dashboar';
import ApplicationTable from '@/components/Application/ApplicationTable';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

export default function Dashboard() {
  const { tableData } = useTableData();
  const { metrics, chartData, statusData, timelineData, loading, error } =
    useDashboardData();

  if (loading) {
    return <Spinner />;
  }

  if (error) {
    return (
      <div className="mx-auto my-10 max-w-[1140px]">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load dashboard data: {error}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <section className="mx-auto my-10 max-w-[1140px]">
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Applicant Dashboard
        </h1>

        <MetricsCards metrics={metrics} />

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <div className="md:col-span-1 lg:col-span-4">
            <ApplicationChart chartData={chartData} />
          </div>
          <div className="md:col-span-1 lg:col-span-3">
            <ApplicationStatusChart statusData={statusData} />
          </div>
        </div>

        <ApplicationTimeline timelineData={timelineData} />

        {tableData && <ApplicationTable tableData={tableData} />}
      </div>
    </section>
  );
}
