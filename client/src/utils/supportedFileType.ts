export const isValidFileType = (file: File) => {
  const allowedTypes = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/msword",
  ];
  return allowedTypes.includes(file.type);
};
