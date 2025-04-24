import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "../ui/card";
import { Separator } from "../ui/separator";
import { supabase } from "@/utils/supabaseClient";
import { AssessmentProps } from "@/schemas/assessmentSchema";
import Spinner from "../Loading/Spinner";
import { format } from "date-fns";
import { Button } from "../ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
  DrawerTrigger,
} from "../ui/drawer";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { toast } from "sonner";
import {
  Edit,
  Send,
  CalendarIcon,
  Layers,
  BarChart3,
  FileText,
  Link as LinkIcon,
} from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

const ListedAssessment = () => {
  const [listedAssessments, setListedAssessments] = useState<AssessmentProps[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [selectedAssessment, setSelectedAssessment] =
    useState<AssessmentProps | null>(null);
  const [assignTo, setAssignTo] = useState("all");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const getListedAssessment = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from("assessment_table")
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
        .from("assessment_table")
        .update(updatedData)
        .eq("id", id);
      if (error) throw error;

      setListedAssessments((prev) =>
        prev.map((item) => (item.id === id ? selectedAssessment : item))
      );

      toast.success("Assessment updated successfully");
    } catch (error) {
      toast.error("Failed to update assessment");
      console.error(error);
    }
  };

  const handleAssign = () => {
    if (assignTo === "individual" && !email.trim()) {
      toast.error("Email of candidate required for individual assignment");
      return;
    }
    toast.success("Assessment assigned");
  };

  const selectAssessment = (assessment: AssessmentProps) => {
    setSelectedAssessment(assessment);
  };

  if (isLoading) return <Spinner />;

  return (
    <section className="my-10">
      <h2 className="text-xl font-semibold mb-4 text-primary flex items-center gap-2">
        <FileText className="h-5 w-5" />
        View Assessments
      </h2>

      {listedAssessments.length ? (
        <div className="grid grid-cols-1 gap-3">
          {listedAssessments.map((assessment) => (
            <Card
              key={assessment.id}
              className="border shadow-sm hover:shadow-md transition-all"
            >
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">
                  {assessment.title}
                </CardTitle>
                <CardDescription className="flex items-center gap-1 text-xs">
                  <CalendarIcon className="h-3 w-3" />
                  {format(new Date(assessment.submissionDate), "PPP")}
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="flex gap-2">
                  <span className="bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <Layers className="h-3 w-3" />
                    {assessment.type}
                  </span>
                  <span className="bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300 px-2 py-1 rounded-md text-xs flex items-center gap-1">
                    <BarChart3 className="h-3 w-3" />
                    {assessment.level}
                  </span>
                </div>

                <p className="text-sm text-muted-foreground line-clamp-3">
                  {assessment.requirements}
                </p>

                <a
                  href={assessment.formLink}
                  className="text-sm text-blue-600 dark:text-blue-400 flex items-center gap-1 hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <LinkIcon className="h-3 w-3" />
                  Assessment Form
                </a>
              </CardContent>

              <Separator />

              <CardFooter className="pt-4 flex justify-between">
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
                                value={selectedAssessment?.title || ""}
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
                                value={selectedAssessment?.formLink || ""}
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
                                value={selectedAssessment?.requirements || ""}
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
                              <Label>Assignment Details</Label>
                              <Card className="bg-muted/50">
                                <CardContent className="pt-4 space-y-2">
                                  <div className="flex justify-between">
                                    <span className="font-medium">
                                      {selectedAssessment?.title}
                                    </span>
                                    <span className="text-sm text-muted-foreground">
                                      {selectedAssessment?.type} -{" "}
                                      {selectedAssessment?.level}
                                    </span>
                                  </div>
                                  <div className="text-sm">
                                    Due:{" "}
                                    {selectedAssessment?.submissionDate &&
                                      format(
                                        new Date(
                                          selectedAssessment.submissionDate
                                        ),
                                        "PPP"
                                      )}
                                  </div>
                                </CardContent>
                              </Card>
                            </div>

                            <div className="space-y-3">
                              <Label>Assign To</Label>
                              <RadioGroup
                                defaultValue="all"
                                value={assignTo}
                                onValueChange={setAssignTo}
                                className="space-y-3"
                              >
                                <div className="flex items-center space-x-2">
                                  <RadioGroupItem value="all" id="all" />
                                  <Label
                                    htmlFor="all"
                                    className="cursor-pointer"
                                  >
                                    All Candidates
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

                            {assignTo === "individual" && (
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
                            <Button onClick={handleAssign} className="w-full">
                              Assign Assessment
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
          <div className="text-center text-muted-foreground">
            <FileText className="h-12 w-12 mx-auto mb-2 opacity-30" />
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
