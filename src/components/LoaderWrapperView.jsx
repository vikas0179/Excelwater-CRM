const LoaderWrapperView = (props) => {
  return props.isLoading ? (
    <div className={`${props.className || ""}`}>
      <div className="p-3 flex flex-col items-center justify-center">
        <div className="w-6 h-6 rounded-full animate-spin border-2 border-solid border-slate-900 dark:border-slate-200 border-t-transparent"></div>
      </div>
    </div>
  ) : (
    props.children || ""
  );
};

export default LoaderWrapperView;
