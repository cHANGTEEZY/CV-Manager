import { useEffect, useState } from 'react';
import {
  UserPlus,
  Filter,
  Star,
  Check,
  X,
  Mail,
  Phone,
  DollarSign,
  Award,
  FileText,
  User,
  ChevronRight,
} from 'lucide-react';
import useTableData from '@/hooks/use-table-data';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '../ui/progress';
import { LevelFilter, RoleFilter } from '@/constants/ApplicantForm';
import { tableDefinition } from '@/schemas/tableDefinition';
import { supabase } from '@/utils/supabaseClient';
import { toast } from 'sonner';

type InterviewData = {
  event_name: string;
  interviewer_name: string;
  interview_remarks: string;
  interview_rating: number;
};

type AssessmentData = {
  assessment_title: string;
  assessment_rating: number | null;
  assessment_remarks: string;
};

type CandidateReview = {
  id: number;
  interviews: InterviewData[];
  assessments: AssessmentData[];
};

const FinalReviewCandidates = () => {
  const { finalReviewCandidates } = useTableData();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] =
    useState<tableDefinition | null>(null);
  const [filterLevel, setFilterLevel] = useState<string>('all');
  const [filterPosition, setFilterPosition] = useState<string>('all');
  const [candidateReviews, setCandidateReviews] = useState<CandidateReview[]>(
    []
  );
  const [decisions, setDecisions] = useState<
    Record<number, 'accept' | 'reject'>
  >({});
  const [activeTab, setActiveTab] = useState('interviews');

  const filteredCandidates = finalReviewCandidates?.filter((candidate) => {
    const matchesExperience =
      filterLevel === 'all' ||
      candidate.applicant_experience_level === filterLevel;
    const matchesRole =
      filterPosition === 'all' || candidate.applied_position === filterPosition;

    return matchesExperience && matchesRole;
  });

  useEffect(() => {
    const getCandidateReviews = async () => {
      if (!finalReviewCandidates) return;

      const reviews: CandidateReview[] = [];

      for (const candidate of finalReviewCandidates) {
        const { data: interviewData, error: interviewTableError } =
          await supabase
            .from('events')
            .select(
              'event_name, interviewer_name, interview_remarks, interview_rating'
            )
            .eq('applicant_email', candidate.applicant_email);

        const { data: assessmentData, error: assessmentTableError } =
          await supabase
            .from('assessment_event')
            .select('assessment_title, assessment_rating, assessment_remarks')
            .eq('candidate_email', candidate.applicant_email);

        if (interviewTableError) {
          console.error('Interview data error:', interviewTableError);
          continue;
        }
        if (assessmentTableError) {
          console.error('Assessment data error:', assessmentTableError);
          continue;
        }

        const interviews: InterviewData[] = interviewData || [];
        const assessments: AssessmentData[] = assessmentData || [];

        reviews.push({
          id: candidate.id,
          interviews,
          assessments,
        });
      }

      setCandidateReviews(reviews);
    };

    getCandidateReviews();
  }, [finalReviewCandidates]);

  const getSelectedCandidateReview = () => {
    if (!selectedCandidate) return null;
    return candidateReviews.find(
      (review) => review.id === selectedCandidate.id
    );
  };

  const handleOpenReviewDialog = (candidate: tableDefinition) => {
    setSelectedCandidate(candidate);
    setReviewDialogOpen(true);
  };

  const handleOpenDecisionDialog = (candidate: tableDefinition) => {
    setSelectedCandidate(candidate);
    setDecisionDialogOpen(true);
  };

  const handleDecision = async (decision: 'accept' | 'reject') => {
    let newApplicantStatus: string;
    let newApplicantVerdict: string;
    let toastMessage: string;
    const applicantTimeline = 6;

    if (decision === 'accept') {
      newApplicantStatus = 'Applicant Eligble for Offer';
      newApplicantVerdict = 'Offer';
      toastMessage = 'User in offer stage. Send email to hire';
    } else {
      newApplicantStatus = 'Applicant Listed for rejection';
      newApplicantVerdict = 'Fail';
      toastMessage = 'User in Reject stage. Send email to Reject';
    }

    const { error: userDetailsTableError } = await supabase
      .from('applicant_details')
      .update({
        applicant_verdict: newApplicantVerdict,
        applicant_status: newApplicantStatus,
        applicant_timeline: applicantTimeline,
      })
      .eq('id', selectedCandidate?.id);

    if (userDetailsTableError) {
      toast.error('Error offering user');
      throw userDetailsTableError;
    }

    toast.info(toastMessage);
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  const getExperienceBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'junior':
        return 'bg-blue-100 text-blue-800';
      case 'mid':
        return 'bg-purple-100 text-purple-800';
      case 'senior':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDecisionBadge = (candidateId: number) => {
    if (!decisions[candidateId]) return null;

    return decisions[candidateId] === 'accept' ? (
      <Badge className="ml-2 bg-green-100 text-green-800">
        <Check className="mr-1 h-3 w-3" /> Accepted
      </Badge>
    ) : (
      <Badge className="ml-2 bg-red-100 text-red-800">
        <X className="mr-1 h-3 w-3" /> Rejected
      </Badge>
    );
  };

  const calculateAverageRating = (
    items: { interview_rating?: number; assessment_rating?: number | null }[]
  ) => {
    const ratings = items
      .map((item) =>
        item.interview_rating !== undefined
          ? item.interview_rating
          : item.assessment_rating
      )
      .filter(
        (rating): rating is number => rating !== null && rating !== undefined
      );

    if (ratings.length === 0) return 0;
    return ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  };

  const selectedReview = getSelectedCandidateReview();
  const interviewAverage = selectedReview
    ? calculateAverageRating(selectedReview.interviews)
    : 0;
  const assessmentAverage = selectedReview
    ? calculateAverageRating(selectedReview.assessments)
    : 0;
  const overallAverage = selectedReview
    ? (interviewAverage + (assessmentAverage || 0)) /
      (assessmentAverage ? 2 : 1)
    : 0;

  return (
    <section className="my-10">
      <h1 className="text-primary mb-6 flex items-center gap-2 text-xl font-semibold">
        <div className="bg-primary/10 flex h-10 w-10 items-center justify-center rounded-full">
          <UserPlus className="text-primary h-5 w-5" />
        </div>
        <span>Eligible Candidates for Hire</span>
      </h1>

      <div className="m-auto w-full">
        <Card className="border-2 shadow-sm">
          <CardHeader className="border-b">
            <CardTitle className="text-xl">
              Final Review: Eligible Candidates
            </CardTitle>
            <CardDescription className="text-sm">
              These candidates have successfully passed all assessment stages
              and are eligible for hiring consideration.
            </CardDescription>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-slate-100">
                  <Filter className="h-4 w-4 text-slate-600" />
                </div>
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="flex flex-1 flex-wrap gap-3">
                <Select
                  value={filterPosition}
                  onValueChange={setFilterPosition}
                >
                  <SelectTrigger className="w-[180px] border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Experience Level" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Positions</SelectLabel>
                      <SelectItem value="all">All Positions</SelectItem>
                      {RoleFilter.map((role) => (
                        <SelectItem key={role} value={role}>
                          {role}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>

                <Select value={filterLevel} onValueChange={setFilterLevel}>
                  <SelectTrigger className="w-[180px] border-slate-200 bg-slate-50">
                    <SelectValue placeholder="Tech Stack" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>Tech Stack</SelectLabel>
                      <SelectItem value="all">All level</SelectItem>
                      {LevelFilter.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-6">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {filteredCandidates?.length === 0 ? (
                <div className="text-muted-foreground col-span-full py-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                    <User className="h-6 w-6 text-slate-400" />
                  </div>
                  <p className="text-lg font-medium">
                    No candidates match your filter criteria
                  </p>
                  <p className="text-sm text-slate-500">
                    Try adjusting your filters or check back later
                  </p>
                </div>
              ) : (
                filteredCandidates?.map((candidate) => (
                  <Card key={candidate.id}>
                    <div className="h-1.5 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500"></div>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar className="h-12 w-12 border-2 border-slate-100">
                            <AvatarFallback className="bg-primary/10 text-primary font-medium">
                              {getInitials(candidate.applicant_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="flex items-center text-base font-semibold">
                              {candidate.applicant_name}
                              {getDecisionBadge(candidate.id)}
                            </CardTitle>
                            <CardDescription className="text-sm">
                              {candidate.applied_position}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pb-3">
                      <div className="flex flex-wrap gap-2">
                        <Badge
                          variant="outline"
                          className="border-none bg-gradient-to-r from-purple-500 to-indigo-600 text-white"
                        >
                          {candidate.applied_position}
                        </Badge>
                        <Badge
                          variant="outline"
                          className={getExperienceBadgeColor(
                            candidate.applicant_experience_level
                          )}
                        >
                          {candidate.applicant_experience_level}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-amber-100 text-amber-800"
                        >
                          {candidate.tech_stack}
                        </Badge>
                        <Badge
                          variant="outline"
                          className="bg-slate-100 text-slate-800"
                        >
                          {candidate.applicant_experience} years
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-3 rounded-lg p-3 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">
                            {candidate.applicant_email}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          <span className="">
                            {candidate.applicant_phone_number}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4" />
                          <span>Expected: ${candidate.expected_salary}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Award className="h-4 w-4" />
                          <span className="">{candidate.applicant_status}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenReviewDialog(candidate)}
                        className="hover:text-primary border-slate-200 bg-white transition-colors hover:bg-slate-50"
                      >
                        <Star className="mr-1 h-4 w-4" />
                        View Reviews
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenDecisionDialog(candidate)}
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white transition-all hover:from-indigo-600 hover:to-purple-700"
                        disabled={!!decisions[candidate.id]}
                      >
                        {decisions[candidate.id]
                          ? decisions[candidate.id] === 'accept'
                            ? 'Accepted'
                            : 'Rejected'
                          : 'Decision'}
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[700px]">
          <DialogHeader className="border-b pb-4">
            <div className="flex items-center gap-3">
              <Avatar className="border-primary/10 h-12 w-12 border-2">
                <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                  {selectedCandidate
                    ? getInitials(selectedCandidate.applicant_name)
                    : 'CN'}
                </AvatarFallback>
              </Avatar>
              <div>
                <DialogTitle className="text-xl">
                  {selectedCandidate?.applicant_name} Review
                </DialogTitle>
                <DialogDescription className="mt-1 flex items-center gap-2">
                  {selectedCandidate?.applied_position && (
                    <Badge
                      variant="outline"
                      className="bg-purple-100 font-medium text-purple-800"
                    >
                      {selectedCandidate.applied_position}
                    </Badge>
                  )}
                  {selectedCandidate?.applicant_experience_level && (
                    <Badge
                      variant="outline"
                      className="bg-blue-100 font-medium text-blue-800"
                    >
                      {selectedCandidate.applicant_experience_level}
                    </Badge>
                  )}
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="py-4">
            <div className="mb-6 grid grid-cols-3 gap-4">
              <Card className="border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100">
                <CardContent className="p-4">
                  <div className="mb-1 text-sm font-medium text-blue-600">
                    Interview Score
                  </div>
                  <div className="text-2xl font-bold text-blue-700">
                    {interviewAverage.toFixed(1)}
                  </div>
                  <Progress
                    value={interviewAverage * 20}
                    className="mt-2 h-1.5"
                  />
                </CardContent>
              </Card>

              <Card className="border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100">
                <CardContent className="p-4">
                  <div className="mb-1 text-sm font-medium text-purple-600">
                    Assessment Score
                  </div>
                  <div className="text-2xl font-bold text-purple-700">
                    {assessmentAverage ? assessmentAverage.toFixed(1) : 'N/A'}
                  </div>
                  <Progress
                    value={assessmentAverage * 20}
                    className="mt-2 h-1.5"
                  />
                </CardContent>
              </Card>

              <Card className="border-emerald-200 bg-gradient-to-br from-emerald-50 to-emerald-100">
                <CardContent className="p-4">
                  <div className="mb-1 text-sm font-medium text-emerald-600">
                    Overall Rating
                  </div>
                  <div className="text-2xl font-bold text-emerald-700">
                    {overallAverage.toFixed(1)}
                  </div>
                  <Progress
                    value={overallAverage * 20}
                    className="mt-2 h-1.5"
                  />
                </CardContent>
              </Card>
            </div>

            <Tabs
              defaultValue="interviews"
              value={activeTab}
              onValueChange={setActiveTab}
              className="w-full"
            >
              <TabsList className="mb-6 grid grid-cols-2">
                <TabsTrigger
                  value="interviews"
                  className="flex items-center gap-2"
                >
                  <User className="h-4 w-4" />
                  <span>
                    Interviews ({selectedReview?.interviews.length || 0})
                  </span>
                </TabsTrigger>
                <TabsTrigger
                  value="assessments"
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  <span>
                    Assessments ({selectedReview?.assessments.length || 0})
                  </span>
                </TabsTrigger>
              </TabsList>

              <TabsContent value="interviews" className="space-y-4">
                {!selectedReview || selectedReview.interviews.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <User className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-lg font-medium">
                      No interview data available
                    </p>
                  </div>
                ) : (
                  selectedReview.interviews.map((interview, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-blue-400 to-blue-600"></div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium">
                            {interview.event_name}
                          </CardTitle>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`h-4 w-4 ${star <= interview.interview_rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                        <CardDescription className="mt-1 flex items-center gap-2">
                          <Avatar className="h-5 w-5">
                            <AvatarFallback className="text-xs">
                              {getInitials(interview.interviewer_name)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="text-sm">
                            {interview.interviewer_name}
                          </span>
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md p-3 text-sm">
                          {interview.interview_remarks || 'No remarks provided'}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>

              <TabsContent value="assessments" className="space-y-4">
                {!selectedReview || selectedReview.assessments.length === 0 ? (
                  <div className="text-muted-foreground py-8 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100">
                      <FileText className="h-6 w-6 text-slate-400" />
                    </div>
                    <p className="text-lg font-medium">
                      No assessment data available
                    </p>
                  </div>
                ) : (
                  selectedReview.assessments.map((assessment, index) => (
                    <Card key={index} className="overflow-hidden">
                      <div className="h-1 bg-gradient-to-r from-purple-400 to-purple-600"></div>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-base font-medium">
                            {assessment.assessment_title}
                          </CardTitle>
                          {assessment.assessment_rating !== null ? (
                            <div className="flex">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`h-4 w-4 ${star <= (assessment.assessment_rating || 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          ) : (
                            <Badge variant="outline">Not Rated</Badge>
                          )}
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="rounded-md bg-slate-50 p-3 text-sm">
                          {assessment.assessment_remarks ||
                            'No remarks provided'}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>

          <DialogFooter className="border-t pt-4">
            <div className="mr-auto flex items-center gap-2">
              <Badge
                variant="outline"
                className="bg-amber-100 font-medium text-amber-800"
              >
                <Award className="mr-1 h-3.5 w-3.5" />
                {overallAverage >= 4
                  ? 'Highly Recommended'
                  : overallAverage >= 3
                    ? 'Recommended'
                    : 'Consider'}
              </Badge>
            </div>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              className="border-slate-200"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={decisionDialogOpen} onOpenChange={setDecisionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="border-b pb-4">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
              <User className="h-8 w-8 text-slate-600" />
            </div>
            <DialogTitle className="text-center text-xl">
              Make a Decision
            </DialogTitle>
            <DialogDescription className="text-center">
              Do you want to accept or reject{' '}
              <span className="font-medium">
                {selectedCandidate?.applicant_name}
              </span>{' '}
              for the{' '}
              <span className="font-medium">
                {selectedCandidate?.applied_position}
              </span>{' '}
              position?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-6 sm:flex-row">
            <Button
              variant="destructive"
              className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
              onClick={() => handleDecision('reject')}
            >
              <X className="mr-2 h-4 w-4" />
              Reject Candidate
            </Button>

            <Button
              variant="default"
              className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              onClick={() => handleDecision('accept')}
            >
              <Check className="mr-2 h-4 w-4" />
              Accept Candidate
            </Button>
          </div>

          <DialogFooter className="border-t pt-4 sm:justify-center">
            <Button
              variant="outline"
              onClick={() => setDecisionDialogOpen(false)}
              className="border-slate-200"
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FinalReviewCandidates;
