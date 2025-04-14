import { toast } from "sonner";

export const isValidFileType = (file: File) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];
  toast.error("Dropped file not supported");
  toast.info("Use .doc,.pdf or .docx filed");
  return allowedTypes.includes(file.type);
};
