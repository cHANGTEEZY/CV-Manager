import { Pi, Send, X } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useState } from "react";
import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import {
  SuccessMail,
  RejectionMail,
  AssignmentMail,
} from "@/constants/EmailDraft";

const emailTemplates = {
  SuccessMail,
  RejectionMail,
  AssignmentMail,
};

const data = [
  {
    email: "sushank@gmail.com",
    name: "Sushank Gurung",
  },
  {
    email: "alex@gmail.com",
    name: "Alex Maharjan",
  },
  {
    email: "aryan@gmail.com",
    name: "Aryan Shrestha",
  },
  {
    email: "binit@gmail.com",
    name: "Binit Maharjan",
  },
];

const EmailBody = () => {
  const [recepients, setRecepients] = useState(data);
  const [emailType, setEmailType] = useState("SuccessMail");
  const [subject, setSubject] = useState("");

  const handleRemoveApplicant = (email: string) => {
    setRecepients((prev) => prev.filter((r) => r.email !== email));
  };

  const handleSubjectChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length > 200) {
      return toast.error("Subject length limit");
    }
    setSubject(newValue);
  };

  const mailValueChange = (value: string) => {
    setEmailType(value);
  };

  const selectedTemplate = emailTemplates[emailType];

  return (
    <div className="w-full  mx-auto">
      <div className="w-[750px] flex justify-end mb-2">
        <Select onValueChange={mailValueChange} value={emailType}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="SuccessMail">Success Email</SelectItem>
            <SelectItem value="RejectionMail">Rejection Email</SelectItem>
            <SelectItem value="AssignmentMail">Assignment Email</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Card className="w-full max-w-[750px] px-5 py-10">
        <CardHeader className="space-y-4 p-0">
          <div className="flex items-center flex-col sm:flex-row border-b pb-3">
            <div className="flex items-center mb-2 sm:mb-0">
              <p className="mr-4 text-sm font-medium">To:</p>
            </div>
            <div className="flex-1 flex flex-wrap gap-2">
              {recepients.map((recepient) => (
                <span
                  key={recepient.email}
                  className="flex items-center gap-1 shadow-sm bg-muted/50 p-1 pl-1 pr-2 rounded-full"
                >
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs">
                      {recepient.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <p className="text-xs">{recepient.email}</p>
                  <button
                    className="p-0.5 rounded-full hover:bg-muted/80 transition-colors"
                    onClick={() => handleRemoveApplicant(recepient.email)}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-4 mt-2 sm:mt-0 sm:ml-auto">
              <button className="text-xs text-muted-foreground hover:text-foreground">
                Cc
              </button>
              <button className="text-xs text-muted-foreground hover:text-foreground">
                Bcc
              </button>
            </div>
          </div>
          <div className="flex flex-col items-center sm:flex-row  sm:items-start gap-2 pb-5 border-b">
            <p className="text-sm font-medium w-[70px]">Subject:</p>

            <Input
              type="text"
              value={subject}
              onChange={handleSubjectChange}
              placeholder="Subject"
              className="w-full bg-transparent text-sm  focus:outline-none border-b border-transparent focus:border-primary/30 transition-colors"
            />

            <span className="text-slate-400 text-sm">200/{subject.length}</span>
          </div>
        </CardHeader>
        <CardDescription>
          <div className="space-y-4">
            {selectedTemplate ? (
              <>
                <h1 className="font-semibold">{selectedTemplate.header}</h1>
                <p className="whitespace-pre-line">{selectedTemplate.body}</p>
                <p className="mt-4 whitespace-pre-line text-sm text-muted-foreground">
                  {selectedTemplate.footer}
                </p>
              </>
            ) : (
              <p className="text-sm text-muted-foreground">
                Please select an email type to preview the message.
              </p>
            )}
          </div>
        </CardDescription>
        <CardFooter className="border-t p-0 flex justify-end">
          <Button>
            Send <Send />
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default EmailBody;
