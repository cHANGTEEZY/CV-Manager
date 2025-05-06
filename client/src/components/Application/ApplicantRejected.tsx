import { XCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ApplicantRejected({
  applicantName,
}: {
  applicantName: string | null | undefined;
}) {
  return (
    <Card className="border-red-200 bg-red-50">
      <CardContent className="flex flex-col items-center py-12 text-center">
        <XCircle className="mb-4 h-16 w-16 text-red-500" />
        <h2 className="mb-2 text-2xl font-bold text-red-700">
          Application Rejected
        </h2>
        <p className="mb-4 max-w-md text-red-600">
          {applicantName}'s application has been rejected. The applicant has
          been notified via email.
        </p>
        <div className="mt-2 max-w-lg rounded-lg border border-red-200 bg-white p-4">
          <h3 className="mb-2 font-medium text-gray-800">Next Steps</h3>
          <p className="text-sm text-gray-600">
            All application documents will be archived. If you believe this was
            done in error, please contact DEV immediately to revert the
            applicant
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
