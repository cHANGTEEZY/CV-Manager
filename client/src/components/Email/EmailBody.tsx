import { Paperclip, Send, X } from "lucide-react";
import { Avatar, AvatarFallback } from "../ui/avatar";
import { useState, useEffect } from "react";
import { Card, CardDescription, CardFooter, CardHeader } from "../ui/card";
import { Button } from "../ui/button";
import { toast } from "sonner";
import { Input } from "../ui/input";
import "../../assets/styles/animation.css";
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
import { Textarea } from "../ui/textarea";
import FileUpload from "../Application/FileUpload";
import { AnimatePresence, motion } from "framer-motion";

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
  const [toggleFileDrop, setToggleFileDrop] = useState(false);
  const [file, setFile] = useState();
  console.log(file);
  console.log(toggleFileDrop);
  const [message, setMessage] = useState({
    header: "",
    body: "",
    footer: "",
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    const selected = emailTemplates[emailType];
    setMessage({
      header: selected.header,
      body: selected.body,
      footer: selected.footer,
    });
  }, [emailType]);

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

  const handleMessageChange = (field: string, value: string) => {
    setMessage((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (file) => {
    setFile(file);
  };

  const sendEmail = async () => {
    if (!subject.trim()) {
      return toast.error("Please add a subject");
    }
    if (recepients.length === 0) {
      return toast.error("No recipients selected");
    }

    if (toggleFileDrop && !file) {
      return toast.error("You have not uploaded file");
    }

    setSendingMessage(true);

    console.log("Sending email to:", recepients);
    console.log("Subject:", subject);
    console.log("Message:", message);
    setSendingMessage(false);
    toast.success("Emails sent successfully!");
    setSubject("");
  };

  return (
    <section className="flex-col md:flex-row   flex gap-4">
      <div>
        <div className="w-[750px] flex justify-end mb-2">
          <Select onValueChange={setEmailType} value={emailType}>
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
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="flex items-center flex-col sm:flex-row border-b pb-3"
            >
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
                      <AvatarFallback className="text-xs bg-primary-foreground">
                        {recepient.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-xs">{recepient.email}</p>
                    <button
                      className="p-0.5 cursor-pointer rounded-full hover:bg-muted/80 transition-colors"
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
            </motion.div>

            <div className="flex flex-col items-center sm:flex-row sm:items-start gap-2 pb-5 border-b">
              <p className="text-sm font-medium w-[70px]">Subject:</p>
              <Input
                type="text"
                value={subject}
                onChange={handleSubjectChange}
                placeholder="Subject"
                className="w-full bg-transparent text-sm focus:outline-none border-b border-transparent focus:border-primary/30 transition-colors"
              />
              <span className="text-slate-400 text-sm">
                {subject.length}/200
              </span>
            </div>
          </CardHeader>
          <CardDescription>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-4"
            >
              <Input
                type="text"
                value={message.header}
                onChange={(e) => handleMessageChange("header", e.target.value)}
                className="font-semibold"
                placeholder="Header"
              />
              <Textarea
                value={message.body}
                onChange={(e) => handleMessageChange("body", e.target.value)}
                className="whitespace-pre-line"
                placeholder="Body"
              />
              <Textarea
                value={message.footer}
                onChange={(e) => handleMessageChange("footer", e.target.value)}
                className="mt-4 whitespace-pre-line text-sm text-muted-foreground"
                placeholder="Footer"
              />
            </motion.div>
          </CardDescription>

          <CardFooter
            className="border-t p-0 flex justify-between mt-6 pt-6"
            as={motion.div}
            layout
            transition={{
              layout: { duration: 0.3, ease: "easeInOut" },
              type: "spring",
              stiffness: 300,
              damping: 30,
            }}
          >
            <motion.div
              layout
              className="flex items-center"
              transition={{
                layout: { duration: 0.2, ease: "easeInOut" },
                type: "spring",
                stiffness: 300,
                damping: 30,
              }}
            >
              <AnimatePresence mode="popLayout">
                {!toggleFileDrop ? (
                  <motion.div
                    key="attach-button"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Button onClick={() => setToggleFileDrop(!toggleFileDrop)}>
                      <Paperclip />
                    </Button>
                  </motion.div>
                ) : (
                  <motion.div
                    key="file-upload"
                    className="w-full"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <FileUpload
                      onFileChange={handleFileChange}
                      showButton={true}
                      handleClose={() => setToggleFileDrop(!toggleFileDrop)}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div layout>
              <motion.div
                whileHover={{
                  scale: 1.02,
                }}
                whileTap={{
                  scale: 0.98,
                }}
              >
                <Button onClick={sendEmail} disabled={sendingMessage}>
                  {!sendingMessage ? (
                    <>
                      Send message <Send />
                    </>
                  ) : (
                    <div>Sending...</div>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          </CardFooter>
        </Card>
      </div>
    </section>
  );
};

export default EmailBody;
