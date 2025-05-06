import type React from 'react';

import { CloudUpload, File, FileCheck, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { isValidFileType } from '@/utils/supportedFileType';

interface FileUploadProps {
  onFileChange: (file: File) => void;
  showButton?: boolean;
  handleClose?: (arg: boolean) => void;
}

const FileUpload = ({
  onFileChange,
  showButton = false,
  handleClose,
}: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (file) {
      onFileChange(file);
    }
  }, [file, onFileChange]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (isValidFileType(selectedFile)) {
        setFile(selectedFile);
        toast.success('File uploaded');
      } else {
        toast.error(
          'Invalid file type. Please upload PDF, DOC, or DOCX files only.'
        );
      }
    }
  };

  const handleRemove = () => {
    setFile(null);
    toast.info('File removed');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (
      e.dataTransfer.files &&
      e.dataTransfer.files[0] &&
      isValidFileType(droppedFile)
    ) {
      setFile(e.dataTransfer.files[0]);
      toast.success('File uploaded');
    } else if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      toast.error(
        'Invalid file type. Please upload PDF, DOC, or DOCX files only.'
      );
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
    else return (bytes / 1048576).toFixed(1) + ' MB';
  };

  return (
    <div className="relative w-full">
      <div className="flex items-center justify-between">
        <h2 className="text-primary mb-4 flex items-center gap-2 text-xl font-semibold">
          <CloudUpload className="h-5 w-5" />
          Upload file
        </h2>
        {showButton && (
          <Button
            variant="outline"
            size="sm"
            className="text-sm"
            onClick={() => handleClose?.(false)}
          >
            Close
          </Button>
        )}
      </div>
      <div
        className={`relative w-full border-2 ${
          isDragging ? 'border-primary bg-primary/5' : 'border-dotted'
        } hover:border-primary/70 flex h-[300px] w-full max-w-md flex-col items-center justify-center rounded-2xl border-dashed p-6 transition-all duration-300`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <AnimatePresence mode="wait">
          {!file ? (
            <motion.div
              key="upload"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex flex-col items-center"
            >
              <span className="bg-primary/10 mb-4 flex h-16 w-16 items-center justify-center rounded-full">
                <CloudUpload className="text-primary h-8 w-8" />
              </span>
              <h3 className="text-foreground mb-2 text-lg font-bold">
                Select File to Upload
              </h3>
              <p className="text-muted-foreground mb-1 text-center text-sm">
                Supported Format (.pdf, .doc, .docx)
              </p>
              <p className="text-muted-foreground mb-4 text-sm">
                Max size 10MB
              </p>

              <label className="relative cursor-pointer">
                <Button className="relative z-10 cursor-pointer">
                  Choose File
                </Button>
                <Input
                  type="file"
                  accept=".doc,.docx,.pdf"
                  onChange={handleFileChange}
                  className="absolute inset-0 z-20 w-full cursor-pointer opacity-0"
                />
              </label>

              <p className="text-muted-foreground mt-3 text-sm">
                or drag and drop your file here
              </p>
            </motion.div>
          ) : (
            <motion.div
              key="file"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-xs"
            >
              <Button
                variant="ghost"
                size="icon"
                className="bg-background hover:bg-destructive hover:text-destructive-foreground absolute -top-2 -right-2 h-8 w-8 rounded-full shadow-md"
                onClick={handleRemove}
              >
                <X size={16} />
              </Button>

              <motion.div
                className="bg-card rounded-xl border p-4 shadow-md"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              >
                <div className="flex items-start gap-3">
                  <div className="bg-primary/10 rounded-lg p-3">
                    <File className="text-primary h-8 w-8" />
                  </div>

                  <div className="flex-1 overflow-hidden">
                    <h4 className="text-foreground truncate font-medium">
                      {file.name}
                    </h4>
                    <p className="text-muted-foreground text-xs">
                      {formatFileSize(file.size)}
                    </p>

                    <div className="bg-muted mt-3 h-1.5 w-full rounded-full">
                      <motion.div
                        className="bg-primary h-full rounded-full"
                        initial={{ width: 0 }}
                        animate={{ width: '100%' }}
                        transition={{ duration: 1 }}
                      />
                    </div>

                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-muted-foreground text-xs">
                        100% complete
                      </span>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1.2, type: 'spring' }}
                      >
                        <FileCheck className="h-5 w-5 text-green-500" />
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="text-primary mt-4 text-center text-sm font-medium"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 2 }}
              >
                File uploaded successfully!
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FileUpload;
