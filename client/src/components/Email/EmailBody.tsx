import { Paperclip, Send, X } from 'lucide-react';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { useState, useEffect, useRef } from 'react';
import { Card, CardDescription, CardFooter, CardHeader } from '../ui/card';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { Input } from '../ui/input';
import '../../assets/styles/animation.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  SuccessMail,
  RejectionMail,
  AssignmentMail,
} from '@/constants/EmailDraft';
import { Textarea } from '../ui/textarea';
import FileUpload from '../Application/FileUpload';
import { AnimatePresence, motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { supabase } from '@/utils/supabaseClient';

const emailTemplates = {
  SuccessMail,
  RejectionMail,
  AssignmentMail,
};

const EmailBody = ({
  setCandidateStatus,
  matchingCandidates,
}: {
  setCandidateStatus: (type: string) => void;
  matchingCandidates: any[];
}) => {
  const [recepients, setRecepients] = useState([]);
  const [emailType, setEmailType] = useState('SuccessMail');
  const [subject, setSubject] = useState('');
  const [toggleFileDrop, setToggleFileDrop] = useState(false);
  const [file, setFile] = useState();
  const [message, setMessage] = useState({
    header: '',
    body: '',
    footer: '',
  });
  const [sendingMessage, setSendingMessage] = useState(false);

  useEffect(() => {
    emailjs.init(import.meta.env.VITE_EMAILJS_PUBLIC_KEY);
  }, []);

  useEffect(() => {
    setRecepients(matchingCandidates || []);
  }, [matchingCandidates]);

  useEffect(() => {
    setCandidateStatus(emailType);
  }, [emailType, setCandidateStatus]);

  useEffect(() => {
    const selected = emailTemplates[emailType];
    if (selected) {
      setMessage({
        header: selected.header,
        body: selected.body,
        footer: selected.footer,
      });
    }
  }, [emailType]);

  const handleRemoveApplicant = (email: string) => {
    setRecepients((prev) => prev.filter((r) => r.email !== email));
  };

  const handleSubjectChange = (e) => {
    const newValue = e.target.value;
    if (newValue.length > 200) {
      return toast.error('Subject length limit');
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
      return toast.error('Please add a subject');
    }
    if (recepients.length === 0) {
      return toast.error('No recipients selected');
    }

    if (toggleFileDrop && !file) {
      return toast.error('You have not uploaded file');
    }

    const invalidEmails = recepients.filter((r) => !r.email || !r.email.trim());
    if (invalidEmails.length > 0) {
      return toast.error('Some recipients have invalid email addresses');
    }

    setSendingMessage(true);

    try {
      const emailContent = `${message.header}\n\n${message.body}\n\n${message.footer}`;

      const sendPromises = recepients.map((recipient) => {
        if (!recipient.email || !recipient.email.trim()) {
          throw new Error(
            `Invalid email for recipient: ${recipient.name || 'Unknown'}`
          );
        }

        const templateParams = {
          to_email: recipient.email.trim(),
          to_name: recipient.name || 'Candidate',
          subject: subject,
          message: emailContent,
          reply_to: recipient.email.trim(),
        };

        console.log('Sending email to:', recipient.email);

        return emailjs.send(
          import.meta.env.VITE_EMAILJS_SERVICE_ID,
          import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
          templateParams
        );
      });

      const statusMap: Record<string, { verdict: string; status: string }> = {
        RejectionMail: { verdict: 'Failed', status: 'Rejected' },
        SuccessMail: { verdict: 'Hired', status: 'Hired' },
        AssignmentMail: { verdict: 'Task', status: 'Assigned' },
      };

      const statusObj = statusMap[emailType];

      if (statusObj) {
        const applicantIds = recepients
          .map((recipient) => recipient.id)
          .filter(Boolean);

        if (applicantIds.length > 0) {
          const { error: applicantDetailError } = await supabase
            .from('applicant_details')
            .update({
              applicant_verdict: statusObj.verdict,
              applicant_status: statusObj.status,
              applicant_timeline: 7,
            })
            .in('id', applicantIds);

          if (applicantDetailError) {
            console.error(
              'Error updating applicant status:',
              applicantDetailError
            );
            toast.error('Failed to update applicant status in database');
          } else {
            console.log(
              `Updated ${applicantIds.length} applicants to status: ${statusObj.verdict}`
            );
          }
        }
      }

      const results = await Promise.all(sendPromises);
      console.log('Email results:', results);

      toast.success('Emails sent successfully!');
      setSubject('');
    } catch (error) {
      console.error('Error sending email:', error);

      if (error.status === 422) {
        toast.error('Error: Recipient email address is empty or invalid');
      } else {
        toast.error(
          `Failed to send emails: ${
            error.text || error.message || 'Unknown error'
          }`
        );
      }
    } finally {
      setSendingMessage(false);
    }
  };

  return (
    <section className="flex flex-col gap-4 md:flex-row">
      <div>
        <div className="mb-2 flex w-[750px] justify-end">
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
              className="flex flex-col items-center border-b pb-3 sm:flex-row"
            >
              <div className="mb-2 flex items-center sm:mb-0">
                <p className="mr-4 text-sm font-medium">To:</p>
              </div>
              <div className="flex flex-1 flex-wrap gap-2">
                {recepients.length > 0 ? (
                  recepients.map((recepient) => (
                    <span
                      key={recepient.email}
                      className="bg-muted/50 flex items-center gap-1 rounded-full p-1 pr-2 pl-1 shadow-sm"
                    >
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="bg-gradient-moss text-xs text-gray-500">
                          {recepient.name
                            ? recepient.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                            : '??'}
                        </AvatarFallback>
                      </Avatar>
                      <p className="text-xs">{recepient.email}</p>
                      <button
                        className="hover:bg-muted/80 cursor-pointer rounded-full p-0.5 transition-colors"
                        onClick={() => handleRemoveApplicant(recepient.email)}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))
                ) : (
                  <p className="text-center text-sm text-red-300">
                    No eligible candidates available
                  </p>
                )}
              </div>
              <div className="mt-2 flex gap-4 sm:mt-0 sm:ml-auto">
                <button className="text-muted-foreground hover:text-foreground text-xs">
                  Cc
                </button>
                <button className="text-muted-foreground hover:text-foreground text-xs">
                  Bcc
                </button>
              </div>
            </motion.div>

            <div className="flex flex-col items-center gap-2 border-b pb-5 sm:flex-row sm:items-start">
              <p className="w-[70px] text-sm font-medium">Subject:</p>
              <Input
                type="text"
                value={subject}
                onChange={handleSubjectChange}
                placeholder="Subject"
                className="focus:border-primary/30 w-full border-b border-transparent bg-transparent text-sm transition-colors focus:outline-none"
              />
              <span className="text-sm text-slate-400">
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
                onChange={(e) => handleMessageChange('header', e.target.value)}
                className="font-semibold"
                placeholder="Header"
              />
              <Textarea
                value={message.body}
                onChange={(e) => handleMessageChange('body', e.target.value)}
                className="whitespace-pre-line"
                placeholder="Body"
              />
              <Textarea
                value={message.footer}
                onChange={(e) => handleMessageChange('footer', e.target.value)}
                className="text-muted-foreground mt-4 text-sm whitespace-pre-line"
                placeholder="Footer"
              />
            </motion.div>
          </CardDescription>

          <CardFooter
            className="mt-6 flex justify-between border-t p-0 pt-6"
            as={motion.div}
            layout
            transition={{
              layout: { duration: 0.3, ease: 'easeInOut' },
              type: 'spring',
              stiffness: 300,
              damping: 30,
            }}
          >
            <motion.div
              layout
              className="flex items-center"
              transition={{
                layout: { duration: 0.2, ease: 'easeInOut' },
                type: 'spring',
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
