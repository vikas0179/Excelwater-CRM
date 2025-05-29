import React from "react";

const LoaderPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center">
      <div
        className="w-12 h-12 rounded-full animate-spin
            border-2 border-solid border-slate-900 dark:border-slate-200 border-t-transparent"
      ></div>
    </div>
  );
};

export default LoaderPage;
