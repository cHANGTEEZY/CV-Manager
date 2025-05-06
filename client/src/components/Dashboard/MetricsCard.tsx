import {
  ArrowDownIcon,
  ArrowUpIcon,
  XCircle,
  Calendar,
  CheckCircle,
  UserPlus,
  Users,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function MetricsCards({ metrics }) {
  const {
    totalApplicants,
    hiredApplicants,
    rejectedApplicants,
    pendingOfferApplicants,
    hireRate,
    rejectionRate,
  } = metrics;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total Applicants
          </CardTitle>
          <Users className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalApplicants}</div>
          <p className="text-muted-foreground text-xs">
            {totalApplicants > 0 && (
              <span className="flex items-center text-emerald-500">
                <ArrowUpIcon className="mr-1 h-4 w-4" />
                {hireRate}% success rate
              </span>
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Hired Applicants
          </CardTitle>
          <CheckCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{hiredApplicants}</div>
          <p className="text-muted-foreground text-xs">
            <span className="flex items-center text-emerald-500">
              <ArrowUpIcon className="mr-1 h-4 w-4" />
              {hireRate}% of applicants
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Pending Offers</CardTitle>
          <UserPlus className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{pendingOfferApplicants}</div>
          <p className="text-muted-foreground text-xs">
            <span className="flex items-center text-amber-500">
              <Calendar className="mr-1 h-4 w-4" />
              Applicants eligible for offers
            </span>
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Rejected Applications
          </CardTitle>
          <XCircle className="text-muted-foreground h-4 w-4" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{rejectedApplicants}</div>
          <p className="text-muted-foreground text-xs">
            <span className="flex items-center text-rose-500">
              <ArrowDownIcon className="mr-1 h-4 w-4" />
              {rejectionRate}% rejection rate
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
