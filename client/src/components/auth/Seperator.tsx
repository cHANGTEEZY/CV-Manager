const Seperator = () => {
  return (
    <div className="relative flex items-center justify-center  my-2">
      <div className="absolute inset-0 flex items-center">
        <span className="w-full border-t" />
      </div>
      <span className="relative px-3 text-sm text-muted-foreground bg-card">
        or
      </span>
    </div>
  );
};

export default Seperator;
