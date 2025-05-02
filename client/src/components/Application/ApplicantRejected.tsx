import { XCircle } from 'lucide-react';

const ApplicantRejected = ({ applicantName }: { applicantName: string }) => {
  return (
    <div className="flex flex-col items-center justify-center space-y-4 rounded-lg border border-red-200 bg-red-50 p-8 text-center">
      <XCircle className="h-12 w-12 text-red-500" />
      <h2 className="text-xl font-semibold text-red-700">
        Application Rejected
      </h2>
      <p className="text-red-600">
        {applicantName}'s application has been rejected and they will be
        notified via email.
      </p>
    </div>
  );
};

export default ApplicantRejected;
