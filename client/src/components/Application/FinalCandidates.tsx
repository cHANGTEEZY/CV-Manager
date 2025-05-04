'use client';

import { useState } from 'react';
import {
  UserPlus,
  Filter,
  Star,
  Check,
  X,
  Briefcase,
  Mail,
  Phone,
  DollarSign,
  Award,
  FileText,
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
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { assessmentFilter } from '@/constants/Assessments';
import { LevelFilter, RoleFilter } from '@/constants/ApplicantForm';

// Define candidate type
interface Candidate {
  id: number;
  created_at: string;
  applicant_name: string;
  applied_position: string;
  applicant_status: string;
  tech_stack: string;
  applicant_email: string;
  applicant_phone_number: string;
  applicant_experience: string;
  applicant_experience_level: string;
  expected_salary: string;
  references: string;
  applicant_file_path: string;
  applicant_verdict: string;
  timeline_status: string;
  applicant_timeline: number;
}

const FinalReviewCandidates = () => {
  const { finalReviewCandidates } = useTableData();
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [decisionDialogOpen, setDecisionDialogOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(
    null
  );
  const [filterLevel, setfilterLevel] = useState<string>('all');
  const [filterPosition, setfilterPosition] = useState<string>('all');
  const [decisions, setDecisions] = useState<
    Record<number, 'accept' | 'reject'>
  >({});

  console.log(finalReviewCandidates);

  const filteredCandidates = finalReviewCandidates?.filter((candidate) => {
    const matchesExperience =
      filterLevel === 'all' ||
      candidate.applicant_experience_level === filterLevel;
    const matchesRole =
      filterPosition === 'all' || candidate.applied_position === filterPosition;

    return matchesExperience && matchesRole;
  });

  // Handle opening the review dialog
  const handleOpenReviewDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setReviewDialogOpen(true);
  };

  // Handle opening the decision dialog
  const handleOpenDecisionDialog = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setDecisionDialogOpen(true);
  };

  // Handle making a decision
  const handleDecision = (decision: 'accept' | 'reject') => {
    if (selectedCandidate) {
      setDecisions({
        ...decisions,
        [selectedCandidate.id]: decision,
      });
      setDecisionDialogOpen(false);
    }
  };

  // Get initials from name
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('');
  };

  // Get badge color based on experience level
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

  // Get decision status badge
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

  return (
    <section className="my-10">
      <h1 className="text-primary mb-4 flex items-center gap-2 text-xl font-semibold">
        <UserPlus className="h-5 w-5" />
        <span>Eligible Candidates for Hire</span>
      </h1>

      <div className="m-auto w-full">
        <Card className="border-2">
          <CardHeader className="border-b">
            <CardTitle>Final Review: Eligible Candidates</CardTitle>
            <CardDescription>
              These candidates have successfully passed all assessment stages
              and are eligible for hiring consideration.
            </CardDescription>

            {/* Filtering options */}
            <div className="mt-4 flex flex-col gap-4 sm:flex-row">
              <div className="flex items-center gap-2">
                <Filter className="text-muted-foreground h-4 w-4" />
                <span className="text-sm font-medium">Filters:</span>
              </div>

              <div className="flex flex-1 flex-wrap gap-3">
                <Select
                  value={filterPosition}
                  onValueChange={setfilterPosition}
                >
                  <SelectTrigger className="w-[180px]">
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

                <Select value={filterLevel} onValueChange={setfilterLevel}>
                  <SelectTrigger className="w-[180px]">
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
                <div className="text-muted-foreground col-span-full py-8 text-center">
                  No candidates match your filter criteria
                </div>
              ) : (
                filteredCandidates?.map((candidate) => (
                  <Card key={candidate.id} className="overflow-hidden">
                    <div className="from-primary to-primary/70 h-2 bg-gradient-to-r"></div>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarFallback className="bg-primary/10 text-primary">
                              {getInitials(candidate.applicant_name)}
                            </AvatarFallback>
                          </Avatar>
                          <div>
                            <CardTitle className="text-base">
                              {candidate.applicant_name}
                              {getDecisionBadge(candidate.id)}
                            </CardTitle>
                            <CardDescription>
                              {candidate.applied_position}
                            </CardDescription>
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-3 pb-2">
                      <div className="flex flex-wrap gap-2">
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
                          className="bg-gray-100 text-gray-800"
                        >
                          {candidate.applicant_experience} years
                        </Badge>
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2">
                          <Mail className="text-muted-foreground h-4 w-4" />
                          <span className="truncate">
                            {candidate.applicant_email}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Phone className="text-muted-foreground h-4 w-4" />
                          <span>{candidate.applicant_phone_number}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <DollarSign className="text-muted-foreground h-4 w-4" />
                          <span>Expected: ${candidate.expected_salary}</span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Award className="text-muted-foreground h-4 w-4" />
                          <span>{candidate.applicant_status}</span>
                        </div>
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between border-t pt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenReviewDialog(candidate)}
                      >
                        <Star className="mr-1 h-4 w-4" />
                        View Reviews
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => handleOpenDecisionDialog(candidate)}
                        disabled={!!decisions[candidate.id]}
                      >
                        {decisions[candidate.id]
                          ? decisions[candidate.id] === 'accept'
                            ? 'Accepted'
                            : 'Rejected'
                          : 'Decision'}
                      </Button>
                    </CardFooter>
                  </Card>
                ))
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reviews Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Candidate Reviews</DialogTitle>
            <DialogDescription>
              Assessment feedback and reviews for{' '}
              {selectedCandidate?.applicant_name}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="bg-muted rounded-md p-4">
              <h4 className="mb-2 flex items-center font-medium">
                <FileText className="mr-2 h-4 w-4" />
                Technical Assessment
              </h4>
              <p className="text-muted-foreground text-sm">
                Candidate demonstrated strong problem-solving skills and
                technical knowledge. Successfully completed all coding
                challenges with efficient solutions.
              </p>
              <div className="mt-2 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-muted rounded-md p-4">
              <h4 className="mb-2 flex items-center font-medium">
                <FileText className="mr-2 h-4 w-4" />
                Cultural Fit Interview
              </h4>
              <p className="text-muted-foreground text-sm">
                Candidate aligns well with company values and demonstrated good
                communication skills. Shows potential for growth and teamwork.
              </p>
              <div className="mt-2 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 4 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>

            <div className="bg-muted rounded-md p-4">
              <h4 className="mb-2 flex items-center font-medium">
                <FileText className="mr-2 h-4 w-4" />
                References Check
              </h4>
              <p className="text-muted-foreground text-sm">
                Positive feedback from previous employers. Described as
                reliable, hardworking, and a quick learner.
              </p>
              <div className="mt-2 flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-4 w-4 ${star <= 5 ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Decision Dialog */}
      <Dialog open={decisionDialogOpen} onOpenChange={setDecisionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Make a Decision</DialogTitle>
            <DialogDescription>
              Do you want to accept or reject{' '}
              {selectedCandidate?.applicant_name} for the{' '}
              {selectedCandidate?.applied_position} position?
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-4 sm:flex-row">
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => handleDecision('reject')}
            >
              <X className="mr-2 h-4 w-4" />
              Reject Candidate
            </Button>

            <Button
              variant="default"
              className="flex-1 bg-green-600 hover:bg-green-700"
              onClick={() => handleDecision('accept')}
            >
              <Check className="mr-2 h-4 w-4" />
              Accept Candidate
            </Button>
          </div>

          <DialogFooter className="sm:justify-start">
            <Button
              variant="outline"
              onClick={() => setDecisionDialogOpen(false)}
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
