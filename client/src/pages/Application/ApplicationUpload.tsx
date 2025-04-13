import FileUpload from "@/components/Application/ApplicationDetailForm";
import UploadApplication from "@/components/Application/FileUpload";

const ApplicationUpload = () => {
  return (
    <section className="ml-5 mr-5 mt-5  ">
      <div className="space-y-2 pb-6 border-b">
        <h1 className="font-bold text-3xl">Upload Application Details</h1>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Upload your video file and other media in here
        </p>
      </div>
      <div className="flex flex-col  md:flex-row gap-5 mt-6">
        <UploadApplication />
        <FileUpload />
      </div>
    </section>
  );
};

export default ApplicationUpload;
