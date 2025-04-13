import UploadApplication from "@/components/Application/UploadApplication";

const FileUpload = () => {
  return (
    <section className="ml-5 mr-5 mt-5  border-t-2">
      <div className="space-y-2">
        <h1 className="font-bold text-3xl">Upload Application Details</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Upload your video file and other media in here
        </p>
      </div>
      <div>
        <UploadApplication />
      </div>
    </section>
  );
};

export default FileUpload;
