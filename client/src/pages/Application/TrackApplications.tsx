import type React from 'react';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import useTableData from '@/hooks/use-table-data';

// Using a more flexible interface to accommodate the actual data structure
interface Applicant {
  id: number | string;
  applicant_name: string;
  applicant_email: string;
  applicant_status: string;
  applicant_verdict?: string;
  applied_position: string;
  [key: string]: any;
}

export default function ApplicantTable() {
  const { tableData } = useTableData();
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const navigate = useNavigate();

  console.log(applicants);

  useEffect(() => {
    if (tableData && Array.isArray(tableData)) {
      setApplicants(tableData as Applicant[]);
    }
  }, [tableData]);

  const handleRowClick = (id: number | string) => {
    navigate(`/dashboard/application-review/${id}`);
  };

  const getStatusBadge = (status: string, verdict?: string) => {
    if (
      verdict === 'Failed' ||
      verdict === 'Rejected' ||
      verdict === 'rejected' ||
      verdict === 'Fail'
    ) {
      return <Badge variant="destructive">Rejected</Badge>;
    }

    if (
      verdict === 'Offer' ||
      verdict === 'Applicant Eligble for Offer' ||
      verdict === 'Hire'
    ) {
      return <Badge className="bg-green-500 hover:bg-green-600">Offer</Badge>;
    }

    if (verdict === 'Hired') {
      return <Badge className="bg-green-500 hover:bg-green-600">Hired</Badge>;
    }

    if (status.includes('Interview')) {
      const interviewType = status.includes('Technical')
        ? 'Technical Interview'
        : status.includes('HR')
          ? 'HR Interview'
          : status.includes('Final')
            ? 'Final Interview'
            : 'Interview';

      const isCompleted = status.includes('Completed') || verdict === 'Pass';

      return (
        <Badge
          variant="outline"
          className={` ${
            isCompleted
              ? 'border-green-500 text-green-500'
              : 'border-blue-500 text-blue-500'
          } `}
        >
          {interviewType} {isCompleted ? '✓' : 'Scheduled'}
        </Badge>
      );
    }

    // Enhanced Assessment status handling
    if (status.includes('Assessment')) {
      const isCompleted = status.includes('Completed');
      const isPassed = verdict === 'Pass' || verdict === 'Passed';

      return (
        <Badge
          variant="outline"
          className={` ${
            isPassed
              ? 'border-green-500 text-green-500'
              : isCompleted
                ? 'border-yellow-500 text-yellow-500'
                : 'border-amber-500 text-amber-500'
          } `}
        >
          {isPassed ? '✓' : isCompleted ? 'Completed' : 'Pending'}
        </Badge>
      );
    }

    // Default status (keep as is)
    return <Badge variant="secondary">New Applicant</Badge>;
  };

  const groupApplicantsByStatus = () => {
    const groups = {
      new: [] as Applicant[],
      interview: [] as Applicant[],
      assessment: [] as Applicant[],
      offer: [] as Applicant[],
      rejected: [] as Applicant[],
    };

    applicants.forEach((applicant) => {
      const status = applicant.applicant_status || '';
      const verdict = applicant.applicant_verdict || '';

      if (
        verdict === 'Failed' ||
        verdict === 'Rejected' ||
        verdict === 'rejected' ||
        verdict === 'Fail'
      ) {
        groups.rejected.push(applicant);
      } else if (
        verdict === 'Offer' ||
        verdict === 'Hired' ||
        verdict === 'Applicant Eligble for Offer' ||
        verdict === 'Hire'
      ) {
        groups.offer.push(applicant);
      } else if (status.includes('Interview')) {
        groups.interview.push(applicant);
      } else if (status.includes('Assessment')) {
        groups.assessment.push(applicant);
      } else {
        groups.new.push(applicant);
      }
    });

    return groups;
  };

  const applicantGroups = groupApplicantsByStatus();

  return (
    <section className="mx-auto mt-5 max-w-[1200px] p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Applicant Management</h1>
        <p className="text-muted-foreground">
          View and manage applicants through different stages of the hiring
          process. Click on an applicant to view their detailed profile.
        </p>
      </div>

      <Separator className="my-6" />

      <div className="space-y-8">
        {/* New Applicants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              New Applicants
            </CardTitle>
            <CardDescription>
              New applications awaiting initial screening and evaluation
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantTableView
              applicants={applicantGroups.new}
              onRowClick={handleRowClick}
              getStatusBadge={getStatusBadge}
            />
          </CardContent>
        </Card>

        {/* Interview Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Interview Stage
            </CardTitle>
            <CardDescription>
              Applicants currently in the interview process
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantTableView
              applicants={applicantGroups.interview}
              onRowClick={handleRowClick}
              getStatusBadge={getStatusBadge}
            />
          </CardContent>
        </Card>

        {/* Assessment Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Assessment Stage
            </CardTitle>
            <CardDescription>
              Applicants currently completing technical assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantTableView
              applicants={applicantGroups.assessment}
              onRowClick={handleRowClick}
              getStatusBadge={getStatusBadge}
            />
          </CardContent>
        </Card>

        {/* Offer Stage */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Offer Stage
            </CardTitle>
            <CardDescription>
              Successful candidates receiving or negotiating employment offers
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantTableView
              applicants={applicantGroups.offer}
              onRowClick={handleRowClick}
              getStatusBadge={getStatusBadge}
            />
          </CardContent>
        </Card>

        {/* Rejected Applicants */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Rejected Applicants
            </CardTitle>
            <CardDescription>
              Candidates who didn't meet requirements or weren't selected to
              proceed
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ApplicantTableView
              applicants={applicantGroups.rejected}
              onRowClick={handleRowClick}
              getStatusBadge={getStatusBadge}
            />
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

interface ApplicantTableViewProps {
  applicants: Applicant[];
  onRowClick: (id: number | string) => void;
  getStatusBadge: (status: string, verdict?: string) => React.ReactNode;
}

function ApplicantTableView({
  applicants,
  onRowClick,
  getStatusBadge,
}: ApplicantTableViewProps) {
  if (applicants.length === 0) {
    return (
      <div className="text-muted-foreground flex h-20 items-center justify-center">
        No applicants in this stage
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Name</TableHead>
            <TableHead className="font-semibold">Email</TableHead>
            <TableHead className="font-semibold">Position</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {applicants.map((applicant) => (
            <TableRow
              key={applicant.id}
              onClick={() => onRowClick(applicant.id)}
              className="group hover:bg-muted/50 cursor-pointer transition-colors"
            >
              <TableCell className="group-hover:text-primary font-medium">
                {applicant.applicant_name}
              </TableCell>
              <TableCell className="group-hover:text-primary/80">
                {applicant.applicant_email}
              </TableCell>
              <TableCell className="group-hover:text-primary/80">
                {applicant.applied_position}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  {getStatusBadge(
                    applicant.applicant_status,
                    applicant.applicant_verdict
                  )}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
