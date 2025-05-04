import {
  CalendarIcon,
  Check,
  Clock,
  MessageSquare,
  ThumbsUp,
} from 'lucide-react';
import { Badge } from '../ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { format } from 'date-fns';
import { Calendar } from '../ui/calendar';
import { useState } from 'react';
import { useAssessmentData } from '@/hooks/use-assement-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { cn } from '@/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { assessmentReviewResults } from '@/constants/Assessments';
import { Textarea } from '../ui/textarea';
import PendingCard from '../Pending';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

const ReviewAssessment = () => {
  const [date, setDate] = useState<Date>(new Date());
  const { assessmentsData, isLoading, formatAssessmentDate } =
    useAssessmentData(date);

  const [assessmentDialogOpen, setAssessmentDialogOpen] = useState(false);
  const [selectedAssessment, setSelectedAssessment] = useState(null);
  const [assessmentResult, setAssessmentResult] = useState('');
  const [assessmentReview, setAssessmentReview] = useState('');

  const openReviewDialog = (assessment) => {
    setSelectedAssessment(assessment);
    setAssessmentDialogOpen(true);
  };

  const handleAssessmentCompleteReview = async () => {
    try {
      if (!selectedAssessment) {
        toast.error('No assessment selected');
        return;
      }

      const { error: assessmentUploadError } = await supabase
        .from('assessment_event')
        .update({
          status: 'Completed',
          assessment_remarks: assessmentReview,
          assessment_result: assessmentResult.includes('Pass')
            ? 'Passed'
            : 'Failed',
        })
        .eq('id', selectedAssessment.id);

      if (assessmentUploadError) {
        toast.error(
          `Assessment update failed: ${assessmentUploadError.message}`
        );
        return;
      }

      // Update applicant_details table - FIX: Using correct update syntax
      const { error: applicantTableUpdateError } = await supabase
        .from('applicant_details')
        .update({
          applicant_status: assessmentResult,
          applicant_verdict: assessmentResult.toLowerCase().includes('fail')
            ? 'Fail'
            : '',
          timeline_status:
            assessmentResult === 'Assessment 2 Passed'
              ? 'Final Decision'
              : assessmentResult,
          applicant_timeline:
            assessmentResult === 'Assessment 2 Passed' ? 5 : 4,
        })
        .eq('applicant_email', selectedAssessment.candidate_email);

      if (applicantTableUpdateError) {
        toast.error(
          `Applicant update failed: ${applicantTableUpdateError.message}`
        );
        return;
      }

      toast.success('Assessment reviewed successfully');
      setAssessmentDialogOpen(false);

      setAssessmentResult('');
      setAssessmentReview('');
      setSelectedAssessment(null);
    } catch (error) {
      toast.error(`An error occurred: ${error.message}`);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-primary text-2xl font-bold">
            Pending Assessments
          </h1>
          <p className="text-muted-foreground">
            Review and complete candidate assessments
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock size={14} />
            <span>
              Pending:{' '}
              {assessmentsData?.length > 0 ? assessmentsData.length : '0'}
            </span>
          </Badge>
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" size="sm" className="flex h-9 gap-1">
                <CalendarIcon className="h-4 w-4" />
                {format(date, 'MMM d, yyyy')}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => newDate && setDate(newDate)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>
      {isLoading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-center">
            <div className="border-primary mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-b-2"></div>
            <p className="text-muted-foreground">Loading interviews...</p>
          </div>
        </div>
      ) : assessmentsData.length > 0 ? (
        <div className="grid grid-cols-1 gap-4">
          {assessmentsData.map((assessment) => (
            <Card
              key={assessment.id}
              className={cn(
                'border-l-4',
                new Date(assessment.due_date) > new Date()
                  ? 'border-l-yellow-500'
                  : 'border-l-green-500'
              )}
            >
              <CardHeader className="border-b">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-gradient-chart-1 text-lg">
                      {assessment.title}
                    </CardTitle>
                    <CardDescription>
                      {formatAssessmentDate(String(assessment.due_date))}
                    </CardDescription>
                  </div>
                  <Badge
                    variant="outline"
                    className={cn(
                      new Date(assessment.due_date) > new Date()
                        ? 'bg-yellow-200 text-slate-600'
                        : 'bg-green-200 text-slate-600'
                    )}
                  >
                    {new Date(assessment.due_date) > new Date()
                      ? 'Scheduled'
                      : 'Completed'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between gap-2">
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Candidate
                      </p>
                      <p className="font-semibold">
                        {assessment.candidate_email || 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Assessment Description
                      </p>
                      <span className="grid">
                        <p>{assessment.type}</p>
                        <p>{assessment.level}</p>
                      </span>
                    </div>
                  </div>
                  {assessment.requirements && (
                    <div>
                      <p className="text-muted-foreground text-xs font-medium">
                        Assessment Requirements
                      </p>
                      <p className="text-sm">{assessment.requirements}</p>
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end border-t pt-4 pb-4">
                <Button
                  variant="default"
                  className={cn(
                    'flex items-center gap-2',
                    new Date(assessment.due_date) > new Date()
                      ? 'cursor-not-allowed bg-yellow-400 opacity-50 hover:bg-yellow-400'
                      : 'cursor-pointer bg-green-400 hover:bg-green-400'
                  )}
                  onClick={() => openReviewDialog(assessment)}
                  disabled={new Date(assessment.due_date) > new Date()}
                >
                  {new Date(assessment.due_date) > new Date() ? (
                    <span className="flex items-center gap-2">
                      <Clock size={16} /> Event Pending
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <ThumbsUp size={16} /> Complete Interview
                    </span>
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <PendingCard
          title={'All caught up!'}
          description={
            'There are no pending assessments for the selected date. Try selecting a different date or check back later.'
          }
        />
      )}
      <Dialog
        open={assessmentDialogOpen}
        onOpenChange={setAssessmentDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Complete Assessment and Submit Review</DialogTitle>
            <DialogDescription>
              Provide feedback about the candidate's assessment and mark this
              assessment as completed.
            </DialogDescription>
          </DialogHeader>
          <div className="mb-4">
            <label className="mb-2 block text-sm font-medium">
              Assessment Result
            </label>
            <Select
              value={assessmentResult}
              onValueChange={setAssessmentResult}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select Assessment Result" />
              </SelectTrigger>
              <SelectContent>
                {selectedAssessment &&
                  assessmentReviewResults
                    .filter((item) =>
                      selectedAssessment.title
                        .toLowerCase()
                        .includes(item.title.toLowerCase())
                    )
                    .flatMap((item) =>
                      item.status.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))
                    )}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="mb-2 flex items-center">
              <MessageSquare className="mr-2 h-4 w-4" />
              <p className="text-sm font-medium">Review Comments</p>
            </div>
            <Textarea
              value={assessmentReview}
              onChange={(e) => setAssessmentReview(e.target.value)}
              placeholder="Share your thoughts about the candidate's performance, skills, and fit for the role..."
              className="h-32"
            />
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setAssessmentDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAssessmentCompleteReview}
              disabled={!assessmentReview.trim() || !assessmentResult.trim()}
            >
              Complete & Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ReviewAssessment;
