import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '../ui/card';
import { Separator } from '../ui/separator';
import { supabase } from '@/utils/supabaseClient';
import { AssessmentProps } from '@/schemas/assessmentSchema';
import Spinner from '../Loading/Spinner';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from '../ui/drawer';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { toast } from 'sonner';
import {
  Edit,
  Send,
  CalendarIcon,
  Layers,
  BarChart3,
  FileText,
  Link as LinkIcon,
  Users,
  AlertTriangle,
  CheckCircle,
} from 'lucide-react';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../ui/tooltip';
import useTableData from '@/hooks/use-table-data';

const ListedAssessment = () => {
  const [listedAssessments, setListedAssessments] = useState<AssessmentProps[]>(
    []
  );
  const { secondInterviewPassed, thirdInterviewPassed, firstAssessmentPassed } =
    useTableData();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentProps | null>(null);
  const [assignTo, setAssignTo] = useState('group');
  const [email, setEmail] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);
  const [filteredCandidates, setFilteredCandidates] = useState([]);

  useEffect(() => {
    const getListedAssessment = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('assessment_table')
          .select();
        if (error) throw error;
        setListedAssessments(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getListedAssessment();
  }, []);

  const handleSave = async () => {
    if (!selectedAssessment) return;
    try {
      const { id, ...updatedData } = selectedAssessment;
      const { error } = await supabase
        .from('assessment_table')
        .update(updatedData)
        .eq('id', id);
      if (error) throw error;

      setListedAssessments((prev) =>
        prev.map((item) => (item.id === id ? selectedAssessment : item))
      );

      toast.success('Assessment updated successfully');
    } catch (error) {
      toast.error('Failed to update assessment');
      console.error(error);
    }
  };

  const filterCandidatesByAssessment = (assessment, candidateGroup) => {
    // Select the appropriate candidate group based on the dropdown selection
    let candidates;

    switch (candidateGroup) {
      case 'interview2':
        candidates = secondInterviewPassed;
        break;
      case 'interview3':
        candidates = thirdInterviewPassed;
        break;
      case 'assessment1':
        candidates = firstAssessmentPassed;
        break;
      default:
        candidates = [];
    }

    if (!candidates || candidates.length === 0) {
      return [];
    }

    return candidates.filter((candidate) => {
      const levelMatch =
        candidate.applicant_experience_level === assessment.level;

      let typeMatch = false;

      const appliedType = candidate.applied_position?.toLowerCase() || '';
      const assessmentType = assessment.type?.toLowerCase() || '';

      if (
        appliedType.includes('python') &&
        (assessmentType.includes('python') ||
          assessmentType === 'backend' ||
          assessmentType === 'full stack')
      ) {
        typeMatch = true;
      } else if (
        appliedType.includes('javascript') ||
        appliedType.includes('react') ||
        appliedType.includes('angular')
      ) {
        if (
          assessmentType === 'frontend' ||
          assessmentType === 'full stack' ||
          assessmentType.includes('javascript') ||
          assessmentType.includes('react')
        ) {
          typeMatch = true;
        }
      } else if (
        appliedType.includes('java') ||
        appliedType.includes('spring')
      ) {
        if (
          assessmentType === 'backend' ||
          assessmentType === 'full stack' ||
          assessmentType.includes('java')
        ) {
          typeMatch = true;
        }
      } else if (assessmentType.includes(appliedType)) {
        typeMatch = true;
      }

      return levelMatch && typeMatch;
    });
  };

  const handleAssign = async (assessment) => {
    if (!assessment) {
      toast.error('No assessment selected');
      return;
    }

    console.log(assessment);

    if (assignTo === 'individual' && !email.trim()) {
      toast.error('Email of candidate required for individual assignment');
      return;
    }

    if (assignTo === 'group' && !selectedGroup) {
      toast.error('Please select a candidate group');
      return;
    }

    try {
      setIsAssigning(true);

      let candidatesToAssign = [];

      if (assignTo === 'individual') {
        // For individual assignments, we use the direct email input
        candidatesToAssign = [{ applicant_email: email.trim() }];
      } else {
        // For group assignments, we filter candidates based on criteria
        candidatesToAssign = filterCandidatesByAssessment(
          assessment,
          selectedGroup
        );

        if (!candidatesToAssign || candidatesToAssign.length === 0) {
          toast.warning(
            'No matching candidates found in the selected group based on assessment criteria'
          );
          setIsAssigning(false);
          return;
        }
      }

      const { data: candidateStatus, error: candidateStusError } =
        await supabase.from('applicant_details');

      const assignmentData = candidatesToAssign.map((candidate) => {
        const candidateEmail =
          candidate.applicant_email ||
          candidate.email ||
          (assignTo === 'individual' ? email.trim() : null);

        if (!candidateEmail) {
          throw new Error('Missing email for one or more candidates');
        }

        return {
          assessment_id: assessment.id,
          candidate_email: candidateEmail,
          assigned_date: new Date().toISOString(),
          status: 'pending',
          due_date: assessment.submissionDate || new Date().toISOString(),
        };
      });

      if (!assignmentData.length) {
        throw new Error('No valid assignment data generated');
      }

      const { error: assessmentError } = await supabase
        .from('assessment_event')
        .insert(assignmentData);

      if (assessmentError) throw assessmentError;

      let newApplicantStatus;
      if (selectedGroup === 'assessment1') {
        newApplicantStatus = 'Assessment 2 Assigned';
      } else {
        newApplicantStatus = 'Assessment 1 Assigned';
      }

      const updatePromises = candidatesToAssign.map(async (candidate) => {
        const candidateEmail =
          candidate.applicant_email ||
          candidate.email ||
          (assignTo === 'individual' ? email.trim() : null);

        if (candidateEmail) {
          const { error: updateError } = await supabase
            .from('applicant_details')
            .update({ applicant_status: newApplicantStatus })
            .eq('applicant_email', candidateEmail);

          if (updateError) {
            console.error(
              `Error updating status for ${candidateEmail}:`,
              updateError
            );
            return false;
          }
          return true;
        }
        return false;
      });

      const updateResults = await Promise.all(updatePromises);

      const successfulUpdates = updateResults.filter((result) => result).length;

      toast.success(
        `Assessment assigned to ${assignmentData.length} candidate(s) successfully. Updated status for ${successfulUpdates} candidate(s).`
      );
    } catch (error) {
      console.error('Error assigning assessment:', error);
      toast.error(
        `Failed to assign assessment: ${error.message || 'Unknown error'}`
      );
    } finally {
      setIsAssigning(false);
    }
  };

  const selectAssessment = (assessment: AssessmentProps) => {
    setSelectedAssessment(assessment);
    setAssignTo('group');
    setEmail('');
    setSelectedGroup('');
    setFilteredCandidates([]);
  };

  const handleGroupSelection = (group, assessment) => {
    setSelectedGroup(group);
    if (assessment) {
      const matchingCandidates = filterCandidatesByAssessment(
        assessment,
        group
      );
      setFilteredCandidates(matchingCandidates);
    }
  };

  if (isLoading) return <Spinner />;

  return (
    <section className="my-10">
      <h2 className="text-primary mb-4 flex items-center gap-2 text-xl font-semibold">
        <FileText className="h-5 w-5" />
        View Assessments
      </h2>

      {listedAssessments.length ? (
        <div className="grid grid-cols-1 gap-3">
          {listedAssessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="border shadow-sm transition-all hover:shadow-md"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  {assessment.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <CalendarIcon className="h-3 w-3" />
                  {format(new Date(assessment.submissionDate), 'PPP')}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <span className="flex items-center gap-1 rounded-md bg-blue-100 px-2 py-1 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                    <Layers className="h-3 w-3" />
                    {assessment.type}
                  </span>
                  <span className="flex items-center gap-1 rounded-md bg-purple-100 px-2 py-1 text-xs text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                    <BarChart3 className="h-3 w-3" />
                    {assessment.level}
                  </span>
                </div>

                <p className="text-muted-foreground line-clamp-3 text-sm">
                  {assessment.requirements}
                </p>

                <a
                  href={assessment.formLink}
                  className="flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon className="h-3 w-3" />
                  Assessment Form
                </a>
              </CardContent>

              <Separator />

              <CardFooter className="flex justify-between pt-4">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button
                            onClick={() => selectAssessment(assessment)}
                            variant="outline"
                            size="sm"
                            className="gap-1"
                          >
                            <Edit className="h-4 w-4" />
                            Edit
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Edit Assessment</DrawerTitle>
                            <DrawerDescription>
                              Make changes to the assessment details
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="space-y-4 p-4">
                            <div className="space-y-2">
                              <Label htmlFor="title">Title</Label>
                              <Input
                                id="title"
                                value={selectedAssessment?.title || ''}
                                onChange={(e) =>
                                  setSelectedAssessment((prev) => ({
                                    ...prev!,
                                    title: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label htmlFor="type">Type</Label>
                                <Select
                                  value={selectedAssessment?.type}
                                  onValueChange={(value) =>
                                    setSelectedAssessment((prev) => ({
                                      ...prev!,
                                      type: value as any,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Full Stack">
                                      Full Stack
                                    </SelectItem>
                                    <SelectItem value="Frontend">
                                      Frontend
                                    </SelectItem>
                                    <SelectItem value="Backend">
                                      Backend
                                    </SelectItem>
                                    <SelectItem value="Devops">
                                      DevOps
                                    </SelectItem>
                                    <SelectItem value="UI/UX">UI/UX</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>

                              <div className="space-y-2">
                                <Label htmlFor="level">Level</Label>
                                <Select
                                  value={selectedAssessment?.level}
                                  onValueChange={(value) =>
                                    setSelectedAssessment((prev) => ({
                                      ...prev!,
                                      level: value as any,
                                    }))
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select level" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="Intern">
                                      Intern
                                    </SelectItem>
                                    <SelectItem value="Junior">
                                      Junior
                                    </SelectItem>
                                    <SelectItem value="Intermediate">
                                      Intermediate
                                    </SelectItem>
                                    <SelectItem value="Senior">
                                      Senior
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="formLink">Form Link</Label>
                              <Input
                                id="formLink"
                                value={selectedAssessment?.formLink || ''}
                                onChange={(e) =>
                                  setSelectedAssessment((prev) => ({
                                    ...prev!,
                                    formLink: e.target.value,
                                  }))
                                }
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="requirements">Requirements</Label>
                              <Textarea
                                id="requirements"
                                value={selectedAssessment?.requirements || ''}
                                onChange={(e) =>
                                  setSelectedAssessment((prev) => ({
                                    ...prev!,
                                    requirements: e.target.value,
                                  }))
                                }
                                rows={4}
                              />
                            </div>
                          </div>
                          <DrawerFooter>
                            <Button onClick={handleSave} className="w-full">
                              Save Changes
                            </Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit assessment details</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>

                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Drawer>
                        <DrawerTrigger asChild>
                          <Button
                            onClick={() => selectAssessment(assessment)}
                            variant="default"
                            size="sm"
                            className="gap-1"
                          >
                            <Send className="h-4 w-4" />
                            Assign
                          </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                          <DrawerHeader>
                            <DrawerTitle>Assign Assessment</DrawerTitle>
                            <DrawerDescription>
                              Assign "{selectedAssessment?.title}" to candidates
                            </DrawerDescription>
                          </DrawerHeader>
                          <div className="space-y-6 p-4">
                            <div className="space-y-2">
                              <Label>Assessment Details</Label>
                              <Card className="bg-muted/50">
                                <CardContent className="space-y-2 pt-4">
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      {selectedAssessment?.title}
                                    </span>
                                    <span className="text-muted-foreground text-sm">
                                      {selectedAssessment?.type} -{' '}
                                      {selectedAssessment?.level}
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    Due:{' '}
                                    {selectedAssessment?.submissionDate &&
                                      format(
                                        new Date(
                                          selectedAssessment.submissionDate
                                        ),
                                        'PPP'
                                      )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <div className="space-y-3">
                              <Label>Assign To</Label>
                              <RadioGroup
                                defaultValue="group"
                                value={assignTo}
                                onValueChange={setAssignTo}
                                className="space-y-3"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="group" id="group" />
                                  <Label
                                    htmlFor="group"
                                    className="cursor-pointer"
                                  >
                                    Candidate Group
                                  </Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem
                                    value="individual"
                                    id="individual"
                                  />
                                  <Label
                                    htmlFor="individual"
                                    className="cursor-pointer"
                                  >
                                    Individual Candidate
                                  </Label>
                                </div>
                              </RadioGroup>
                            </div>

                            {assignTo === 'group' && (
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <Label htmlFor="candidateGroup">
                                    Select Candidate Group
                                  </Label>
                                  <Select
                                    value={selectedGroup}
                                    onValueChange={(value) =>
                                      handleGroupSelection(
                                        value,
                                        selectedAssessment
                                      )
                                    }
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Select a group" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      {assessment.title.includes('1') ? (
                                        <>
                                          <SelectItem value="interview2">
                                            <div className="flex items-center gap-2">
                                              <Users className="h-4 w-4" />
                                              Candidates Passed Interview 2
                                              <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                                {secondInterviewPassed?.length ||
                                                  0}
                                              </span>
                                            </div>
                                          </SelectItem>
                                          <SelectItem value="interview3">
                                            <div className="flex items-center gap-2">
                                              <Users className="h-4 w-4" />
                                              Candidates Passed Interview 3
                                              <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                                {thirdInterviewPassed?.length ||
                                                  0}
                                              </span>
                                            </div>
                                          </SelectItem>
                                        </>
                                      ) : (
                                        <SelectItem value="assessment1">
                                          <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-purple-500" />
                                            Candidates Passed Assessment 1
                                            <span className="ml-1 rounded-full bg-purple-100 px-2 py-0.5 text-xs text-purple-800 dark:bg-purple-900/30 dark:text-purple-300">
                                              {firstAssessmentPassed?.length ||
                                                0}
                                            </span>
                                          </div>
                                        </SelectItem>
                                      )}
                                    </SelectContent>
                                  </Select>
                                </div>

                                {selectedGroup &&
                                  filteredCandidates.length > 0 && (
                                    <div className="space-y-2">
                                      <div className="flex items-center gap-2">
                                        <CheckCircle className="h-4 w-4 text-green-500" />
                                        <Label className="text-sm">
                                          {filteredCandidates.length} matching
                                          candidates found
                                        </Label>
                                      </div>
                                      <div className="max-h-32 overflow-y-auto rounded border p-2">
                                        {filteredCandidates.map(
                                          (candidate, index) => (
                                            <div
                                              key={index}
                                              className="flex items-center gap-2 p-1 text-sm"
                                            >
                                              <span className="font-medium">
                                                {candidate.applicant_name}
                                              </span>
                                              <span className="text-muted-foreground text-xs">
                                                ({candidate.tech_stack} -{' '}
                                                {
                                                  candidate.applicant_experience_level
                                                }
                                                )
                                              </span>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </div>
                                  )}

                                {selectedGroup &&
                                  filteredCandidates.length === 0 && (
                                    <div className="flex items-center gap-2 rounded-md bg-amber-50 p-3 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200">
                                      <AlertTriangle className="h-4 w-4" />
                                      <span className="text-sm">
                                        No candidates match the assessment
                                        criteria in this group. Consider
                                        selecting a different group or changing
                                        the assessment requirements.
                                      </span>
                                    </div>
                                  )}
                              </div>
                            )}

                            {assignTo === 'individual' && (
                              <div className="space-y-2">
                                <Label htmlFor="email">Candidate Email</Label>
                                <Input
                                  id="email"
                                  type="email"
                                  placeholder="candidate@example.com"
                                  value={email}
                                  onChange={(e) => setEmail(e.target.value)}
                                />
                              </div>
                            )}
                          </div>
                          <DrawerFooter>
                            <Button
                              onClick={() => handleAssign(selectedAssessment)}
                              className="w-full"
                              disabled={
                                isAssigning ||
                                (assignTo === 'group' &&
                                  filteredCandidates.length === 0)
                              }
                            >
                              {isAssigning ? (
                                <>
                                  <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                                  Assigning...
                                </>
                              ) : (
                                'Assign Assessment'
                              )}
                            </Button>
                            <DrawerClose asChild>
                              <Button variant="outline">Cancel</Button>
                            </DrawerClose>
                          </DrawerFooter>
                        </DrawerContent>
                      </Drawer>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Assign to candidates</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </CardFooter>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="w-full py-16">
          <div className="text-muted-foreground text-center">
            <FileText className="mx-auto mb-2 h-12 w-12 opacity-30" />
            <h3 className="text-lg font-medium">No assessments available</h3>
            <p className="text-sm">
              Create assessments to see them listed here
            </p>
          </div>
        </Card>
      )}
    </section>
  );
};

export default ListedAssessment;
