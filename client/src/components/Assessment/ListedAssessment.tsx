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
  const { secondInterviewPassed, thirdInterviewPassed } = useTableData();

  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentProps | null>(null);
  const [assignTo, setAssignTo] = useState('group');
  const [email, setEmail] = useState('');
  const [selectedGroup, setSelectedGroup] = useState('');
  const [isAssigning, setIsAssigning] = useState(false);

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

  const handleAssign = async (assessment) => {
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

      // Get candidates to assign to
      let candidatesToAssign = [];

      if (assignTo === 'individual') {
        candidatesToAssign = [{ email: email.trim() }];
      } else {
        // Group assignment
        switch (selectedGroup) {
          case 'interview2':
            candidatesToAssign = secondInterviewPassed;
            break;
          case 'interview3':
            candidatesToAssign = thirdInterviewPassed;
            break;
          default:
            toast.error('Invalid candidate group selected');
            return;
        }
      }

      if (candidatesToAssign.length === 0) {
        toast.warning('No candidates found in the selected group');
        return;
      }

      // Create assessment assignments in batch
      const assignmentData = candidatesToAssign.map((candidate) => ({
        assessment_id: assessment.id,
        candidate_email: candidate.email,
        assigned_date: new Date().toISOString(),
        status: 'pending',
        due_date: assessment.submissionDate,
      }));

      const { error } = await supabase
        .from('assessment_assignments')
        .insert(assignmentData);

      if (error) throw error;

      toast.success(
        `Assessment assigned to ${candidatesToAssign.length} candidate(s)`
      );
    } catch (error) {
      console.error('Error assigning assessment:', error);
      toast.error('Failed to assign assessment');
    } finally {
      setIsAssigning(false);
    }
  };

  const selectAssessment = (assessment: AssessmentProps) => {
    setSelectedAssessment(assessment);
    // Reset form values when selecting a new assessment
    setAssignTo('group');
    setEmail('');
    setSelectedGroup('');
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
                              <div className="space-y-2">
                                <Label htmlFor="candidateGroup">
                                  Select Candidate Group
                                </Label>
                                <Select
                                  value={selectedGroup}
                                  onValueChange={setSelectedGroup}
                                >
                                  <SelectTrigger className="w-full">
                                    <SelectValue placeholder="Select a group" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="interview2">
                                      <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Candidates Passed Interview 2
                                        <span className="ml-1 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
                                          {secondInterviewPassed?.length || 0}
                                        </span>
                                      </div>
                                    </SelectItem>
                                    <SelectItem value="interview3">
                                      <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />
                                        Candidates Passed Interview 3
                                        <span className="ml-1 rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                          {thirdInterviewPassed?.length || 0}
                                        </span>
                                      </div>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
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
                              onClick={() => handleAssign(assessment)}
                              className="w-full"
                              disabled={isAssigning}
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
