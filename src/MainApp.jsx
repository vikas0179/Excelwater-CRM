import React, { Suspense, lazy } from "react";
import LoaderPage from "./components/LoaderPage";

const App = lazy(() => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(import("./App")), 100);
  });
});

const MainApp = () => {
  return (
    <>
      <Suspense fallback={<LoaderPage />}>
        <App />
      </Suspense>
    </>
  );
};

export default MainApp;
